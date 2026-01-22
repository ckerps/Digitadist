export type TipoCliente = 'razon_social' | 'persona';

export interface Cliente {
  id: number;
  tipo: TipoCliente;
  nombre: string;
  apellido?: string;
  direccion: string;
  cuit: string;
  telefono: string;
}


export interface NuevoCliente {
  nombre: string;
  apellido?: string;
  telefono: string;
  cuit: string;
  direccion: string;
  tipo: TipoCliente;
}

export interface ClientePaginado {
  clientes: Cliente[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}