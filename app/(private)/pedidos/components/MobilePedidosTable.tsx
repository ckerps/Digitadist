'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Pedido } from "@/types/pedido";
import { getEstadoBadge, getPagoBadge,  } from "./utils";



interface PedidosTableProps {
    pedidos: Pedido[];
    onRowClick?: (id: number) => void;
}

export function MobilePedidosTable({ pedidos, onRowClick }: PedidosTableProps) {
    return (
        <div className="overflow-x-auto flex flex-col gap-2">
            {pedidos.map((pedido) => {
                const estadoBadge = getEstadoBadge(pedido?.estado);
                const pagoBadge = getPagoBadge(pedido?.estado_pago);
                return (
                    <Card
                        key={pedido.id}
                        className="hover:bg-red-50 cursor-pointer transition-colors duration-150"
                        onClick={onRowClick ? () => onRowClick(pedido.id) : undefined}
                    >
                        <CardHeader className="gap-2 flex-row items-center space-y-0">
                            <CardTitle>Pedido #{pedido.id}</CardTitle>
                            <Badge className={estadoBadge.className}>
                                {estadoBadge.label}
                            </Badge>
                            <Badge className={pagoBadge.className}>
                                {pagoBadge.label}
                            </Badge>
                        </CardHeader>

                        <CardContent className="space-y-1">
                            <div className="text-neutral-600"><b>Dirección de entrega:</b> {pedido.direccion_entrega}</div>
                            <div className=" text-neutral-600"><b>Fecha estimada:</b> {pedido.fecha_entrega_estimada.toLocaleString()}</div>
                            <div className=" text-neutral-600"><b>TOTAL:</b> ${pedido.total}</div>
                        </CardContent>
                    </Card>
                )

            })}
        </div>
    );
}

