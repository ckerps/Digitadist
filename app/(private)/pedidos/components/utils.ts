import { EnumEstadoPago, EnumEstadoPedido } from "@prisma/client";

export const getEstadoBadge = (estado: EnumEstadoPedido) => {
  const variants: Record<string, { label: string; className: string }> = {
    entregado: { label: 'Entregado', className: 'bg-green-600 hover:bg-green-700' },
    registrado: { label: 'Registrado', className: 'bg-blue-600 hover:bg-blue-700' },
    finalizado: { label: 'Finalizado', className: 'bg-neutral-600 hover:bg-neutral-700' },
    en_preparacion: { label: 'En Preparación', className: 'bg-amber-600 hover:bg-amber-700' },
    cancelado: { label: 'Cancelado', className: 'bg-red-600 hover:bg-red-700' },
  };
  return variants[estado] || variants.registrado;
};

export const getPagoBadge = (pago: EnumEstadoPago) => {
  return pago === EnumEstadoPago.pagado
    ? { label: 'Pagado', className: 'bg-green-600 hover:bg-green-700' }
    : { label: 'En Deuda', className: 'bg-red-600 hover:bg-red-700' };
};