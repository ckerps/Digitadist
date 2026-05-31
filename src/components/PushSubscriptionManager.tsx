'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default function PushSubscriptionManager() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      subscribeToPush();
    }
  }, [session]);

  const subscribeToPush = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push work and/or Push messaging is not supported');
        return;
      }

      // Esperar a que el SW esté listo y activo
      const registration = await navigator.serviceWorker.ready;

      // Pequeña espera para asegurar que el SW esté "activado"
      if (registration.active?.state !== 'activated') {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Obtener suscripción existente
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Obtener la Public Key del servidor
        const response = await fetch('/api/push/vapid-key');
        const data = await response.json();

        if (!data.publicKey) {
          console.log('No se pudo obtener la VAPID Public Key');
          return;
        }

        const convertedVapidKey = urlBase64ToUint8Array(data.publicKey);

        // Suscribir al usuario
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }

      if (!subscription) throw new Error('No se pudo crear la suscripción');

      // IMPORTANTE: Usar .toJSON() para asegurar que endpoint y keys sean serializados correctamente
      const subJSON = subscription.toJSON();

      // Enviar suscripción al backend
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subJSON),
      });

      if (res.ok) {
        console.log('[Push] Suscripción sincronizada con éxito');
        // No mostramos toast cada vez para no molestar, solo si es la primera vez (opcional)
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error en el servidor al guardar suscripción');
      }

    } catch (error) {
      console.log('[Push] Error en el proceso de suscripción:', error);
      toast.error('Error al activar notificaciones push', {
        description: 'Por favor, asegúrate de haber dado permisos en tu navegador.'
      });
    }
  };

  return null;
}

