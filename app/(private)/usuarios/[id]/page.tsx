'use client';

import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { useUsuarioDetail } from '../hooks/useUsuarioDetail';
import LoadingPage from '../../../loading';
import ErrorPage from '../../../error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UpdateUsuario } from '@/types/usuario';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function UsuarioDetailPage() {
  const router = useRouter();
  const params = useParams();
  const usuarioId = parseInt(params.id as string);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateUsuario>({});

  const { usuario, isLoadingDetail, errorDetail, updateUsuario, deleteUsuario, isUpdating, isDeleting } =
    useUsuarioDetail({ usuarioId });

  React.useEffect(() => {
    if (usuario) {
      setFormData({
        email: usuario.email,
        nombre: usuario.nombre,
        rol_id: usuario.rol?.id,
      });
    }
  }, [usuario]);

  if (isLoadingDetail) {
    return <LoadingPage />;
  }

  if (!usuario || errorDetail) {
    return (
      <ErrorPage message={errorDetail?.message || 'Error al cargar el usuario.'} />
    );
  }

  const handleUpdateUsuario = async () => {
    try {
      await updateUsuario(usuarioId, formData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.log('Error al actualizar usuario:', error);
    }
  };

  const handleDeleteUsuario = async () => {
    try {
      await deleteUsuario(usuarioId);
      setIsDeleteModalOpen(false);
      router.push('/usuarios');
    } catch (error) {
      console.log('Error al eliminar usuario:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'VENDOR':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getRolLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'VENDOR':
        return 'Vendedor';
      default:
        return role;
    }
  };

  return (
    <div className="full w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/usuarios')}
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
              <span className="text-lg font-bold text-red-600">
                {usuario.nombre.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Usuarios</p>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
                {usuario.nombre}
              </h1>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-neutral-200 gap-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 gap-2"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </Button>
        </div>
      </div>

      {/* Info Cards Section */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-neutral-600 font-medium mb-2">Email</p>
            <p className="text-neutral-900 text-base">{usuario.email}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 font-medium mb-2">Rol</p>
            <div className={`${getRoleColor(usuario.rol?.nombre!)} inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium`}>
              <Shield className="w-4 h-4" />
              {getRolLabel(usuario.rol?.nombre!)}
            </div>
          </div>
          <div>
            <p className="text-sm text-neutral-600 font-medium mb-2">ID</p>
            <p className="text-neutral-900 text-base">{usuario.id}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 font-medium mb-2">Fecha de Creación</p>
            <p className="text-neutral-900 text-base">
              {new Date(usuario.fecha_creacion).toLocaleDateString('es-AR')}
            </p>
          </div>
          {usuario.fecha_actualizacion && (
            <div>
              <p className="text-sm text-neutral-600 font-medium mb-2">Última Actualización</p>
              <p className="text-neutral-900 text-base">
                {new Date(usuario.fecha_actualizacion).toLocaleDateString('es-AR')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Modifica los datos del usuario</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre || ''}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre del usuario"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.rol_id?.toString() || usuario.rol?.id.toString()} onValueChange={(value) => setFormData({ ...formData, rol_id: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Administrador</SelectItem>
                  <SelectItem value="2">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleUpdateUsuario}
              disabled={isUpdating}
            >
              {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
            <DialogDescription>
              ¿Está seguro? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-sm text-red-800">
              Se eliminará el usuario <strong>{usuario.nombre}</strong> del sistema.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUsuario}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Usuario'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
