import { PedidoRepository } from "@/repositories/pedido.repository";
import { FiltrosPedidoSchema, NuevoDetallePedidoSchema, NuevoPedidoSchema, PaginacionSchema, UpdatePedidoSchema } from "@/repositories/zodSchemas";
import { FiltrosPedido, NuevoDetallePedido, NuevoPedido, UpdatePedido } from "@/types/pedido";
import * as z from 'zod';

export class PedidoService {
    static async obtenerTodos(itemsPerPage: number, currentPage: number, filters?: FiltrosPedido,) {
        if (itemsPerPage > 100) itemsPerPage = 100; // Límite de seguridad
        const filtros = await FiltrosPedidoSchema.parse(filters);
        const paginacion = await PaginacionSchema.parse({ itemsPerPage, currentPage });
        return await PedidoRepository.obtenerTodos(paginacion.itemsPerPage, paginacion.currentPage, filtros);
    }

    static async obtenerPorId(id: number) {
        const pedido = await PedidoRepository.obtenerPorId(id);

        if (!pedido) {
            throw new Error("El pedido no existe");
        }

        return pedido;
    }

    static async crear(data: NuevoPedido, detalle: NuevoDetallePedido[]) {
        const validatedData = NuevoPedidoSchema.parse(data);
        const validatedDetalle = z.array(NuevoDetallePedidoSchema).parse(detalle);

        if (validatedDetalle.length === 0) {
            throw new Error("El pedido debe tener al menos un producto");
        }

        return await PedidoRepository.crearConDetalle(validatedData, validatedDetalle);
    }

    static async actualizar(id: number, data: UpdatePedido) {
        if (id <= 0) throw new Error("ID inválido");

        const validatedData = UpdatePedidoSchema.parse(data);

        const pedidoActual = await PedidoRepository.obtenerPorId(id);
        if (!pedidoActual) throw new Error("El pedido a modificar no existe");

        return PedidoRepository.actualizar(id, validatedData);
    }

    static async eliminar(id: number) {
        if (id <= 0) throw new Error("ID inválido");
        return PedidoRepository.eliminar(id);
    }
}
