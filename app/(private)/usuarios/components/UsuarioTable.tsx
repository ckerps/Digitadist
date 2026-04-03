'use client';

import { Usuario } from '@/types/usuario';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Check, Edit2, Shield, Trash, User } from 'lucide-react';

interface UsuarioTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
  onActivate: (usuario: Usuario) => void;
}

export function UsuarioTable({ usuarios, onEdit, onDelete, onActivate }: UsuarioTableProps) {
  return (
    <DataTable
      data={usuarios}
      columns={[
        {
          header: "Nombre Completo",
          className: "font-medium text-neutral-900",
          cell: (u) => (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-900">{u.nombre} {u.apellido}</span>
                <span className="text-xs text-neutral-500">ID: #{u.id}</span>
              </div>
            </div>
          )
        },
        {
          header: "Email",
          cell: (u) => <span className="text-neutral-600">{u.email}</span>
        },
        {
          header: "Teléfono",
          cell: (u) => <span className="text-neutral-600">{u.telefono || '-'}</span>
        },
        {
          header: "Rol",
          cell: (u) => {
            const isAdmin = u.rol?.nombre.toLowerCase() === 'admin';
            return (
              <div className="flex items-center gap-2">
                {isAdmin && <Shield className="h-3 w-3 text-red-600" />}
                <span className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full ${isAdmin
                  ? 'bg-red-50 text-red-700 border border-red-100'
                  : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                  }`}>
                  {u.rol?.nombre || 'Vendedor'}
                </span>
              </div>
            );
          }
        },
        {
          header: "Estado",
          cell: (u) => (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${u.activo
                ? 'bg-green-50 text-green-700 border-green-100'
                : 'bg-neutral-50 text-neutral-600 border-neutral-100'
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.activo ? 'bg-green-500' : 'bg-neutral-400'}`} />
              {u.activo ? 'Activo' : 'Inactivo'}
            </span>
          )
        },
        {
          header: "Acciones",
          className: "text-right",
          cell: (u) => (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(u)}
                className="h-8 w-8 p-0 text-neutral-500 hover:text-red-600 hover:bg-red-50"
                disabled={!u.activo}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(u)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                disabled={!u.activo}
              >
                <Trash className="h-4 w-4" />
              </Button>
              {!u.activo && <Button
                variant="ghost"
                size="sm"
                onClick={() => onActivate(u)}
                className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-50"
                disabled={u.activo}
              >
                <Check className="h-4 w-4" />
              </Button>}
            </div>
          )
        }
      ]}
    />
  );
}
