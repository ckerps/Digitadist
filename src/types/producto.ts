import { Categoria, EnumAtributosLog, EnumPresentacion, EnumTipoDescuento, Oferta} from "@prisma/client";

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  presentacion: EnumPresentacion;
  tam_pack: number;
  costo: number;
  porcentaje_recargo: number;
  stock_actual: number;
  stock_minimo: number | null;
  activo: boolean;
  imagen: string | null;
  categoria_id: number;
  categoria?: Categoria;
  fecha_vencimiento: Date | null;
  fecha_creacion: Date;
  fecha_actualizacion: Date | null;
  ofertas?: Oferta[];
}

export interface AgregarProducto {
  id: number;
  codigo: string;
  nombre: string;
  costo: number;
  recargo: number;
  cantidad: number;
  stock_actual?: number;
  oferta?: Oferta | null;
  usar_oferta?: boolean;
}

export interface NuevoProducto {
  codigo: string;
  nombre: string;
  presentacion: EnumPresentacion;
  tam_pack: number;
  costo: number;
  porcentaje_recargo: number;
  stock_actual: number;
  stock_minimo?: number;
  activo: boolean;
  imagen?: string;
  categoria_id: number;
  fecha_vencimiento?: Date;
}

export interface UpdateProducto {
  codigo?: string;
  nombre?: string;
  presentacion?: EnumPresentacion;
  tam_pack?: number;
  costo?: number;
  porcentaje_recargo?: number;
  stock_actual?: number;
  stock_minimo?: number;
  activo?: boolean;
  imagen?: string;
  categoria_id?: number;
  fecha_vencimiento?: Date;
}


export interface ProductosPaginado {
  productos: Producto[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface NuevoLogProducto {
  usuario_id: number;
  producto_id: number;
  atributo: EnumAtributosLog;
  valor_anterior: string;
  valor_nuevo: string;
}

export interface NuevaOferta {
  producto_id: number;
  tipo: EnumTipoDescuento;
  valor: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  activa: boolean;
}

export interface FiltrosProducto {
  codigo?: string;
  nombre?: string;
  presentacion?: EnumPresentacion;
  tam_pack?: number;
  stock_actual?: number;
  stock_minimo?: number;
  activo?: boolean;
  categoria_id?: number;
  fecha_vencimiento?: Date;
  pedido_id?: number;
}