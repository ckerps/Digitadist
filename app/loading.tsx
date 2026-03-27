import { Skeleton } from "../src/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div className="full w-full space-y-6 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-48 md:w-64" />
        </div>
        <Skeleton className="h-10 w-full md:w-32" />
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
