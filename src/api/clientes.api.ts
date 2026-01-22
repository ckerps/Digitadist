// src/api/clientes.api.ts

import { ClientePaginado, Cliente, NuevoCliente } from "@/types/cliente";


const BASE_URL = '/api/clientes';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || 'Error en la solicitud');
  }
  return response.json();
}

export const clientesApi = {
  async getAll({filters, itemsPerPage, currentPage} : {filters?: Partial<Cliente>, itemsPerPage?: number, currentPage?: number}): Promise<ClientePaginado> {
    const url = new URL(`${BASE_URL}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    if (itemsPerPage) url.searchParams.append('itemsPerPage', itemsPerPage.toString());
    if (currentPage) url.searchParams.append('currentPage', currentPage.toString());
    
    filters && Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async getById(id: string): Promise<Cliente> {
    const url = new URL(`${BASE_URL}/${id}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'); // URL absoluta
    const response = await fetch(url.toString(), { // Convierte a string para fetch
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async create(cliente: NuevoCliente): Promise<Cliente> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async update(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await handleResponse(response);
  },
};
