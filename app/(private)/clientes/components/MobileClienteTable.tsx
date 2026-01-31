'use client';

import { Cliente } from "@/types/cliente";
import { Building2, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";



interface ClienteTableProps {
    clientes: Cliente[];
    onRowClick: (id: number) => void;
}

export function MobileClienteTable({ clientes, onRowClick }: ClienteTableProps) {
    return (
        <div className="overflow-x-auto grid gap-2">
            {clientes.map((cliente) => (
                <Card
                    key={cliente.id}
                    onClick={() => onRowClick(cliente.id)}
                    className="hover:bg-red-50 cursor-pointer transition-colors duration-150"
                >
                    <CardHeader>
                        <CardTitle>{cliente.id} - {cliente.nombre}</CardTitle>
                        <CardDescription>
                            <Badge
                                variant={cliente.tipo === 'razon_social' ? 'default' : 'secondary'}
                                className={cliente.tipo === 'razon_social' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                                {cliente.tipo === 'razon_social' ? (
                                    <><Building2 className="h-3 w-3 mr-1" /> Razón Social</>
                                ) : (
                                    <><User className="h-3 w-3 mr-1" /> Persona</>
                                )}
                            </Badge>
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="text-neutral-600"><b>Domicilio:</b> {cliente.direccion}</div>
                        <div className=" text-neutral-600"><b>CUIT:</b> {cliente.cuit}</div>
                        <div className=" text-neutral-600"><b>Teléfono:</b> {cliente.telefono}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

