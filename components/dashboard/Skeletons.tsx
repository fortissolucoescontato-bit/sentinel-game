import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LeaderboardSkeleton() {
    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
                <Skeleton className="h-6 w-48 bg-slate-800" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded bg-slate-950/50">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full bg-slate-800" />
                                <Skeleton className="h-4 w-32 bg-slate-800" />
                            </div>
                            <Skeleton className="h-4 w-20 bg-slate-800" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-6">
                        <Skeleton className="h-4 w-20 mb-3 bg-slate-800" />
                        <Skeleton className="h-8 w-16 bg-slate-800" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function SafeListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <Skeleton className="h-5 w-24 bg-slate-800" />
                            <Skeleton className="h-5 w-12 bg-slate-800" />
                        </div>
                        <Skeleton className="h-4 w-32 bg-slate-800" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
