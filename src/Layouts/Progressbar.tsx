import React, { useState, useEffect } from "react";

interface ProgressBarProps {
  progress: number;
  height?: number;
  animated?: boolean;
  showPercentage?: boolean;
}

const AnimatedGradientProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 30,
  animated = true,
  showPercentage = true,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="max-w-3xl mx-auto p-2">
      <div
        className="relative bg-gray-200 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={`h-full rounded-full flex items-center justify-end pr-3 ${
            animated ? "transition-all duration-500 ease-out" : ""
          }`}
          style={{
            width: `${clampedProgress}%`,
            background:
              "linear-gradient(90deg, #4285f4, #ea4335, #fbbc04, #34a853, #4285f4, #ea4335)",
            backgroundSize: "400% 100%",
            animation: "gradientShift 3s ease infinite",
          }}
        ></div>
      </div>
      <style>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedGradientProgressBar;
