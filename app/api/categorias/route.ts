import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtiene todas las categorías de productos ordenadas alfabéticamente
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *       500:
 *         description: Error al obtener las categorías
 */
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' }
    });
    return NextResponse.json(categorias, { status: 200 });
  } catch (error) {
    console.log("Error al obtener las categorías:", error);
    return NextResponse.json({ error: "Error al obtener las categorías" }, { status: 500 });
  }
}
