'use client';

import { Cliente, NuevoCliente, TipoCliente } from "@/types/cliente";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";



interface ClienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  cliente?: Cliente;
}

export function DesactivarClienteModal({ open, onOpenChange, onConfirm, cliente }: ClienteFormProps) {

    const handleConfirm = async () => {
        if (window.confirm("¿Está seguro que desea desactivar el cliente?")) {
            await onConfirm();
        }
    }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900">Desactivar cliente</DialogTitle>
        </DialogHeader>
            <b>¿Está seguro que desea desactivar el cliente '<>{cliente?.nombre}</>'?</b>
            <div>Sus pedidos activos serán marcados como cancelados</div>        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-neutral-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Desactivar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
