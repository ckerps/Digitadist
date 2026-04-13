import { Pedido, FiltrosPedido, NuevoDetallePedido, NuevoPedido, PedidoConProductos, PedidosPaginado, UpdateDetallePedido, UpdatePedido } from "@/types/pedido";
import { prisma } from "@/lib/prisma";
import { EnumEstadoPedido } from "@prisma/client";


export const PedidoRepository = {
  async obtenerTodos(itemsPerPage: number, currentPage: number, filtros?: FiltrosPedido): Promise<PedidosPaginado> {
    const skip = (currentPage - 1) * itemsPerPage;

    // Construir condiciones WHERE dinámicamente basadas en los filtros
    const where: any = {};

    if (filtros) {
      if (filtros.searchTerm) {
        where.OR = [
          { cliente: { nombre: { contains: filtros.searchTerm, mode: 'insensitive' } } },
          { id: isNaN(Number(filtros.searchTerm)) ? undefined : Number(filtros.searchTerm) },
          { cliente: { email: { contains: filtros.searchTerm, mode: 'insensitive' } } },
          { direccion_entrega: { contains: filtros.searchTerm, mode: 'insensitive' } },
        ].filter(condition => Object.values(condition)[0] !== undefined);
      }
      // Filtros específicos
      if (filtros.cliente_id !== undefined) where.cliente_id = filtros.cliente_id;
      if (filtros.vendedor_id !== undefined) where.vendedor_id = filtros.vendedor_id;
      if (filtros.estado !== undefined) where.estado = filtros.estado;
      if (filtros.estado_pago !== undefined) where.estado_pago = filtros.estado_pago;
      if (filtros.direccion_entrega) where.direccion_entrega = { contains: filtros.direccion_entrega, mode: 'insensitive' };
      if (filtros.fecha_entrega_estimada) where.fecha_entrega_estimada = filtros.fecha_entrega_estimada;
      if (filtros.condicion_venta) where.condicion_venta = filtros.condicion_venta;
    }

    const pedidos = await prisma.pedido.findMany({
      where,
      skip,
      take: itemsPerPage,
      orderBy: { id: 'desc' }
    }) as any;

    const totalCount = await prisma.pedido.count({ where });

    return {
      pedidos: pedidos,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / itemsPerPage),
      currentPage: currentPage
    }
  },

  async obtenerPorId(id: number): Promise<PedidoConProductos | null> {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        detallePedidos: { include: { producto: true } },
        cliente: true,
        vendedor: true
      }
    }) as any;
    return pedido;
  },

  // async crear(data: NuevoPedido) {
  //   const pedido = await NuevoPedidoSchema.parse(data);
  //   const result = await prisma.pedido.create({ data: pedido })
  //   return result;
  // },

  async crearDetallePedido(data: any) {
    return await prisma.$transaction(async (tx) => {
      const detalle = await tx.detallePedido.create({
        data: {
          producto_id: data.producto_id,
          pedido_id: data.pedido_id,
          cantidad: data.cantidad,
          precio_unitario: data.precio_unitario,
          descuento: data.descuento,
          subtotal: data.subtotal,
        }
      });

      await tx.producto.update({
        where: { id: data.producto_id },
        data: { stock_actual: { decrement: data.cantidad } }
      });

      return detalle;
    });
  },

  async crearConDetalle(pedido: NuevoPedido, detalle: NuevoDetallePedido[]) {
    return await prisma.$transaction(async (tx) => {
      const nuevoPedido = await tx.pedido.create({
        data: {
          cliente_id: pedido.cliente_id!,
          vendedor_id: pedido.vendedor_id!,
          ...pedido,
          detallePedidos: {
            create: detalle.map(d => ({
              producto_id: d.producto_id,
              cantidad: d.cantidad,
              precio_unitario: d.precio_unitario,
              descuento: d.descuento,
              subtotal: d.subtotal
            }))
          }
        },
        include: { detallePedidos: true }
      });

      for (const item of detalle) {
        await tx.producto.update({
          where: { id: item.producto_id },
          data: { stock_actual: { decrement: item.cantidad } }
        });
      }

      return nuevoPedido;
    });
  },

  async actualizar(id: number, data: UpdatePedido) {
    return await prisma.$transaction(async (tx) => {
      const pedidoAnterior = await tx.pedido.findUnique({
        where: { id },
        include: { detallePedidos: true }
      });

      if (!pedidoAnterior) throw new Error("Pedido no encontrado");

      const result = await tx.pedido.update({ where: { id }, data: data });

      // Check if it's being cancelled and wasn't before
      if (data.estado === EnumEstadoPedido.cancelado && pedidoAnterior.estado !== EnumEstadoPedido.cancelado) {
        for (const item of pedidoAnterior.detallePedidos) {
          await tx.producto.update({
            where: { id: item.producto_id },
            data: { stock_actual: { increment: item.cantidad } }
          });
        }
      }
      
      // Check if it was cancelled and is now being reactivated
      if (pedidoAnterior.estado === EnumEstadoPedido.cancelado && data.estado && data.estado !== EnumEstadoPedido.cancelado) {
        for (const item of pedidoAnterior.detallePedidos) {
          await tx.producto.update({
            where: { id: item.producto_id },
            data: { stock_actual: { decrement: item.cantidad } }
          });
        }
      }

      return result;
    });
  },

  async actualizarDetallePedido(data: UpdateDetallePedido, diferenciaCantidad: number = 0) {
    return await prisma.$transaction(async (tx) => {
      const result = await tx.detallePedido.update({
        where: {
          pedido_id_producto_id: {
            pedido_id: data.pedido_id!,
            producto_id: data.producto_id!
          }
        }, data
      });

      if (diferenciaCantidad !== 0) {
        await tx.producto.update({
          where: { id: data.producto_id! },
          data: { stock_actual: { decrement: diferenciaCantidad } }
        });
      }

      return result;
    });
  },

  async eliminar(id: number) {
    return await prisma.$transaction(async (tx) => {
      const pedidoAActualizar = await tx.pedido.findUnique({
        where: { id },
        include: { detallePedidos: true }
      });
      
      if (!pedidoAActualizar) throw new Error("Pedido no encontrado");

      if (pedidoAActualizar.estado === EnumEstadoPedido.cancelado) {
        return pedidoAActualizar; // ya está cancelado
      }

      const result = await tx.pedido.update({
        where: { id }, data: {
          estado: EnumEstadoPedido.cancelado
        }
      });

      for (const item of pedidoAActualizar.detallePedidos) {
        await tx.producto.update({
          where: { id: item.producto_id },
          data: { stock_actual: { increment: item.cantidad } }
        });
      }

      return result;
    });
  },

  async eliminarDetallePedido(producto_id: number, pedido_id: number) {
    return await prisma.$transaction(async (tx) => {
      const result = await tx.detallePedido.delete({
        where: {
          pedido_id_producto_id: {
            pedido_id,
            producto_id
          }
        }
      });

      await tx.producto.update({
        where: { id: producto_id },
        data: { stock_actual: { increment: result.cantidad } }
      });

      return result;
    });
  }
};
