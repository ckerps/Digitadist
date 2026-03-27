import { OfertaConProducto, OfertaPaginada, NuevaOferta, ActualizarOferta, RenovarOferta, FiltrosOferta } from "@/types/oferta";

const API_BASE = "/api/ofertas";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error en la solicitud");
  }
  return response.json();
}

export const ofertasApi = {
  getAll: async (
    itemsPerPage: number = 10,
    currentPage: number = 1,
    filtros?: FiltrosOferta
  ): Promise<OfertaPaginada> => {
    const params = new URLSearchParams({
      itemsPerPage: itemsPerPage.toString(),
      currentPage: currentPage.toString(),
    });

    if (filtros) {
      if (filtros.id) params.append("id", filtros.id.toString());
      if (filtros.producto_id) params.append("producto_id", filtros.producto_id.toString());
      if (filtros.tipo) params.append("tipo", filtros.tipo);
      if (filtros.estado) params.append("estado", filtros.estado);
      if (filtros.fecha_inicio_desde) params.append("fecha_inicio_desde", filtros.fecha_inicio_desde);
      if (filtros.fecha_inicio_hasta) params.append("fecha_inicio_hasta", filtros.fecha_inicio_hasta);
      if (filtros.fecha_fin_desde) params.append("fecha_fin_desde", filtros.fecha_fin_desde);
      if (filtros.fecha_fin_hasta) params.append("fecha_fin_hasta", filtros.fecha_fin_hasta);
      if (filtros.fecha_creacion_desde) params.append("fecha_creacion_desde", filtros.fecha_creacion_desde);
      if (filtros.fecha_creacion_hasta) params.append("fecha_creacion_hasta", filtros.fecha_creacion_hasta);
    }

    const response = await fetch(`${API_BASE}?${params}`);
    return handleResponse<OfertaPaginada>(response);
  },

  getById: async (id: number): Promise<OfertaConProducto> => {
    console.log(id);
    const response = await fetch(`${API_BASE}/${id}`);
    return handleResponse<OfertaConProducto>(response);
  },

  create: async (oferta: NuevaOferta): Promise<OfertaConProducto> => {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(oferta),
    });
    return handleResponse<OfertaConProducto>(response);
  },

  update: async (
    id: number,
    oferta: ActualizarOferta
  ): Promise<OfertaConProducto> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(oferta),
    });
    return handleResponse<OfertaConProducto>(response);
  },

  renovar: async (
    id: number,
    datos: RenovarOferta
  ): Promise<OfertaConProducto> => {
    const response = await fetch(`${API_BASE}/${id}/renovar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return handleResponse<OfertaConProducto>(response);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al eliminar");
    }
  },
};
