'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';

interface ProductosTableSkeletonProps {
  rows?: number;
}

export function ProductosTableSkeleton({ rows = 10 }: ProductosTableSkeletonProps) {
  return (
    <div className="rounded-lg border border-neutral-200 overflow-hidden shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50 border-b border-neutral-200">
            <TableHead className="text-neutral-700 font-semibold">ID</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Nombre</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Stock</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Costo</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Precio lista</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Vencimiento</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Presentación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="border-b border-neutral-100 hover:bg-neutral-50">
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
