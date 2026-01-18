// src/api/pedidos.api.ts

import { NuevoPedido, Pedido, PedidosPaginado } from "@/types/pedido";



const BASE_URL = '/api/pedidos';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || 'Error en la solicitud');
  }
  return response.json();
}

export const pedidosApi = {
  async getAll(filters: Partial<Pedido>): Promise<PedidosPaginado> {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      credentials: 'include',
      body: JSON.stringify(filters),
    });
    return handleResponse(response);
  },

  async getById(id: string): Promise<Pedido> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async create(cliente: NuevoPedido): Promise<Pedido> {
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

  async update(id: string, pedido: Partial<Pedido>): Promise<Pedido> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
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
