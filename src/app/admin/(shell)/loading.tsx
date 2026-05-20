export default function AdminLoading() {
  return (
    <div className="px-6 md:px-10 py-8">
      <div className="h-8 w-40 bg-secondary rounded animate-pulse" />
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-md border border-border bg-card p-4">
            <div className="h-3 w-24 bg-secondary/60 rounded animate-pulse" />
            <div className="mt-2 h-8 w-16 bg-secondary rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
