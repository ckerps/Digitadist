import { FiltrosProducto, NuevoProducto, ProductosPaginado, UpdateProducto } from "@/types/producto";
import { FiltrosProductoSchema, NuevoProductoSchema, PaginacionSchema, UpdateProductoSchema } from "./zodSchemas";
import { prisma } from "@/lib/prisma";
import { Producto } from "@prisma/client";

export const ProductoRepository = {
  async obtenerTodos(itemsPerPage: number, currentPage: number, filtros?: FiltrosProducto): Promise<ProductosPaginado> {
    const skip = (currentPage - 1) * itemsPerPage;

    const productos = await prisma.producto.findMany({
      where: {
        codigo: filtros?.codigo ?? undefined,
        nombre: filtros?.nombre ?? undefined,
        presentacion: filtros?.presentacion ?? undefined,
        tam_pack: filtros?.tam_pack ?? undefined,
        stock_actual: filtros?.stock_actual ?? undefined,
        stock_minimo: filtros?.stock_minimo ?? undefined,
        activo: filtros?.activo ?? undefined,
        categoria_id: filtros?.categoria_id ?? undefined,
        fecha_vencimiento: filtros?.fecha_vencimiento ?? undefined
      },
      skip,
      take: itemsPerPage,
      orderBy: { id: 'desc' }
    });

    const totalCount = await prisma.pedido.count();

    return {
      productos,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / itemsPerPage),
      currentPage: currentPage
    }
  },

  async obtenerPorId(id: number): Promise<Producto | null> {
    const producto = await prisma.producto.findUnique({ where: { id } });
    return producto;
  },

  async crear(data: NuevoProducto) {
    const result = await prisma.producto.create({ data })
    return result;
  },

  async actualizar(id: number, data: UpdateProducto) {
    const result = await prisma.producto.update({ where: { id }, data })
    return result;
  },

  async eliminar(id: number): Promise<Producto> {
    const result = await prisma.producto.update({
      where: { id }, data: {
        activo: false
      }
    })
    return result;
  }
};
