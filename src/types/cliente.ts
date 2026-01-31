import { Cliente, EnumTipoCliente } from "@/generated/prisma/client";

export interface NuevoCliente {
  nombre: string;
  telefono: string;
  cuit?: string;
  direccion: string;
  tipo: EnumTipoCliente;
  email: string;
  activo: boolean;
}

export interface UpdateCliente {
  id: number;
  nombre?: string;
  telefono?: string;
  cuit?: string;
  direccion?: string;
  tipo?: EnumTipoCliente;
  email?: string;
  activo?: boolean;
}

export interface ClientePaginado {
  clientes: Cliente[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface FiltrosCliente {
  id?: number;
  nombre?: string;
  telefono?: string;
  cuit?: string;
  tipo?: EnumTipoCliente;
  email?: string;
  activo?: boolean;
}