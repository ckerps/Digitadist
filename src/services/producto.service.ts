import { ProductoRepository } from "@/repositories/producto.repository";
import { FiltrosProductoSchema, NuevoProductoSchema, PaginacionSchema, UpdateProductoSchema } from "@/repositories/zodSchemas";
import { FiltrosProducto, NuevoProducto, Producto, ProductosPaginado, UpdateProducto } from "@/types/producto";
import { prisma } from "@/lib/prisma";
import { EnumAtributosLog } from "@prisma/client";

export class ProductoService {
    static async obtenerTodos(itemsPerPage: number, currentPage: number, filters?: FiltrosProducto) : Promise<ProductosPaginado> {
        if (itemsPerPage > 100) itemsPerPage = 100; // Límite de seguridad

        const filtros = await FiltrosProductoSchema.parse(filters);
        const paginacion = await PaginacionSchema.parse({ itemsPerPage, currentPage });
        
        return await ProductoRepository.obtenerTodos(paginacion.itemsPerPage, paginacion.currentPage, filtros);
    }

    static async obtenerPorId(id: number) : Promise<Producto> {
        const producto = await ProductoRepository.obtenerPorId(id);

        if (!producto) {
            throw new Error("El producto no existe");
        }

        return producto;
    }

    static async crear(data: NuevoProducto) : Promise<Producto> {
        const validatedData = NuevoProductoSchema.parse(data);

        return await ProductoRepository.crear(validatedData);
    }

    static async actualizar(id: number, data: UpdateProducto, usuarioId?: number) : Promise<Producto> {
        if (id <= 0) throw new Error("ID inválido");

        const validatedData = UpdateProductoSchema.parse(data);

        const productoActual = await ProductoRepository.obtenerPorId(id);
        if (!productoActual) throw new Error("El producto a modificar no existe");

        // Registrar cambios de precio en el log
        if (usuarioId) {
            // Registrar cambio en costo si aplica
            if (validatedData.costo !== undefined && validatedData.costo !== productoActual.costo) {
                await prisma.productoLog.create({
                    data: {
                        usuario_id: usuarioId,
                        producto_id: id,
                        atributo: EnumAtributosLog.costo,
                        valor_anterior: productoActual.costo.toString(),
                        valor_nuevo: validatedData.costo.toString(),
                    }
                });
            }

            // Registrar cambio en porcentaje_recargo si aplica
            if (validatedData.porcentaje_recargo !== undefined && validatedData.porcentaje_recargo !== productoActual.porcentaje_recargo) {
                await prisma.productoLog.create({
                    data: {
                        usuario_id: usuarioId,
                        producto_id: id,
                        atributo: EnumAtributosLog.regargo,
                        valor_anterior: productoActual.porcentaje_recargo.toString(),
                        valor_nuevo: validatedData.porcentaje_recargo.toString(),
                    }
                });
            }
        }

        return ProductoRepository.actualizar(id, validatedData);
    }

    static async eliminar(id: number) : Promise<Producto>{
        if (id <= 0) throw new Error("ID inválido");
        return ProductoRepository.eliminar(id);
    }
}
