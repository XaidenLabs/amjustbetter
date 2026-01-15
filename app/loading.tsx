import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="w-full min-h-screen bg-background pt-20">
            {/* Hero Section Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="space-y-8 order-2 lg:order-1">
                        <Skeleton className="h-8 w-48 rounded-full" />
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full max-w-lg" />
                            <Skeleton className="h-12 w-3/4" />
                        </div>
                        <Skeleton className="h-6 w-full max-w-md" />
                        <div className="flex gap-4 pt-4">
                            <Skeleton className="h-14 w-40 rounded-full" />
                            <Skeleton className="h-14 w-40 rounded-full" />
                        </div>
                        <div className="flex gap-8 pt-8">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 flex justify-center">
                        <Skeleton className="w-[400px] h-[400px] rounded-full" />
                    </div>
                </div>
            </div>

            {/* Impact Section Skeleton */}
            <div className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col items-center mb-12 space-y-4">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
