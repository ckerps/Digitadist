import { ClienteService } from '@/services/cliente.service'
import { Cliente } from '@/types/cliente';
import { NextRequest, NextResponse } from 'next/server';


/**
 * GET /api/clientes/[id]
 * Obtiene un cliente por ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cliente = await ClienteService.obtenerPorId(Number(params.id));

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente, { status: 200 });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    return NextResponse.json(
      { error: 'Error al obtener cliente' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/clientes/[id]
 * Actualiza un cliente existente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Partial<Cliente> = await request.json();

    const clienteActualizado = await ClienteService.actualizar(
      Number(params.id),
      body
    );

    if (!clienteActualizado) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(clienteActualizado, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return NextResponse.json(
      { error: 'Error al actualizar cliente' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clientes/[id]
 * Elimina (desactiva) un cliente
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eliminado = await ClienteService.eliminar(Number(params.id));

    if (!eliminado) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return NextResponse.json(
      { error: 'Error al eliminar cliente' },
      { status: 500 }
    );
  }
}
