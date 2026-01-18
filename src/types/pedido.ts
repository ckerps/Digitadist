export type EstadoPedido = 'entregado' | 'registrado' | 'finalizado' | 'en_preparacion';
export type EstadoPago = 'pagado' | 'en_deuda';

export interface Pedido {
  id: string;
  direccionEntrega: string;
  fechaEstimada: string;
  estado: EstadoPedido;
  pago: EstadoPago;
  total: number;
  clienteId: string;
}

export interface NuevoPedido {
  direccionEntrega: string;
  fechaEstimada: string;
  estado: EstadoPedido;
  pago: EstadoPago;
  total: number;
  clienteId: string;
}

export interface PedidosPaginado {
  pedidos: Pedido[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}