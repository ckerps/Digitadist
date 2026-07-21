import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EnumTipoValor } from "@prisma/client";

/**
 * @swagger
 * /api/configuracion:
 *   get:
 *     summary: Obtiene todos los parámetros de configuración del sistema
 *     tags: [Configuración]
 *     responses:
 *       200:
 *         description: Configuración obtenida exitosamente
 *       500:
 *         description: Error al obtener la configuración
 *   post:
 *     summary: Guarda o actualiza múltiples parámetros de configuración en lote
 *     tags: [Configuración]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - configs
 *             properties:
 *               configs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - nombre
 *                     - valor
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       description: Identificador único de la configuración
 *                     valor:
 *                       type: string
 *                       description: Valor a asignar
 *                     tipo_valor:
 *                       type: string
 *                       enum: [int, string, float, boolean]
 *                       default: int
 *     responses:
 *       200:
 *         description: Configuración guardada exitosamente
 *       500:
 *         description: Error al guardar la configuración
 */
export async function GET() {
  try {
    const configs = await prisma.configuracion.findMany();
    return NextResponse.json(configs, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Error al obtener la configuración" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const configs = await request.json();

    await prisma.$transaction(
      configs.map((c: any) =>
        prisma.configuracion.upsert({
          where: { nombre: c.nombre },
          update: { valor: c.valor },
          create: {
            nombre: c.nombre,
            valor: String(c.valor),
            tipo_valor: c.tipo_valor || EnumTipoValor.int
          }
        })
      )
    );

    return NextResponse.json({ message: "Configuración guardada" }, { status: 201 });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: "Error al guardar la configuración" }, { status: 500 });
  }
}
