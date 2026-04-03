export interface Oferta {
  id: number;
  producto_id: number;
  tipo: 'monto' | 'porcentaje';
  valor: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  fecha_creacion: Date;
  fecha_actualizacion: Date | null;
  activa: boolean;
}

export interface OfertaConProducto extends Oferta {
  producto: {
    id: number;
    nombre: string;
    codigo: string;
    imagen?: string | null;
    costo: number;
    porcentaje_recargo: number;
  };
}


export interface NuevaOferta {
  producto_id: number;
  tipo: 'monto' | 'porcentaje';
  valor: number;
  fecha_inicio: Date | string;
  fecha_fin: Date | string;
}

export interface ActualizarOferta {
  tipo?: 'monto' | 'porcentaje';
  valor?: number;
  fecha_inicio?: Date | string;
  fecha_fin?: Date | string;
  activa?: boolean;
}

export interface RenovarOferta {
  nueva_fecha_fin: Date | string;
}

export interface OfertaPaginada {
  ofertas: OfertaConProducto[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FiltrosOferta {
  id?: number | string;
  producto_id?: number | string;
  tipo?: 'monto' | 'porcentaje' | string;
  estado?: 'activa' | 'inactiva' | string;
  fecha_inicio_desde?: string;
  fecha_inicio_hasta?: string;
  fecha_fin_desde?: string;
  fecha_fin_hasta?: string;
  fecha_creacion_desde?: string;
  fecha_creacion_hasta?: string;
}
