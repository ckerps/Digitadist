import { ClientePaginado, NuevoCliente, UpdateCliente } from "@/types/cliente";
import { prisma } from "@/lib/prisma";
import { Cliente } from "@prisma/client";
import { NuevoClienteSchema, PaginacionSchema, UpdateClienteSchema } from "./zodSchemas";

export class ClienteRepository {
  static async obtenerTodos(take: number, page: number): Promise<ClientePaginado> {
    const skip = (page - 1) * take;

    const [clientes, totalClientes] = await Promise.all([
      prisma.cliente.findMany({
        skip,
        take,
        orderBy: { id: 'desc' },
      }),
      prisma.cliente.count(),
    ]);

    return {
      clientes,
      totalItems: totalClientes,
      totalPages: Math.ceil(totalClientes / take),
      currentPage: page
    };
  }

  static async obtenerPorId(id: number): Promise<Cliente | null> {
    const cliente = await prisma.cliente.findUnique({ where: { id } })
    return cliente;
  }

  static async obtenerPorCuit(cuit: string): Promise<Cliente | null> {
    const cliente = await prisma.cliente.findUnique({ where: { cuit } })
    return cliente;
  }

  static async crear(data: NuevoCliente) {
    const result = await prisma.cliente.create({ data: data })
    return result;
  }

  static async actualizar(id: number, data: UpdateCliente) {
    const result = await prisma.cliente.update({ where: { id }, data: data })
    return result;
  }

  static async eliminar(id: number) {
    const result = await prisma.cliente.update({
      where: { id }, data: {
        activo: false
      }
    })
    return result;
  }
}
