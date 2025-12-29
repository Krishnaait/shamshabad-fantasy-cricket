export function MatchCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      {/* Match type badge skeleton */}
      <div className="h-5 w-16 bg-muted rounded mb-4" />
      
      {/* Match title skeleton */}
      <div className="h-6 w-3/4 bg-muted rounded mb-3" />
      
      {/* Venue skeleton */}
      <div className="h-4 w-1/2 bg-muted rounded mb-4" />
      
      {/* Teams skeleton */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-muted rounded-full" />
          <div className="flex-1">
            <div className="h-4 w-20 bg-muted rounded mb-2" />
            <div className="h-5 w-16 bg-muted rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-muted rounded-full" />
          <div className="flex-1">
            <div className="h-4 w-20 bg-muted rounded mb-2" />
            <div className="h-5 w-16 bg-muted rounded" />
          </div>
        </div>
      </div>
      
      {/* Date/time skeleton */}
      <div className="h-4 w-32 bg-muted rounded mb-4" />
      
      {/* Button skeleton */}
      <div className="h-10 w-full bg-muted rounded" />
    </div>
  );
}

export function MatchCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MatchCardSkeleton key={i} />
      ))}
    </div>
  );
}
