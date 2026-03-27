import { PedidoRepository } from "@/repositories/pedido.repository";
import { FiltrosPedidoSchema, NuevoDetallePedidoSchema, NuevoPedidoSchema, PaginacionSchema, UpdateDetallePedidoSchema, UpdatePedidoSchema } from "@/repositories/zodSchemas";
import { FiltrosPedido, NuevoDetallePedido, NuevoPedido, PedidoConProductos, UpdatePedido } from "@/types/pedido";
import * as z from 'zod';

export class PedidoService {
    static async obtenerTodos(itemsPerPage: number, currentPage: number, filters?: FiltrosPedido) {
        if (itemsPerPage > 100) itemsPerPage = 100; // Límite de seguridad
        const paginacion = await PaginacionSchema.parse({ itemsPerPage, currentPage });
        return await PedidoRepository.obtenerTodos(paginacion.itemsPerPage, paginacion.currentPage, filters);
    }

    static async obtenerPorId(id: number): Promise<PedidoConProductos> {
        const pedido = await PedidoRepository.obtenerPorId(id);

        if (!pedido) {
            throw new Error("El pedido no existe");
        }

        return pedido as PedidoConProductos;
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

    static async agregarProducto(pedidoId: number, detalle: NuevoDetallePedido) {
        if (pedidoId <= 0) throw new Error("ID de pedido inválido");

        const pedido = await PedidoRepository.obtenerPorId(pedidoId);
        if (!pedido) throw new Error("El pedido no existe");

        const validatedDetalle = NuevoDetallePedidoSchema.parse(detalle);

        // Crear el detalle del producto con pedido_id incluido
        await PedidoRepository.crearDetallePedido({
            ...validatedDetalle,
            pedido_id: pedidoId
        });

        // Actualizar el total del pedido - convertir Decimal a number correctamente
        const totalActual = parseFloat(pedido.total as any);
        const costoActual = parseFloat(pedido.costo as any);
        const nuevoTotal = totalActual + validatedDetalle.subtotal;
        const nuevoCosto = costoActual + (validatedDetalle.precio_unitario * validatedDetalle.cantidad);

        await PedidoRepository.actualizar(pedidoId, {
            total: nuevoTotal,
            costo: nuevoCosto,
        });

        // Retornar el pedido actualizado
        return await PedidoRepository.obtenerPorId(pedidoId);
    }

    static async actualizarDetaleProducto(pedidoId: number, detalle: any) {
        if (pedidoId <= 0) throw new Error("ID de pedido inválido");

        const pedido = await PedidoRepository.obtenerPorId(pedidoId);
        if (!pedido) throw new Error("El pedido no existe");

        const detalleAnterior = pedido.detallePedidos.find(d => d.producto_id === detalle.producto_id);
        if (!detalleAnterior) throw new Error("El producto no está en este pedido");

        // Usar valores anteriores si no se proporcionan nuevos valores
        const cantidadActualizada = detalle.cantidad ?? detalleAnterior.cantidad;
        const precioActualizado = detalle.precio_unitario ?? parseFloat(detalleAnterior.precio_unitario as any);
        const descuentoActualizado = detalle.descuento ?? parseFloat(detalleAnterior.descuento as any);
        const subtotalActualizado = detalle.subtotal ?? parseFloat(detalleAnterior.subtotal as any);

        // Validar datos
        UpdateDetallePedidoSchema.parse({
            cantidad: cantidadActualizada,
            precio_unitario: precioActualizado,
            descuento: descuentoActualizado,
            subtotal: subtotalActualizado,
        });

        // Calcular la diferencia en totales usando valores correctos
        const costoAnterior = parseFloat(detalleAnterior.precio_unitario as any) * detalleAnterior.cantidad;
        const costoNuevo = precioActualizado * cantidadActualizada;
        const diferenciaCosto = costoNuevo - costoAnterior;

        const subtotalAnterior = parseFloat(detalleAnterior.subtotal as any);
        const diferenciaSubtotal = subtotalActualizado - subtotalAnterior;

        // Actualizar el detalle
        await PedidoRepository.actualizarDetallePedido({
            producto_id: detalle.producto_id,
            pedido_id: pedidoId,
            cantidad: cantidadActualizada,
            precio_unitario: precioActualizado,
            descuento: descuentoActualizado,
            subtotal: subtotalActualizado,
        } as any);

        // Actualizar totales del pedido
        const nuevoCosto = parseFloat(pedido.costo as any) + diferenciaCosto;
        const nuevoTotal = parseFloat(pedido.total as any) + diferenciaSubtotal;

        await PedidoRepository.actualizar(pedidoId, {
            total: nuevoTotal,
            costo: nuevoCosto,
        });

        // Retornar el pedido actualizado
        return await PedidoRepository.obtenerPorId(pedidoId);
    }

    static async eliminarProducto(pedidoId: number, productoId: number) {
        if (pedidoId <= 0) throw new Error("ID de pedido inválido");
        if (productoId <= 0) throw new Error("ID de producto inválido");

        const pedido = await PedidoRepository.obtenerPorId(pedidoId);
        if (!pedido) throw new Error("El pedido no existe");

        const detalleAEliminar = pedido.detallePedidos.find(d => d.producto_id === productoId);
        if (!detalleAEliminar) throw new Error("El producto no está en este pedido");

        // Calcular totales a restar
        const costoARestar = parseFloat(detalleAEliminar.precio_unitario as any) * detalleAEliminar.cantidad;
        const subtotalARestar = parseFloat(detalleAEliminar.subtotal as any);

        // Eliminar el detalle
        await PedidoRepository.eliminarDetallePedido(productoId, pedidoId);

        // Actualizar totales del pedido - convertir Decimal a number correctamente
        const totalActual = parseFloat(pedido.total as any);
        const costoActual = parseFloat(pedido.costo as any);

        await PedidoRepository.actualizar(pedidoId, {
            total: Math.max(0, totalActual - subtotalARestar),
            costo: Math.max(0, costoActual - costoARestar),
        });

        // Retornar el pedido actualizado
        return await PedidoRepository.obtenerPorId(pedidoId);
    }
}
