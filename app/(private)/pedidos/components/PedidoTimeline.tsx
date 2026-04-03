'use client';

import { EnumEstadoPedido } from '@prisma/client';
import { Check, Clock, Package, Truck, Flag, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PedidoTimelineProps {
  estado: EnumEstadoPedido;
}

const steps = [
  {
    id: 'registrado',
    label: 'Registrado',
    icon: Clock,
    color: 'bg-blue-500',
  },
  {
    id: 'en_preparacion',
    label: 'Preparación',
    icon: Package,
    color: 'bg-orange-500',
  },
  {
    id: 'entregado',
    label: 'Enviado',
    icon: Truck,
    color: 'bg-purple-500',
  },
  {
    id: 'finalizado',
    label: 'Finalizado',
    icon: Flag,
    color: 'bg-green-500',
  },
];

export function PedidoTimeline({ estado }: PedidoTimelineProps) {
  if (estado === 'cancelado') {
    return (
      <div className="flex items-center gap-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <XCircle className="h-6 w-6" />
        <div>
          <p className="font-bold">Pedido Cancelado</p>
          <p className="text-sm">Este pedido ha sido cancelado y no puede ser procesado.</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((step) => step.id === estado);

  return (
    <div className="w-full py-2 px-2">
      <div className="relative flex justify-between items-center w-full">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-100 -translate-y-1/2 z-0 hidden sm:block" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-red-600 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out hidden sm:block"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-4",
                  isCompleted ? "bg-red-600 border-red-600 text-white shadow-lg" :
                    isCurrent ? "bg-white border-red-600 text-red-600 shadow-md scale-110" :
                      "bg-white border-neutral-100 text-neutral-300"
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <div className="mt-2 text-center">
                <p className={cn(
                  "text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                  isCurrent ? "text-red-700" : isCompleted ? "text-neutral-900" : "text-neutral-400"
                )}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
