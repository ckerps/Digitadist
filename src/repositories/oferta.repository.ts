import { prisma } from "@/lib/prisma";
import { OfertaConProducto, FiltrosOferta } from "@/types/oferta";

export class OfertaRepository {
  static async obtenerTodos(
    itemsPerPage: number,
    currentPage: number,
    filtros?: FiltrosOferta
  ): Promise<OfertaConProducto[]> {
    const skip = (currentPage - 1) * itemsPerPage;

    const where: any = {};

    if (filtros?.id && !isNaN(Number(filtros.id))) where.id = Number(filtros.id);
    if (filtros?.producto_id && !isNaN(Number(filtros.producto_id))) {
      where.producto_id = Number(filtros.producto_id);
    }
    if (filtros?.tipo && filtros.tipo !== '') where.tipo = filtros.tipo;
    if (filtros?.estado === 'activa') where.activa = true;
    if (filtros?.estado === 'inactiva') where.activa = false;

    if (filtros?.fecha_inicio_desde && filtros.fecha_inicio_desde !== '') {
      where.fecha_inicio = {
        ...where.fecha_inicio,
        gte: new Date(filtros.fecha_inicio_desde),
      };
    }
    if (filtros?.fecha_inicio_hasta && filtros.fecha_inicio_hasta !== '') {
      where.fecha_inicio = {
        ...where.fecha_inicio,
        lte: new Date(filtros.fecha_inicio_hasta),
      };
    }

    if (filtros?.fecha_fin_desde && filtros.fecha_fin_desde !== '') {
      where.fecha_fin = {
        ...where.fecha_fin,
        gte: new Date(filtros.fecha_fin_desde),
      };
    }
    if (filtros?.fecha_fin_hasta && filtros.fecha_fin_hasta !== '') {
      where.fecha_fin = {
        ...where.fecha_fin,
        lte: new Date(filtros.fecha_fin_hasta),
      };
    }

    if (filtros?.fecha_creacion_desde && filtros.fecha_creacion_desde !== '') {
      where.fecha_creacion = {
        ...where.fecha_creacion,
        gte: new Date(filtros.fecha_creacion_desde),
      };
    }
    if (filtros?.fecha_creacion_hasta && filtros.fecha_creacion_hasta !== '') {
      where.fecha_creacion = {
        ...where.fecha_creacion,
        lte: new Date(filtros.fecha_creacion_hasta),
      };
    }

    const ofertas = await prisma.oferta.findMany({
      where,
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
          },
        },
      },
      skip,
      take: itemsPerPage,
      orderBy: {
        fecha_creacion: 'desc',
      },
    });

    return ofertas as OfertaConProducto[];
  }

  static async obtenerPorId(id: number): Promise<OfertaConProducto | null> {
    const oferta = await prisma.oferta.findUnique({
      where: { id },
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            imagen: true,
            costo: true,
            porcentaje_recargo: true,
          },
        },
      },
    });

    return oferta as OfertaConProducto | null;
  }

  static async contar(filtros?: FiltrosOferta): Promise<number> {
    const where: any = {};

    if (filtros?.id && !isNaN(Number(filtros.id))) where.id = Number(filtros.id);
    if (filtros?.producto_id && !isNaN(Number(filtros.producto_id))) {
      where.producto_id = Number(filtros.producto_id);
    }
    if (filtros?.tipo && filtros.tipo !== '') where.tipo = filtros.tipo;
    if (filtros?.estado === 'activa') where.activa = true;
    if (filtros?.estado === 'inactiva') where.activa = false;

    if (filtros?.fecha_inicio_desde && filtros.fecha_inicio_desde !== '') {
      where.fecha_inicio = {
        ...where.fecha_inicio,
        gte: new Date(filtros.fecha_inicio_desde),
      };
    }
    if (filtros?.fecha_inicio_hasta && filtros.fecha_inicio_hasta !== '') {
      where.fecha_inicio = {
        ...where.fecha_inicio,
        lte: new Date(filtros.fecha_inicio_hasta),
      };
    }

    if (filtros?.fecha_fin_desde && filtros.fecha_fin_desde !== '') {
      where.fecha_fin = {
        ...where.fecha_fin,
        gte: new Date(filtros.fecha_fin_desde),
      };
    }
    if (filtros?.fecha_fin_hasta && filtros.fecha_fin_hasta !== '') {
      where.fecha_fin = {
        ...where.fecha_fin,
        lte: new Date(filtros.fecha_fin_hasta),
      };
    }

    if (filtros?.fecha_creacion_desde && filtros.fecha_creacion_desde !== '') {
      where.fecha_creacion = {
        ...where.fecha_creacion,
        gte: new Date(filtros.fecha_creacion_desde),
      };
    }
    if (filtros?.fecha_creacion_hasta && filtros.fecha_creacion_hasta !== '') {
      where.fecha_creacion = {
        ...where.fecha_creacion,
        lte: new Date(filtros.fecha_creacion_hasta),
      };
    }

    return prisma.oferta.count({ where });
  }

  static async crear(data: {
    producto_id: number;
    tipo: 'monto' | 'porcentaje';
    valor: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    activa: boolean;
  }): Promise<OfertaConProducto> {
    const oferta = await prisma.oferta.create({
      data,
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            imagen: true,
            costo: true,
            porcentaje_recargo: true,
          },
        },
      },
    });

    return oferta as OfertaConProducto;
  }

  static async actualizar(
    id: number,
    data: Partial<{
      tipo: 'monto' | 'porcentaje';
      valor: number;
      fecha_inicio: Date;
      fecha_fin: Date;
      activa: boolean;
    }>
  ): Promise<OfertaConProducto> {
    const oferta = await prisma.oferta.update({
      where: { id },
      data,
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            imagen: true,
            costo: true,
            porcentaje_recargo: true,
          },
        },
      },
    });

    return oferta as OfertaConProducto;
  }

  static async eliminar(id: number): Promise<void> {
    await prisma.oferta.update({
      where: { id },
      data: { activa: false },
    });
  }
}
