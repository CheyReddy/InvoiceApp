function LoadingSpinner({
  size = "md",
  text = "",
  fullScreen = false,
  light = false,
}) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-10 w-10 border-4",
  };

  const spinner = (
    <div
      className={`
        ${sizes[size] || sizes.md}
        animate-spin
        rounded-full
        shrink-0
        ${
          light
            ? "border-white/40 border-t-white"
            : "border-gray-300 border-t-gray-800 dark:border-gray-700 dark:border-t-white"
        }
      `}
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition-colors flex items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center gap-3">
          {spinner}

          {text && (
            <p className="text-center text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {spinner}

      {text && (
        <span className="ml-2 text-xs sm:text-sm">
          {text}
        </span>
      )}
    </div>
  );
}

export default LoadingSpinner;
