"use client";

// 1. Line과 LineChart를 recharts에서 가져옵니다.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { DailyStat } from "../actions"; // 변경된 타입을 가져옵니다.

// 2. 두 데이터 시리즈에 대한 색상과 라벨을 정의합니다.
const chartConfig = {
  signups: {
    label: "신규 가입",
    color: "hsl(var(--chart-1))",
  },
  profiles: {
    label: "신규 승인",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface DailyUsersChartProps {
  chartData: DailyStat[] | null;
  error: string | null;
}

export function DailyUsersChart({ chartData, error }: DailyUsersChartProps) {
  const maxCount = useMemo(() => {
    if (!chartData) return 0;
    // 3. 두 데이터 중 더 큰 값을 기준으로 Y축 최대값을 계산합니다.
    return Math.max(
      ...chartData.map((item) => Math.max(item.signups, item.profiles))
    );
  }, [chartData]);

  if (!chartData || chartData.length === 0) {
    // ...
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>최근 30일 신규 유저 추이</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData ? (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            {/* 4. BarChart를 LineChart로 변경합니다. */}
            <LineChart accessibilityLayer data={chartData || undefined}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("ko-KR", {
                    month: "numeric",
                    day: "numeric",
                  })
                }
                hide
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={30}
                allowDecimals={false}
                tickCount={maxCount < 5 ? maxCount + 1 : undefined}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="line" />}
              />

              {/* ## stroke 속성을 직접 색상 값으로 변경하여 테스트 ## */}
              <Line
                dataKey="signups"
                type="linear"
                stroke="var(--primary-default)" // "var(--color-signups)" 대신 "blue" 같은 기본 색상 입력
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                dataKey="profiles"
                type="linear"
                stroke="var(--primary-middle)" // "var(--color-profiles)" 대신 "orange" 같은 기본 색상 입력
                strokeWidth={2}
                isAnimationActive={false}
                dot={false}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
          </ChartContainer>
        ) : (
          <div className="text-center py-4">error : {error}</div>
        )}
      </CardContent>
    </Card>
  );
}
