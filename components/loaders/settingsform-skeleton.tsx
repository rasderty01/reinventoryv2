import { Skeleton } from "@/components/ui/skeleton";

export function SettingsFormSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-1/4" />
    </div>
  );
}
