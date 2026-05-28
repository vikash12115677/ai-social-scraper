export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-5 space-y-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-32 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
            <div className="skeleton h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-5/6 rounded" />
            <div className="skeleton h-3 w-4/6 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-5 w-14 rounded-full" />
            <div className="skeleton h-5 w-14 rounded-full" />
            <div className="skeleton h-5 w-14 rounded-full" />
          </div>
          <div className="flex justify-between pt-1">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-3 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
