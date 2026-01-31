import { Producto } from "@/generated/prisma/client";
import { ProductoRepository } from "@/repositories/producto.repository";
import { FiltrosProductoSchema, NuevoProductoSchema, PaginacionSchema, UpdateProductoSchema } from "@/repositories/zodSchemas";
import { FiltrosProducto, NuevoProducto, ProductosPaginado, UpdateProducto } from "@/types/producto";

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

    static async actualizar(id: number, data: UpdateProducto) : Promise<Producto> {
        if (id <= 0) throw new Error("ID inválido");

        const validatedData = UpdateProductoSchema.parse(data);

        const productoActual = await ProductoRepository.obtenerPorId(id);
        if (!productoActual) throw new Error("El producto a modificar no existe");

        return ProductoRepository.actualizar(id, validatedData);
    }

    static async eliminar(id: number) : Promise<void>{
        if (id <= 0) throw new Error("ID inválido");
        return ProductoRepository.eliminar(id);
    }
}
