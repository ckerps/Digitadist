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

interface ClienteTableSkeletonProps {
  rows?: number;
}

export function ClienteTableSkeleton({ rows = 10 }: ClienteTableSkeletonProps) {
  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-900 hover:bg-neutral-900">
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">ID</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">Tipo</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">Nombre</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">Dirección</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">CUIT</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">Teléfono</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="hover:bg-red-50">
              <TableCell className="px-6 py-2">
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell className="px-6 py-2">
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell className="px-6 py-2">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="px-6 py-2">
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell className="px-6 py-2">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="px-6 py-2">
                <Skeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
