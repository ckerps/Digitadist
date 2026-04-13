import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EnumTipoValor } from "@prisma/client";

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
    const { configs } = await request.json(); 

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

    return NextResponse.json({ message: "Configuración guardada" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al guardar la configuración" }, { status: 500 });
  }
}
