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
  async getAll({filters, itemsPerPage, currentPage} : {filters?: Partial<Pedido>, itemsPerPage?: number, currentPage?: number}): Promise<PedidosPaginado> {
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

  async getById(id: number): Promise<Pedido> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async create(pedido: NuevoPedido): Promise<Pedido> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async update(id: number, pedido: Partial<Pedido>): Promise<Pedido> {
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

  async delete(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await handleResponse(response);
  },
};
