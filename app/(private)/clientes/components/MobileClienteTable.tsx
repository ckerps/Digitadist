'use client';

import { Cliente } from "@/types/cliente";
import { Building2, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClienteTableProps {
    clientes: Cliente[];
    onRowClick: (id: number) => void;
}

export function MobileClienteTable({ clientes, onRowClick }: ClienteTableProps) {
    return (
        <div className="flex flex-col gap-3">
            {clientes.map((cliente) => (
                <Card
                    key={cliente.id}
                    onClick={() => onRowClick(cliente.id)}
                    className="hover:bg-accent cursor-pointer transition-colors duration-200 border-border/60 shadow-xs"
                >
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-semibold">{cliente.id} - {cliente.nombre}</CardTitle>
                        </div>
                        <CardDescription className="pt-1">
                            <Badge
                                variant={cliente.tipo === 'razon_social' ? 'default' : 'secondary'}
                                className={cliente.tipo === 'razon_social' ? 'bg-primary hover:bg-primary/90' : 'bg-muted text-muted-foreground'}
                            >
                                {cliente.tipo === 'razon_social' ? (
                                    <span className="flex items-center"><Building2 className="h-3 w-3 mr-1" /> Razón Social</span>
                                ) : (
                                    <span className="flex items-center"><User className="h-3 w-3 mr-1" /> Persona</span>
                                )}
                            </Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 text-sm flex flex-col gap-1 text-muted-foreground">
                        <div><strong className="font-medium text-foreground">Domicilio:</strong> {cliente.direccion}</div>
                        <div><strong className="font-medium text-foreground">CUIT:</strong> <span className="font-mono">{cliente.cuit}</span></div>
                        <div><strong className="font-medium text-foreground">Teléfono:</strong> {cliente.telefono}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

