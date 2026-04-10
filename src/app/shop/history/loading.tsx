export default function HistoryLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 p-4 flex items-center justify-between animate-pulse"
          >
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            <div className="space-y-2 text-right">
              <div className="h-5 w-20 bg-gray-200 rounded ml-auto" />
              <div className="h-3 w-16 bg-gray-100 rounded ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
