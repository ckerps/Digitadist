// src/api/usuarios.api.ts

import { Usuario } from "@prisma/client";
import { FiltrosUsuario, NuevoUsuario, UsuarioPaginado, UpdateUsuario } from "@/types/usuario";

const BASE_URL = '/api/usuarios';

export interface ApiError extends Error {
  details?: Record<string, string[]>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.error || 'Error en la solicitud') as ApiError;
    error.details = errorData?.details; 
    throw error;
  }
  return response.json();
}

export const usuariosApi = {
  async getAll({ filters, itemsPerPage, currentPage }: { 
    filters?: FiltrosUsuario, 
    itemsPerPage?: number, 
    currentPage?: number 
  }): Promise<UsuarioPaginado> {
    
    const url = new URL(BASE_URL, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    if (itemsPerPage) url.searchParams.append('itemsPerPage', itemsPerPage.toString());
    if (currentPage) url.searchParams.append('currentPage', currentPage.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<UsuarioPaginado>(response);
  },

  async getById(id: number): Promise<Usuario> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<Usuario>(response);
  },


  async create(usuario: NuevoUsuario): Promise<Usuario> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
      credentials: 'include',
    });
    return handleResponse<Usuario>(response);
  },


  async update(id: number, usuario: UpdateUsuario): Promise<Usuario> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
      credentials: 'include',
    });
    return handleResponse<Usuario>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await handleResponse(response);
  }
};