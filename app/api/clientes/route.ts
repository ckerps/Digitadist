import { ClienteService } from '@/services/cliente.service'
import { NuevoCliente } from '@/types/cliente'
import { NextRequest, NextResponse } from 'next/server'


/**
 * GET /api/clientes
 * Obtiene todos los clientes
 */
export async function GET() {
  try {
    const clientes = await ClienteService.obtenerTodos()
    return NextResponse.json(clientes, { status: 200 })
  } catch (error) {
    console.error('Error al obtener clientes:', error)

    return NextResponse.json(
      { error: 'Error al obtener clientes' },
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
