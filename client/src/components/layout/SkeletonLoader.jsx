import React from "react";

function SkeletonLoader() {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200 rounded-t-xl"></div>

      <div className="p-4">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>

        {/* Description placeholders */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        {/* Category and date placeholders */}
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>

      {/* Action buttons placeholder */}
      <div className="p-4 border-t border-gray-100 flex justify-between">
        <div className="h-10 bg-gray-200 rounded-full w-24"></div>
        <div className="h-10 bg-gray-200 rounded-full w-24"></div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
