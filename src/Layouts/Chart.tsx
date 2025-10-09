"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Example token usage dataset (daily usage)
const chartData = [
  { date: "2024-04-01", usage: 222 },
  { date: "2024-04-15", usage: 97 },
  { date: "2024-05-01", usage: 373 },
  { date: "2024-05-15", usage: 301 },
  { date: "2024-06-01", usage: 498 },
  { date: "2024-06-15", usage: 323 },
  { date: "2024-06-30", usage: 446 },
];

// Remaining token count (for the header)
const remainingTokens = 12500;

const chartConfig = {
  usage: {
    label: "Usage",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartLineInteractive() {
  return (
    <Card className="py-4 sm:py-0 space-y-6 py-5">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="mt-5 flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Remaining Token Count</CardTitle>
          <CardDescription>
            {remainingTokens.toLocaleString()} tokens left
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // only show month and year
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "2-digit",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="usage"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey="usage"
              type="monotone"
              stroke="var(--color-usage)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
