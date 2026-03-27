'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '../../../components/ui/card';

interface MobileProductosTableSkeletonProps {
  rows?: number;
}

export function MobileProductosTableSkeleton({ rows = 5 }: MobileProductosTableSkeletonProps) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <Card key={index} className="bg-white border-neutral-200">
          <div className="p-4">
            <div className="flex justify-between items-start gap-3 mb-3">
              <div className="flex-1">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-5 w-40" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
