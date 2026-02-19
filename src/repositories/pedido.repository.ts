import { FiltrosPedido, NuevoDetallePedido, NuevoPedido, PedidoConProductos, PedidosPaginado, UpdateDetallePedido, UpdatePedido } from "@/types/pedido";
import { FiltrosPedidoSchema, NuevoDetallePedidoSchema, NuevoPedidoSchema, PaginacionSchema, UpdateDetallePedidoSchema, UpdatePedidoSchema } from "./zodSchemas";
import { prisma } from "@/lib/prisma";
import { EnumEstadoPedido, Pedido } from "@prisma/client";


export const PedidoRepository = {
  async obtenerTodos(itemsPerPage: number, currentPage: number, filtros?: FiltrosPedido): Promise<PedidosPaginado> {
    const skip = (currentPage - 1) * itemsPerPage;

    const pedidos = await prisma.pedido.findMany({
      where: {
        cliente_id: filtros?.cliente_id ? +filtros?.cliente_id : undefined,
        vendedor_id: filtros?.vendedor_id ? +filtros?.vendedor_id : undefined,
        estado: filtros?.estado ?? undefined,
        estado_pago: filtros?.estado_pago ?? undefined,
        direccion_entrega: filtros?.direccion_entrega ?? undefined,
        fecha_entrega_estimada: filtros?.fecha_entrega_estimada ?? undefined,
        condicion_venta: filtros?.condicion_venta ?? undefined
      },
      skip,
      take: itemsPerPage,
      orderBy: { id: 'desc' }
    });

    const totalCount = await prisma.pedido.count();

    return {
      pedidos,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / itemsPerPage),
      currentPage: currentPage
    }
  },

  async obtenerPorId(id: number): Promise<PedidoConProductos | null> {
    const pedido = await prisma.pedido.findUnique({ where: { id }, include: { detallePedidos: {include: { producto: true }} } });
    return pedido;
  },

  // async crear(data: NuevoPedido) {
  //   const pedido = await NuevoPedidoSchema.parse(data);
  //   const result = await prisma.pedido.create({ data: pedido })
  //   return result;
  // },

  // async crearDetallePedido(data: NuevoDetallePedido[]) {
  //   const result = await Promise.all([
  //     data?.forEach(async (dat) => {
  //       const detalle = await NuevoDetallePedidoSchema.parse(dat);
  //       return await prisma.detallePedido.create({ data: detalle });
  //     })
  //   ])
  //   return result;
  // },

  async crearConDetalle(pedido: NuevoPedido, detalle: NuevoDetallePedido[]) {
    return await prisma.pedido.create({
      data: {
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
    const result = await prisma.pedido.update({ where: { id }, data: {
      estado: EnumEstadoPedido.cancelado
    } })
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
