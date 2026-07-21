'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Usuario, NuevoUsuario, UpdateUsuario } from '@/types/usuario';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

interface UsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => Promise<void>;
  editingUsuario?: Usuario | null;
}

export function UsuarioModal({ open, onOpenChange, onSave, editingUsuario }: UsuarioModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    rol_id: '2', // Por defecto Vendedor
    activo: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingUsuario) {
      setFormData({
        nombre: editingUsuario.nombre,
        apellido: editingUsuario.apellido,
        email: editingUsuario.email,
        telefono: editingUsuario.telefono || '',
        password: '', // Password siempre vacío al editar
        rol_id: editingUsuario.rol_id.toString(),
        activo: editingUsuario.activo,
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        password: '',
        rol_id: '2',
        activo: true,
      });
    }
  }, [editingUsuario, open]);

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.apellido || !formData.email) {
      toast.error('Nombre, Apellido y Email son obligatorios');
      return;
    }

    if (!editingUsuario && !formData.password) {
      toast.error('La contraseña es obligatoria para nuevos usuarios');
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        rol_id: parseInt(formData.rol_id),
      };

      // Si estamos editando y el password está vacío, lo quitamos del objeto para no sobreescribirlo/fallar validación
      if (editingUsuario && !formData.password) {
        delete (dataToSave as any).password;
      }

      await onSave(dataToSave);
      onOpenChange(false);
    } catch (error: any) {
      // Error handled by the caller or toast
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-neutral-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900">
            {editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan"
                className="border-neutral-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Ej: Pérez"
                className="border-neutral-200"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="juan@ejemplo.com"
              className="border-neutral-200"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="11 2233 4455"
              className="border-neutral-200"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">
              {editingUsuario ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={editingUsuario ? "Dejar vacío para mantener" : "Mínimo 8 caracteres"}
              className="border-neutral-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="grid gap-2">
              <Label htmlFor="rol">Rol</Label>
              <Select value={formData.rol_id} onValueChange={(val) => setFormData({ ...formData, rol_id: val })}>
                <SelectTrigger id="rol" className="border-neutral-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Administrador</SelectItem>
                  <SelectItem value="2">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-neutral-300"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSaving ? 'Guardando...' : (editingUsuario ? 'Guardar Cambios' : 'Crear Usuario')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
