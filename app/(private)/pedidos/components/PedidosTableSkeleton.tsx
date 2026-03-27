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

interface PedidosTableSkeletonProps {
  rows?: number;
}

export function PedidosTableSkeleton({ rows = 10 }: PedidosTableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-900 hover:bg-neutral-900">
            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-white">ID</TableHead>
            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-white">Cliente</TableHead>
            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-white">Total</TableHead>
            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-white">Fecha</TableHead>
            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-white">Estado</TableHead>
            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-white">Pago</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="hover:bg-red-50">
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-6 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
