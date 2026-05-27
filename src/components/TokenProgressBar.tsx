import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface TokenProgressBarProps {
  tokens: number;
  maxTokens?: number;
}

export function TokenProgressBar({
  tokens,
  maxTokens = 30000,
}: TokenProgressBarProps) {
  const percentage = Math.min((tokens / maxTokens) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">Tokens Used</span>
        <span className="font-semibold text-blue-600">
          {tokens.toLocaleString()} / {maxTokens.toLocaleString()}
        </span>
      </div>
      <Progress value={percentage} className="h-2 [&>*]:bg-blue-500" />
    </div>
  );
}
