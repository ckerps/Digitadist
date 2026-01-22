import { AgregarProducto } from "./producto";

export enum EstadoPedido { entregado, registrado, finalizado, en_preparacion };
export enum EstadoPago { pagado, en_deuda };

export interface Pedido {
  id: number;
  direccionEntrega: string;
  fechaEstimada: string;
  estado: EstadoPedido;
  pago: EstadoPago;
  total: number;
  clienteId: number;
}

export interface NuevoPedido {
  direccionEntrega: string;
  fechaEstimada: string;
  total: number;
  clienteId: number;
  productos: AgregarProducto[]
}

export interface PedidosPaginado {
  pedidos: Pedido[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}