'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Tag, Package } from 'lucide-react';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UpdateProducto } from '@/types/producto';


export default function ProductoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDesactivarModalOpen, setIsDesactivarModalOpen] = useState(false);
  const router = useRouter();

  const isNuevo = id === 'nuevo';

  useEffect(() => {
    if (isNuevo) {
      router.replace('/productos');
    }
  }, [isNuevo, router]);

  const { producto, deleteProducto, updateProducto, isLoadingDetail, errorDetail, isUpdating, isDeleting } =
    useProductoDetail({ productoId: isNuevo ? 0 : +id });

  if (isNuevo || isLoadingDetail) {
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
      console.log('Error al actualizar el producto:', error);
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
      console.log('Error al desactivar el producto:', error);
    }
  };

  return (
    <div className="h-full w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm mt-1">Productos</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{producto.nombre}</h1>
        </div>
        <Button
          onClick={() => router.push('/productos')}
          size="lg"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image Section */}
        <div className="md:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="bg-neutral-50/50 py-4 px-6 border-b border-neutral-100">
              <CardTitle className="text-sm font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <Package className="h-4 w-4" />
                Imagen del Producto
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex items-center justify-center bg-white min-h-[300px]">
              {producto.imagen ? (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="max-w-full max-h-[400px] object-contain rounded-md transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Imagen';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-neutral-400 space-y-3">
                  <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Package className="h-10 w-10 text-neutral-300" />
                  </div>
                  <p className="text-sm font-medium">Sin imagen disponible</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-xs hover:text-red-600"
                  >
                    Agregar una imagen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Info Section */}
        <div className="md:col-span-1">
          <ProductoInfo producto={producto as any} />
        </div>
      </div>



      {/* Related Offers Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center gap-2">
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
