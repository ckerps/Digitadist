import { Skeleton } from "@/components/ui/skeleton";

export default function ClientSkeleton() {
    return (
        <div className="min-h-screen w-full">
            <div className="mb-2 md:mb-8 ">
                <Skeleton className="h-8 w-62.5" />
            </div>
            <div>
                <Skeleton className=" h-62.5 w-full rounded-xl" />
            </div>
        </div>
    )
}