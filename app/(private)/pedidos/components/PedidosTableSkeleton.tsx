'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface PedidosTableSkeletonProps {
  rows?: number;
}

export function PedidosTableSkeleton({ rows = 5 }: PedidosTableSkeletonProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-xl border border-border bg-card shadow-xs animate-in fade-in duration-500")}>
      <Table className="w-full">
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-red-50">
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
