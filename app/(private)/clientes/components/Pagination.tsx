'use client';

import { Pagination as ShadcnPagination, PaginationContent, PaginationItem, PaginationEllipsis } from '../../../components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../../../components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Calcular qué páginas mostrar
  const getVisiblePages = () => {
    const maxVisible = 5;
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
      <p className="text-sm text-neutral-600">
        Mostrando {startItem} - {endItem} de {totalItems} resultados
      </p>
      <ShadcnPagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-neutral-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </PaginationItem>
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            const isActive = currentPage === page;
            return (
              <PaginationItem key={page}>
                <Button
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={cn(
                    isActive
                      ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                      : 'border-neutral-300'
                  )}
                >
                  {page}
                </Button>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="border-neutral-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
}

