"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Pagination } from "../shared/Pagination";
import { useOfertas } from "./hooks/useOfertas";
import { OfertasTable, MobileOfertasTable, FiltrosOfertas } from "./components";
import { FiltrosOferta, NuevaOferta } from "@/types/oferta";
import { OfertaTableSkeleton } from "./components/OfertaTableSkeleton";
import { MobileOfertaTableSkeleton } from "./components/MobileOfertaTableSkeleton";
import { itemsPerPage } from "../utils";
import { NuevaOfertaModal } from "./components/NuevaOfertaModal";

export default function OfertasPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosOferta | undefined>({});
  const [nuevaOfertaModalOpen, setNuevaOfertaModalOpen] = useState(false);

  const { ofertas, isLoadingList, paginacion, createOferta } = useOfertas({
    itemsPerPage: itemsPerPage,
    currentPage,
    filtros,
  });

  const handleRowClick = (id: number) => {
    router.push(`/ofertas/${id}`);
  };

  const handleApplyFiltros = (newFiltros: FiltrosOferta) => {
    setFiltros(newFiltros);
    setCurrentPage(1);
  };

  const handleResetFiltros = () => {
    setFiltros(undefined);
    setCurrentPage(1);
  };

  const handleSaveOferta = async (oferta: NuevaOferta) => {
    await createOferta(oferta);
    setNuevaOfertaModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="full w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Ofertas</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestiona tus ofertas comerciales</p>
        </div>
        <Button
          onClick={() => setNuevaOfertaModalOpen(true)}
          size="lg"
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Oferta
        </Button>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-neutral-200 rounded-lg p-2 shadow-sm">
        <FiltrosOfertas
          onApplyFiltros={handleApplyFiltros}
          onReset={handleResetFiltros}
        />
      </div>

      {/* Data Table Section */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        {isLoadingList || !ofertas ? (
          <>
            <div className='hidden md:block'>
              <OfertaTableSkeleton rows={itemsPerPage} />
            </div>
            <div className='block md:hidden'>
              <MobileOfertaTableSkeleton rows={5} />
            </div>
          </>
        ) : (
          <>
            <div className='hidden md:block'>
              <OfertasTable ofertas={ofertas} onRowClick={handleRowClick} />
            </div>

            <div className='block md:hidden'>
              <MobileOfertasTable ofertas={ofertas} onCardClick={handleRowClick} />
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={paginacion.totalPages}
          onPageChange={setCurrentPage}
          totalItems={paginacion.totalItems}
          itemsPerPage={paginacion.itemsPerPage}
        />
      </div>

      <NuevaOfertaModal
        open={nuevaOfertaModalOpen}
        onOpenChange={setNuevaOfertaModalOpen}
        onSave={handleSaveOferta}
      />
    </div>
  );
}
