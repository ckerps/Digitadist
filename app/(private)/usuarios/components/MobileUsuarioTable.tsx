'use client';

import { Usuario } from '@/types/usuario';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Edit2, Shield, Trash, User } from 'lucide-react';

interface UsuarioTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
  onActivate: (usuario: Usuario) => void;
}

export function MobileUsuarioTable({ usuarios, onEdit, onDelete, onActivate }: UsuarioTableProps) {
  return (
    <div className="flex flex-col gap-3">
      {usuarios.map((u) => {
        const isAdmin = u.rol?.nombre.toLowerCase() === 'admin';
        return (
          <Card key={u.id} className="border-border/60 shadow-xs">
            <CardHeader className="p-4 pb-2 flex-row flex-wrap items-center justify-between space-y-0 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-sm font-semibold">{u.nombre} {u.apellido}</CardTitle>
                  <span className="text-xs text-neutral-500">#{u.id}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${u.activo ? 'bg-green-50 text-green-700 border-green-100' : 'bg-neutral-50 text-neutral-600 border-neutral-100'}`}>
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 pb-3 text-sm flex flex-col gap-1 text-muted-foreground">
              <div><strong className="font-medium text-foreground">Email:</strong> {u.email}</div>
              {u.telefono && <div><strong className="font-medium text-foreground">Teléfono:</strong> {u.telefono}</div>}
              <div className="mt-1 flex items-center gap-2">
                {isAdmin && <Shield className="h-3 w-3 text-red-600" />}
                <span className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full ${isAdmin ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-neutral-100 text-neutral-700 border border-neutral-200'}`}>
                  {u.rol?.nombre || 'Vendedor'}
                </span>
              </div>
            </CardContent>
            <CardFooter className="px-4 py-3 bg-neutral-50 border-t flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(u)} disabled={!u.activo} className="h-8 p-2 text-neutral-500 hover:text-red-600">
                <Edit2 className="h-4 w-4 mr-1" /> Editar
              </Button>
              {u.activo ? (
                <Button variant="ghost" size="sm" onClick={() => onDelete(u)} className="h-8 p-2 text-red-500 hover:text-red-600">
                  <Trash className="h-4 w-4 mr-1" /> Desactivar
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => onActivate(u)} className="h-8 p-2 text-green-500 hover:text-green-600">
                  <Check className="h-4 w-4 mr-1" /> Activar
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
