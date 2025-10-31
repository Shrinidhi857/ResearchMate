"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressBarCardProps {
  title: string; // document name
  progress: number;
  height?: number;
  animated?: boolean;
  showPercentage?: boolean;
}

const ProgressBarCard: React.FC<ProgressBarCardProps> = ({
  title,
  progress,
  height = 10,
  animated = true,
  showPercentage = true,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const isComplete = clampedProgress === 100;

  return (
    <Card className="w-full max-w-3xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex justify-between items-center">
          {title}

          <div className="flex items-center gap-2">
            {showPercentage && (
              <span className="text-sm text-muted-foreground">
                {Math.round(clampedProgress)}%
              </span>
            )}
            <div
              className={`text-xs font-medium ${
                isComplete ? "text-green-600" : "text-blue-500"
              }`}
            >
              {isComplete ? "Examined" : "Processing"}
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div
          className="relative bg-gray-200 rounded-full overflow-hidden"
          style={{ height: `${height}px` }}
        >
          <div
            className={`h-full rounded-full ${
              animated ? "transition-all duration-500 ease-out" : ""
            }`}
            style={{
              width: `${clampedProgress}%`,
              background: isComplete
                ? "#22c55e" // ✅ solid green when done
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
      </CardContent>
    </Card>
  );
};

export default ProgressBarCard;
