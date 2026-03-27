import { DetallePedido, EnumCondicionVenta, EnumEstadoPago, EnumEstadoPedido, Producto, Cliente, Usuario } from "@prisma/client";
import { AgregarProducto } from "./producto";

export interface NuevoPedido {
  cliente_id?: number;
  vendedor_id?: number;
  total: number;
  costo: number;
  descuento?: number;
  estado: EnumEstadoPedido;
  estado_pago: EnumEstadoPago;
  direccion_entrega: string;
  fecha_entrega_estimada: Date;
  condicion_venta: EnumCondicionVenta;
  productos?: AgregarProducto[];
}

export interface Pedido {
  id: number;
  cliente_id: number;
  vendedor_id: number;
  total: number;
  costo: number;
  descuento?: number | null;
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
  descuento?: number;
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
  searchTerm?: string;
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
  cliente: Cliente;
  vendedor: Usuario;
}