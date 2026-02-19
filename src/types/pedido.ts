import { DetallePedido, EnumCondicionVenta, EnumEstadoPago, EnumEstadoPedido, Pedido, Producto } from "@prisma/client";

export interface NuevoPedido {
  cliente_id: number;
  vendedor_id: number;
  total: number;
  costo: number;
  descuento?: number;
  estado: EnumEstadoPedido;
  estado_pago: EnumEstadoPago;
  direccion_entrega: string;
  fecha_entrega_estimada: Date;
  condicion_venta: EnumCondicionVenta;
}

export interface UpdatePedido {
  total?: number;
  costo?: number;
  descuento?: number;
  estado?: EnumEstadoPedido;
  estado_pago?: EnumEstadoPago;
  direccion_entrega?: string;
  fecha_entrega_estimada?: Date;
  condicion_venta?: EnumCondicionVenta;
}

export interface PedidosPaginado {
  pedidos: Pedido[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface NuevoDetallePedido {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number;
}

export interface UpdateDetallePedido {
  producto_id: number;
  pedido_id: number;
  cantidad?: number;
  precio_unitario?: number;
  descuento?: number;
  subtotal?: number;
}

export interface FiltrosPedido {
  cliente_id?: number;
  vendedor_id?: number;
  estado?: EnumEstadoPedido;
  estado_pago?: EnumEstadoPago;
  direccion_entrega?: string;
  fecha_entrega_estimada?: Date;
  condicion_venta?: EnumCondicionVenta;
}

export interface PedidoConProductos extends Pedido {
  detallePedidos: (DetallePedido & { producto: Producto})[];
}