interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function LoadingSkeleton({
  className = "",
  variant = "text",
  width,
  height,
  lines = 1,
}: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-base-300 rounded";

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  if (variant === "circular") {
    return (
      <div
        className={`${baseClasses} rounded-full ${className}`}
        style={{ ...style, aspectRatio: "1/1" }}
        role="status"
        aria-label="Loading"
      />
    );
  }

  if (variant === "rectangular") {
    return (
      <div
        className={`${baseClasses} ${className}`}
        style={style}
        role="status"
        aria-label="Loading"
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`${baseClasses} rounded-lg p-4 ${className}`}
        style={style}
        role="status"
        aria-label="Loading"
      >
        <div className="space-y-3">
          <div className="h-4 bg-base-200 rounded w-3/4" />
          <div className="h-3 bg-base-200 rounded w-full" />
          <div className="h-3 bg-base-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  // Text variant
  if (lines === 1) {
    return (
      <div
        className={`${baseClasses} h-4 ${className}`}
        style={style}
        role="status"
        aria-label="Loading"
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} h-4`}
          style={{
            ...style,
            width: index === lines - 1 ? "75%" : "100%",
          }}
        />
      ))}
    </div>
  );
}

// Preset skeleton components for common use cases
export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`card bg-base-200 animate-pulse ${className}`}>
      <div className="card-body">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-base-300" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-base-300 rounded w-3/4" />
            <div className="h-3 bg-base-300 rounded w-1/2" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-base-300 rounded w-full" />
          <div className="h-3 bg-base-300 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function ListItemSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 p-4 animate-pulse ${className}`}>
      <div className="w-10 h-10 rounded-full bg-base-300" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-base-300 rounded w-1/2" />
        <div className="h-3 bg-base-300 rounded w-3/4" />
      </div>
      <div className="w-20 h-8 bg-base-300 rounded" />
    </div>
  );
}

// Namespace export for convenient usage like LoadingSkeleton.Card
LoadingSkeleton.Card = CardSkeleton;
LoadingSkeleton.ListItem = ListItemSkeleton;
