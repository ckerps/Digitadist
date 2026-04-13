'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

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

      // Esperar a que el SW esté listo
      const registration = await navigator.serviceWorker.ready;

      // Obtener suscripción existente
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Obtener la Public Key del servidor
        const response = await fetch('/api/push/vapid-key');
        const data = await response.json();
        
        if (!data.publicKey) {
          console.error('No se pudo obtener la VAPID Public Key');
          return;
        }

        const convertedVapidKey = urlBase64ToUint8Array(data.publicKey);

        // Suscribir al usuario
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }

      // Enviar suscripción al backend para guardarla/actualizarla
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      console.log('[Push] Suscripción exitosa');
    } catch (error) {
      console.error('[Push] Error en el proceso de suscripción:', error);
    }
  };

  return null; // Este componente no renderiza nada, solo ejecuta la lógica
}
