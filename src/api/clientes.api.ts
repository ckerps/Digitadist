// src/api/clientes.api.ts

import { Cliente, ClientePaginado, FiltrosCliente, NuevoCliente, UpdateCliente } from "@/types/cliente";

const BASE_URL = '/api/clientes';

// Tipamos mejor el error para que el frontend sepa si es de validación (Zod)
export interface ApiError extends Error {
  details?: Record<string, string[]>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error parsing response' }));
    const apiError = new Error(errorData || 'Unknown error') as ApiError;
    apiError.details = errorData.details;
    console.log('API Error:', apiError.message);
    throw apiError;
  }
  return response.json();
}

export const clientesApi = {
  
  async getAll({ filters, itemsPerPage, currentPage }: { 
    filters?: FiltrosCliente, 
    itemsPerPage?: number, 
    currentPage?: number 
  }): Promise<ClientePaginado> {
    
    // 1. Crear la URL dentro de la función para evitar acumular parámetros
    const url = new URL(BASE_URL, window.location.origin);
    
    // 2. Agregar paginación
    if (itemsPerPage) url.searchParams.append('itemsPerPage', itemsPerPage.toString());
    if (currentPage) url.searchParams.append('currentPage', currentPage.toString());
    
    // 3. Agregar filtros (solo si tienen valor)
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
    return handleResponse<ClientePaginado>(response);
  },

  async getById(id: number): Promise<Cliente> {
    const response = await fetch(`${BASE_URL}/${id}`, { 
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<Cliente>(response);
  },

  async create(cliente: NuevoCliente): Promise<Cliente> {
    console.log('Creating cliente:', cliente);
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
      credentials: 'include',
    });
    return handleResponse<Cliente>(response);
  },

  async update(id: number, cliente: UpdateCliente): Promise<Cliente> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
      credentials: 'include',
    });
    return handleResponse<Cliente>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await handleResponse(response);
  },
};