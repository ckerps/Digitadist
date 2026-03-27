'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUsuariosComplete } from './hooks/useUsuariosComplete';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, LogOut, Loader2, AlertCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingPage from '../../loading';
import DebouncedInput from '../shared/DebouncedInput';

const itemsPerPage = 15;

export default function UsuariosPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    rol_id: '1',
    activo: true,
  });

  // Mostrar loading mientras se obtiene la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  // Solo admin puede acceder
  if ((session?.user as any)?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-neutral-900 mb-2">Acceso Denegado</h1>
            <p className="text-neutral-600 mb-4">Solo los administradores pueden gestionar usuarios</p>
            <Button onClick={() => router.push('/')} className="bg-red-600 hover:bg-red-700 w-full">
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { usuarios, isLoadingList, errorList, createUsuario, isCreating, deleteUsuario } = useUsuariosComplete({
    itemsPerPage,
    currentPage,
    filters: searchTerm ? { nombre: searchTerm } : undefined,
  });

  const handleCreateUsuario = async () => {
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      await createUsuario({
        ...formData,
        rol_id: parseInt(formData.rol_id),
        activo: true,
      });
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        password: '',
        rol_id: '1',
        activo: true,
      });
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Error al crear usuario');
    }
  };

  const handleDeleteUsuario = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas desactivar este usuario?')) return;
    try {
      await deleteUsuario(id);
    } catch (error: any) {
      toast.error(error.message || 'Error al desactivar usuario');
    }
  };

  return (
    <div className="full w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestiona los usuarios del sistema</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-neutral-200 rounded-lg p-2 md:p-4 shadow-sm">
        <div className="w-full lg:w-1/3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <DebouncedInput
              placeholder="Buscar por nombre, apellido o email..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        {errorList && (
          <div className="p-6 flex items-center gap-3 bg-red-50 border-b border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">Error: {errorList.message}</p>
          </div>
        )}

        {isLoadingList ? (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/6" />
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : usuarios?.usuarios && usuarios.usuarios.length > 0 ? (
          <DataTable
            data={usuarios.usuarios}
            columns={[
              {
                header: "Nombre Completo",
                className: "font-medium text-neutral-900",
                cell: (u) => `${u.nombre} ${u.apellido}`
              },
              { header: "Email", accessorKey: "email" },
              { header: "Teléfono", accessorKey: "telefono" },
              {
                header: "Rol",
                cell: (u) => (
                  <span className="capitalize text-sm bg-neutral-100 px-3 py-1 rounded text-neutral-700">
                    {u.rol?.nombre || 'N/A'}
                  </span>
                )
              },
              {
                header: "Estado",
                cell: (u) => (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      u.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                )
              },
              {
                header: "Acciones",
                className: "text-right",
                cell: (u) => (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUsuario(u.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                )
              }
            ]}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-neutral-500 mb-4">No hay usuarios para mostrar</p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear primer usuario
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {usuarios && usuarios.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="px-4 py-2 text-sm text-neutral-600">
              Página {currentPage} de {usuarios.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((p) => Math.min(usuarios.totalPages, p + 1))
              }
              disabled={currentPage === usuarios.totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Modal Nuevo Usuario */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-neutral-900">Nuevo Usuario</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Ej: Pérez"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: juan@example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: 1234567890"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rol">Rol</Label>
              <Select value={formData.rol_id} onValueChange={(val) => setFormData({ ...formData, rol_id: val })}>
                <SelectTrigger id="rol">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleCreateUsuario}
              disabled={isCreating}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCreating ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
