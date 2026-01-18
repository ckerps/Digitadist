import { Skeleton } from "@/components/ui/skeleton";

export default function ClientSkeleton() {
    return (
        <div className="min-h-screen w-full">
            <div className="mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Clientes</h1>
            </div>
            <div>
                <Skeleton className=" h-62.5 w-full rounded-xl" />
            </div>
        </div>
    )
}