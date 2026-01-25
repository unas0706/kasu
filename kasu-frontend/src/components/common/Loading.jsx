import React from "react";
import { Loader2 } from "lucide-react";

const Loading = ({
  size = "md",
  message = "Loading...",
  fullScreen = false,
}) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2
            className={`${sizes[size]} animate-spin mx-auto text-primary-500`}
          />
          {message && (
            <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2
          className={`${sizes[size]} animate-spin mx-auto text-primary-500`}
        />
        {message && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export const LoadingSkeleton = ({ type = "card", count = 1 }) => {
  const CardSkeleton = () => (
    <div className="card animate-pulse">
      <div className="card-header">
        <div className="skeleton skeleton-text w-1/3"></div>
        <div className="skeleton skeleton-text w-1/4"></div>
      </div>
      <div className="card-body space-y-3">
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text w-2/3"></div>
        <div className="skeleton skeleton-text w-1/2"></div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="card animate-pulse">
      <div className="card-header">
        <div className="skeleton skeleton-text w-1/4"></div>
      </div>
      <div className="card-body">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton skeleton-text"></div>
          ))}
        </div>
      </div>
    </div>
  );

  const skeletons = [];

  for (let i = 0; i < count; i++) {
    if (type === "card") {
      skeletons.push(<CardSkeleton key={i} />);
    } else if (type === "table") {
      skeletons.push(<TableSkeleton key={i} />);
    }
  }

  return <>{skeletons}</>;
};

export default Loading;
