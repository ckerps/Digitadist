'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pedido } from "@/types/pedido";
import { getEstadoBadge, getPagoBadge,  } from "./utils";



interface PedidosTableProps {
    pedidos: Pedido[];
    onRowClick?: (id: number) => void;
}

export function MobilePedidosTable({ pedidos, onRowClick }: PedidosTableProps) {
    return (
        <div className="flex flex-col gap-3">
            {(pedidos || []).map((pedido) => {
                const estadoBadge = getEstadoBadge(pedido?.estado);
                const pagoBadge = getPagoBadge(pedido?.estado_pago);
                return (
                    <Card
                        key={pedido.id}
                        className="hover:bg-accent cursor-pointer transition-colors duration-200 border-border/60 shadow-xs"
                        onClick={onRowClick ? () => onRowClick(pedido.id) : undefined}
                    >
                        <CardHeader className="gap-2 flex-row flex-wrap items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-semibold">Pedido #{pedido.id}</CardTitle>
                            <div className="flex gap-2">
                                <Badge className={estadoBadge.className}>
                                    {estadoBadge.label}
                                </Badge>
                                <Badge className={pagoBadge.className}>
                                    {pagoBadge.label}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 text-sm flex flex-col gap-1 text-muted-foreground">
                            <div><strong className="font-medium text-foreground">Dirección:</strong> {pedido.direccion_entrega}</div>
                            <div><strong className="font-medium text-foreground">Fecha est.:</strong> {pedido.fecha_entrega_estimada.toLocaleString()}</div>
                            <div><strong className="font-medium text-foreground">Total:</strong> ${pedido.total}</div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
}

