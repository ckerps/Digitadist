// src/api/productos.api.ts

import { FiltrosProducto, NuevoProducto, Producto, ProductosPaginado, UpdateProducto } from "@/types/producto";

const BASE_URL = '/api/productos';

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

export const productosApi = {
  async getAll({ filters, itemsPerPage, currentPage }: { 
    filters?: FiltrosProducto, 
    itemsPerPage?: number, 
    currentPage?: number 
  }): Promise<ProductosPaginado> {
    
    // URL local para evitar acumular parámetros de búsquedas previas
    const url = new URL(BASE_URL, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    if (itemsPerPage) url.searchParams.append('itemsPerPage', itemsPerPage.toString());
    if (currentPage) url.searchParams.append('currentPage', currentPage.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        // Solo agregamos si el valor es válido y no es un string vacío
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<ProductosPaginado>(response);
  },

  async getById(id: number): Promise<Producto> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<Producto>(response);
  },

  async create(producto: NuevoProducto): Promise<Producto> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
      credentials: 'include',
    });
    return handleResponse<Producto>(response);
  },

  async update(id: number, producto: UpdateProducto): Promise<Producto> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
      credentials: 'include',
    });
    return handleResponse<Producto>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await handleResponse(response);
  },
};