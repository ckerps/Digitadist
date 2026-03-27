import Prisma from "@prisma/client";

export interface NuevoUsuario {
    nombre: string;
    apellido: string;
    rol_id: number;
    email: string;
    telefono: string;
    password: string;
    activo: boolean;
}

export interface UpdateUsuario {
    nombre?: string;
    apellido?: string;
    rol_id?: number;
    email?: string;
    telefono?: string;
    password?: string;
    activo?: boolean;
}

export interface Usuario extends Prisma.Usuario {
    rol?: {
        id: number;
        nombre: string;
    };
}


export interface UsuarioPaginado {
  usuarios: Usuario[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface FiltrosUsuario {
    nombre?: string;
    apellido?: string;
    rol_id?: number;
    email?: string;
    activo?: boolean;
}