import { ClientePaginado, NuevoCliente, UpdateCliente, FiltrosCliente } from "@/types/cliente";
import { prisma } from "@/lib/prisma";
import { Cliente } from "@prisma/client";
import { NuevoClienteSchema, PaginacionSchema, UpdateClienteSchema } from "./zodSchemas";

export class ClienteRepository {
  static async obtenerTodos(take: number, page: number, filtros?: FiltrosCliente): Promise<ClientePaginado> {
    const skip = (page - 1) * take;

    // Construir condiciones WHERE dinámicamente basadas en los filtros
    const where: any = {};

    if (filtros) {
      // Si existe searchTerm, buscar en múltiples campos
      if (filtros.searchTerm) {
        where.OR = [
          { nombre: { contains: filtros.searchTerm, mode: 'insensitive' } },
          { telefono: { contains: filtros.searchTerm, mode: 'insensitive' } },
          { email: { contains: filtros.searchTerm, mode: 'insensitive' } },
          { cuit: { contains: filtros.searchTerm, mode: 'insensitive' } },
        ];
      }

      // Filtros específicos
      if (filtros.id !== undefined) where.id = filtros.id;
      if (filtros.nombre) where.nombre = { contains: filtros.nombre, mode: 'insensitive' };
      if (filtros.telefono) where.telefono = { contains: filtros.telefono, mode: 'insensitive' };
      if (filtros.cuit) where.cuit = { contains: filtros.cuit, mode: 'insensitive' };
      if (filtros.tipo) where.tipo = filtros.tipo;
      if (filtros.email) where.email = { contains: filtros.email, mode: 'insensitive' };
      if (filtros.activo !== undefined) where.activo = filtros.activo;
    }

    const [clientes, totalClientes] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'desc' },
      }),
      prisma.cliente.count({ where }),
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
