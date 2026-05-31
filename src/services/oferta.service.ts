import { OfertaConProducto, OfertaPaginada, NuevaOferta, ActualizarOferta, RenovarOferta } from "@/types/oferta";
import { OfertaRepository } from "@/repositories/oferta.repository";
import { NuevaOfertaSchema } from "@/repositories/zodSchemas";

export class OfertaService {
  static async obtenerTodos(
    itemsPerPage: number,
    currentPage: number,
    filtros?: any
  ): Promise<OfertaPaginada> {
    const ofertas = await OfertaRepository.obtenerTodos(
      itemsPerPage,
      currentPage,
      filtros
    );
    const totalItems = await OfertaRepository.contar(filtros);

    return {
      ofertas,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      currentPage,
      totalItems,
      itemsPerPage,
    };
  }

  static async obtenerPorId(id: number): Promise<OfertaConProducto> {
    const oferta = await OfertaRepository.obtenerPorId(id);
    if (!oferta) {
      throw new Error("La oferta no existe");
    }
    return oferta as OfertaConProducto;
  }

  static async crear(data: NuevaOferta): Promise<OfertaConProducto> {
    const validatedData = NuevaOfertaSchema.parse(data);
    const oferta = await OfertaRepository.crear({
      producto_id: validatedData.producto_id,
      tipo: validatedData.tipo,
      valor: validatedData.valor,
      fecha_inicio: validatedData.fecha_inicio,
      fecha_fin: validatedData.fecha_fin,
      activa: validatedData.activa ?? true,
    });
    return oferta as OfertaConProducto;
  }

  static async actualizar(
    id: number,
    data: ActualizarOferta
  ): Promise<OfertaConProducto> {
    const oferta = await OfertaRepository.actualizar(id, {
      ...(data.tipo && { tipo: data.tipo }),
      ...(data.valor && { valor: data.valor }),
      ...(data.fecha_inicio && {
        fecha_inicio: new Date(data.fecha_inicio),
      }),
      ...(data.fecha_fin && {
        fecha_fin: new Date(data.fecha_fin),
      }),
      ...(data.activa !== undefined && { activa: data.activa }),
    });
    return oferta as OfertaConProducto;
  }

  static async renovar(
    id: number,
    data: RenovarOferta
  ): Promise<OfertaConProducto> {
    const oferta = await OfertaRepository.obtenerPorId(id);
    if (!oferta) {
      throw new Error("La oferta no existe");
    }

    const ofertaRenovada = await OfertaRepository.actualizar(id, {
      fecha_fin: new Date(data.nueva_fecha_fin),
      activa: true,
    });
    return ofertaRenovada as OfertaConProducto;
  }

  static async eliminar(id: number): Promise<void> {
    await OfertaRepository.eliminar(id);
  }
}
