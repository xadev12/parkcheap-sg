export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            <div className="h-5 w-12 bg-gray-200 rounded-md" />
            <div className="h-5 w-20 bg-gray-200 rounded-md" />
          </div>
          <div className="h-5 w-48 bg-gray-200 rounded-md" />
        </div>
        <div className="text-right">
          <div className="h-6 w-16 bg-gray-200 rounded-md mb-1" />
          <div className="h-3 w-12 bg-gray-100 rounded-md" />
        </div>
      </div>
      <div className="flex gap-3 mb-3">
        <div className="h-4 w-16 bg-gray-100 rounded-md" />
        <div className="h-4 w-20 bg-gray-100 rounded-md" />
      </div>
      <div className="h-10 bg-gray-100 rounded-lg mb-3" />
      <div className="flex gap-2">
        <div className="flex-1 h-11 bg-gray-100 rounded-lg" />
        <div className="flex-1 h-11 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}
