// src/api/pedidos.api.ts

import { Pedido } from "@prisma/client"; // Asegúrate de importar el tipo de Prisma
import { FiltrosPedido, NuevoPedido, PedidoConProductos, PedidosPaginado } from "@/types/pedido";

const BASE_URL = '/api/pedidos';

export interface ApiError extends Error {
  details?: Record<string, string[]>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.error || 'Error en la solicitud') as ApiError;
    // Esto captura errores de validación de Zod o de stock insuficiente
    error.details = errorData?.details; 
    throw error;
  }
  return response.json();
}

export const pedidosApi = {
  async getAll({ filters, itemsPerPage, currentPage }: { 
    filters?: FiltrosPedido, 
    itemsPerPage?: number, 
    currentPage?: number 
  }): Promise<PedidosPaginado> {
    
    // IMPORTANTE: URL local a la función para no acumular parámetros de búsqueda
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
    return handleResponse<PedidosPaginado>(response);
  },

  async getById(id: number): Promise<PedidoConProductos> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<PedidoConProductos>(response);
  },

  async create(pedido: NuevoPedido): Promise<Pedido> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
      credentials: 'include',
    });
    return handleResponse<Pedido>(response);
  },

  async update(id: number, pedido: Partial<PedidoConProductos>): Promise<PedidoConProductos> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
      credentials: 'include',
    });
    return handleResponse<PedidoConProductos>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await handleResponse(response);
  },

  async agregarProducto(
    pedidoId: number,
    detalle: {
      producto_id: number;
      cantidad: number;
      precio_unitario: number;
      descuento?: number;
      subtotal: number;
    }
  ): Promise<PedidoConProductos> {
    const response = await fetch(`${BASE_URL}/${pedidoId}/detalles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle),
      credentials: 'include',
    });
    return handleResponse<PedidoConProductos>(response);
  },

  async actualizarDetalle(
    pedidoId: number,
    productoId: number,
    detalle: {
      cantidad: number;
      precio_unitario: number;
      descuento?: number;
      subtotal: number;
    }
  ): Promise<PedidoConProductos> {
    const response = await fetch(`${BASE_URL}/${pedidoId}/detalles/${productoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle),
      credentials: 'include',
    });
    return handleResponse<PedidoConProductos>(response);
  },

  async eliminarProducto(pedidoId: number, productoId: number): Promise<PedidoConProductos> {
    const response = await fetch(`${BASE_URL}/${pedidoId}/detalles/${productoId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse<PedidoConProductos>(response);
  },
};