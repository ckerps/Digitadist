'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUsuariosComplete } from './hooks/useUsuariosComplete';
import {
  UsuarioTable,
  UsuarioFilters,
  UsuarioModal
} from './components';
import { itemsPerPage } from '../utils';
import { Pagination } from '../shared/Pagination';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Usuario } from '@/types/usuario';
import ErrorPage from '../../error';

export default function UsuariosPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

  // Rol check session
  const isAdmin = (session?.user as any)?.role?.toLowerCase() === 'admin';

  // Construir filtros
  const filters: any = {};
  if (searchTerm.length > 0) filters.nombre = searchTerm;
  if (filterRole !== 'all') filters.rol_id = parseInt(filterRole);

  const { usuarios, isLoadingList, errorList, createUsuario, updateUsuario } = useUsuariosComplete({
    itemsPerPage,
    currentPage,
    filters: Object.keys(filters).length > 0 ? filters : undefined
  });

  // Mostrar loading mientras se obtiene la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  // Redirección si no es admin (opcional aquí, el middleware ya debería manejarlo, pero por seguridad UI lo dejo)
  if (!isAdmin && status === 'authenticated') {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md border-neutral-200">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-neutral-900 mb-2">Acceso Denegado</h1>
            <p className="text-neutral-600 mb-4">Solo los administradores pueden gestionar usuarios.</p>
            <Button onClick={() => router.push('/')} className="bg-red-600 hover:bg-red-700 w-full text-white">
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (role_id: string) => {
    setFilterRole(role_id);
    setCurrentPage(1);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleSaveUsuario = async (data: any) => {
    if (editingUsuario) {
      await updateUsuario(editingUsuario.id, data);
    } else {
      await createUsuario(data);
    }
    setEditingUsuario(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (data: Usuario) => {
    if (window.confirm(`¿Está seguro que desea desactivar al usuario ${data.nombre} ${data.apellido}?`)) {
      await updateUsuario(data.id, { activo: false });
    }
    return;
  };

  const handleActivate = async (data: Usuario) => {
    if (window.confirm(`¿Está seguro que desea activar al usuario ${data.nombre} ${data.apellido}?`)) {
      await updateUsuario(data.id, { activo: true });
    }
    return;
  };

  if (errorList) return <ErrorPage message={errorList.message} />;

  return (
    <div className="full w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestioná los accesos y roles del sistema</p>
        </div>
        <Button
          onClick={() => {
            setEditingUsuario(null);
            setIsModalOpen(true);
          }}
          size="lg"
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-neutral-200 rounded-lg p-2 md:p-3 shadow-sm">
        <UsuarioFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterRole={filterRole}
          onFilterRoleChange={handleRoleChange}
        />
      </div>

      {/* Data Table Section */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        {isLoadingList && !usuarios ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <UsuarioTable
            usuarios={usuarios?.usuarios ?? []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onActivate={handleActivate}
          />
        )}
      </div>

      <div className="flex justify-center mt-2">
        <Pagination
          currentPage={currentPage}
          totalPages={usuarios?.totalPages || 1}
          totalItems={usuarios?.totalItems || 0}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <UsuarioModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingUsuario(null);
        }}
        onSave={handleSaveUsuario}
        editingUsuario={editingUsuario}
      />
    </div>
  );
}

