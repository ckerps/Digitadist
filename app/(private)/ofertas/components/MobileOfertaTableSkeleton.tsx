'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface MobileOfertaTableSkeletonProps {
  rows?: number;
}

export function MobileOfertaTableSkeleton({ rows = 5 }: MobileOfertaTableSkeletonProps) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <Card key={index} className="bg-white border-neutral-200">
          <div className="p-4">
            <div className="flex justify-between items-start gap-3 mb-3">
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
