'use client';

import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useProductoDetail } from '../hooks/useProductoDetail';
import LoadingPage from '../../../loading';
import ErrorPage from '../../../error';
import {
  ProductoInfo,
  OfertasTable,
  MobileOfertasTable,
  EditarProductoModal,
  DesactivarProductoModal,
} from '../components';
import { UpdateProducto } from '@/types/producto';

export default function ProductoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDesactivarModalOpen, setIsDesactivarModalOpen] = useState(false);
  const router = useRouter();

  const { producto, deleteProducto, updateProducto, isLoadingDetail, errorDetail, isUpdating, isDeleting } =
    useProductoDetail({ productoId: +id });

  if (isLoadingDetail) {
    return <LoadingPage />;
  }

  if (!producto || errorDetail) {
    console.log('Error loading producto detail:', errorDetail);
    return <ErrorPage message={errorDetail?.message || 'Error al cargar el producto.'} />;
  }

  const handleUpdateProducto = async (id: number, productos: UpdateProducto) => {
    try {
      await updateProducto(+id, productos);
      setIsEditModalOpen(false);
      toast.success('Producto actualizado correctamente');
    } catch (error) {
      toast.error(`Error al actualizar el producto: ${(error as Error).message}`);
      console.error('Error al actualizar el producto:', error);
    }
  };

  const handleDesactivarProducto = async () => {
    try {
      await deleteProducto(+id);
      setIsDesactivarModalOpen(false);
      toast.success('Producto desactivado correctamente');
      router.push('/productos');
    } catch (error) {
      toast.error(`Error al desactivar el producto: ${(error as Error).message}`);
      console.error('Error al desactivar el producto:', error);
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
            onClick={() => router.push('/productos')}
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">Productos</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {producto.nombre}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setIsEditModalOpen(true)}
            disabled={isUpdating || isDeleting}
            variant="outline"
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
          <Button
            onClick={() => setIsDesactivarModalOpen(true)}
            disabled={!producto.activo || isDeleting}
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Desactivar</span>
          </Button>
        </div>
      </div>

      {/* Product Info Section */}
      <ProductoInfo producto={producto as any} />

      {/* Related Offers Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 flex items-center gap-2">
            <Tag className="h-6 w-6" />
            Ofertas Relacionadas
          </h2>
          <p className="text-neutral-600 text-sm mt-1">Ofertas activas para este producto</p>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
          <div className="hidden md:block">
            <OfertasTable ofertas={producto.ofertas || []} />
          </div>
          <div className="block md:hidden">
            <MobileOfertasTable ofertas={producto.ofertas || []} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditarProductoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => handleUpdateProducto(+id, data)}
        producto={producto as any}
        isSaving={isUpdating}
      />

      <DesactivarProductoModal
        isOpen={isDesactivarModalOpen}
        onClose={() => setIsDesactivarModalOpen(false)}
        onConfirm={() => handleDesactivarProducto()}
        producto={producto as any}
        isDeleting={isDeleting}
      />
    </div>
  );
}
