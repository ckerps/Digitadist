import { ClienteService } from '@/services/cliente.service'
import { PedidoService } from '@/services/pedido.service';
import { NuevoCliente } from '@/types/cliente'
import { NextRequest, NextResponse } from 'next/server'

const defaultItemsPerPage = process.env.DEFAULT_ITEMS_PER_PAGE || 10;

/**
 * GET /api/pedidos
 * Obtiene todos los pedidos, paginados y opionalmente filtrados
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const itemsPerPage = url.searchParams.get('itemsPerPage') ?? defaultItemsPerPage;
    const currentPage = url.searchParams.get('currentPage') ?? 1;
    const filters : Partial<{ [key: string]: string }> = {};
    url.searchParams.forEach((value, key) => {
      if (key !== 'itemsPerPage' && key !== 'currentPage') {
        filters[key] = value;
      }
    });

    console.log('Filters:', filters, 'ItemsPerPage:', itemsPerPage, 'CurrentPage:', currentPage);

    const pedidos = await PedidoService.obtenerTodos(filters, +itemsPerPage, +currentPage)
    return NextResponse.json(pedidos, { status: 200 })
  } catch (error) {
    console.error('Error al obtener pedidos:', error)

    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/clientes
 * Crea un nuevo cliente
 */
export async function POST(request: NextRequest) {
  try {
    const body: NuevoCliente = await request.json()

    const cliente = await ClienteService.crear(body)

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    console.error('Error al crear cliente:', error)

    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}
