import React, { useState } from "react";

interface ProgressBarProps {
  title?: string;
  progress: number;
  height?: number;
  animated?: boolean;
  showPercentage?: boolean;
}

const AnimatedGradientProgressBar: React.FC<ProgressBarProps> = ({
  title,
  progress,
  height = 12,
  animated = true,
  showPercentage = true,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const isComplete = clampedProgress === 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-background border rounded-xl shadow-sm space-y-3">
      {(title || showPercentage) && (
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-foreground truncate max-w-[80%]">
            {title || "Processing..."}
          </span>
          <div className="flex items-center gap-2">
            {showPercentage && (
              <span className="text-muted-foreground mr-1">
                {Math.round(clampedProgress)}%
              </span>
            )}
            <span className={isComplete ? "text-green-500" : "text-blue-500"}>
              {isComplete ? "Completed" : "Analysing..."}
            </span>
          </div>
        </div>
      )}
      <div
        className="relative bg-muted rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={`h-full rounded-full ${
            animated ? "transition-all duration-500 ease-out" : ""
          }`}
          style={{
            width: `${clampedProgress}%`,
            background: isComplete
              ? "#22c55e"
              : "linear-gradient(90deg, #4285f4, #ea4335, #fbbc04, #34a853, #4285f4, #ea4335)",
            backgroundSize: "400% 100%",
            animation: isComplete ? "none" : "gradientShift 3s ease infinite",
          }}
        ></div>
      </div>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedGradientProgressBar;
