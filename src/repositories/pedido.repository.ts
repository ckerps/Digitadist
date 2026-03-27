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
    return await prisma.detallePedido.create({
      data: {
        producto_id: data.producto_id,
        pedido_id: data.pedido_id,
        cantidad: data.cantidad,
        precio_unitario: data.precio_unitario,
        descuento: data.descuento,
        subtotal: data.subtotal,
      }
    });
  },

  async crearConDetalle(pedido: NuevoPedido, detalle: NuevoDetallePedido[]) {
    return await prisma.pedido.create({
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
  },

  async actualizar(id: number, data: UpdatePedido) {
    const result = await prisma.pedido.update({ where: { id }, data: data })
    return result;
  },

  async actualizarDetallePedido(data: UpdateDetallePedido) {
    const result = await prisma.detallePedido.update({
      where: {
        pedido_id_producto_id: {
          pedido_id: data.pedido_id,
          producto_id: data.producto_id
        }
      }, data
    })
    return result;
  },

  async eliminar(id: number) {
    const result = await prisma.pedido.update({
      where: { id }, data: {
        estado: EnumEstadoPedido.cancelado
      }
    })
    return result;
  },

  async eliminarDetallePedido(producto_id: number, pedido_id: number) {
    const result = await prisma.detallePedido.delete({
      where: {
        pedido_id_producto_id: {
          pedido_id,
          producto_id
        }
      }
    })
    return result;
  }
};
