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
  async getAll(): Promise<ClientePaginado> {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async getById(id: string): Promise<Cliente> {
    const response = await fetch(`${BASE_URL}/${id}`, {
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

  async update(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
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

  async delete(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await handleResponse(response);
  },
};
