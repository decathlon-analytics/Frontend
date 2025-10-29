"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { MonthlyReview } from "@/lib/api/types"
import { Calendar, TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

interface MonthlyReviewsChartProps {
  data: MonthlyReview[]
  isLoading?: boolean
}

export function MonthlyReviewsChart({ data, isLoading }: MonthlyReviewsChartProps) {
  if (isLoading) {
    return (
      <div className="border shadow-sm bg-card border-border rounded-xl">
        <div className="p-4 border-b sm:p-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-green-500 sm:w-5 sm:h-5" />
            <h2 className="text-lg font-semibold sm:text-xl">월별 리뷰 추이</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-b-2 border-green-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="border shadow-sm bg-card border-border rounded-xl">
        <div className="p-4 border-b sm:p-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-green-500 sm:w-5 sm:h-5" />
            <h2 className="text-lg font-semibold sm:text-xl">월별 리뷰 추이</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-center text-muted-foreground">데이터가 없습니다</p>
        </div>
      </div>
    )
  }

  // 데이터 정렬 및 변환 (유효한 데이터만 필터링)
  const validData = data.filter(item => 
    item && 
    item.month && 
    typeof item.month === 'string' &&
    typeof item.count === 'number'
  )

  if (validData.length === 0) {
    return (
      <div className="border shadow-sm bg-card border-border rounded-xl">
        <div className="p-4 border-b sm:p-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-green-500 sm:w-5 sm:h-5" />
            <h2 className="text-lg font-semibold sm:text-xl">월별 리뷰 추이</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-center text-muted-foreground">유효한 데이터가 없습니다</p>
        </div>
      </div>
    )
  }
  
  const sortedData = [...validData].sort((a, b) => a.month.localeCompare(b.month))
  
  const chartData = sortedData.map((item) => ({
    month: item.month,
    // 월-년 형식으로 표시 (2025-04 → 04.25)
    label: item.month.split('-').reverse().join('.'),
    reviewCount: item.count
  }))

  const chartConfig = {
    reviewCount: {
      label: "리뷰 수",
      color: "hsl(var(--chart-1))",
    },
  }

  // 추세 계산
  const getTrend = () => {
    if (chartData.length < 2) return { direction: 'stable', percentage: 0 }
    const first = chartData[0].reviewCount
    const last = chartData[chartData.length - 1].reviewCount
    const percentage = ((last - first) / first) * 100
    return {
      direction: percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable',
      percentage: Math.abs(percentage)
    }
  }

  const trend = getTrend()

  return (
    <div className="border shadow-sm bg-card border-border rounded-xl">
      <div className="p-4 border-b sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-green-500 sm:w-5 sm:h-5" />
            <h2 className="text-lg font-semibold sm:text-xl">월별 리뷰 추이</h2>
          </div>
          {trend.direction !== 'stable' && (
            <div className={`flex items-center space-x-1 text-sm ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-3 h-3 ${
                trend.direction === 'down' ? 'rotate-180' : ''
              }`} />
              <span>{trend.percentage.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value, name) => [
                    `${Number(value).toLocaleString()}개`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />
              } 
            />
            <Line 
              type="monotone" 
              dataKey="reviewCount" 
              stroke="var(--color-reviewCount)" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
        
        {/* 추가 통계 */}
        <div className="grid grid-cols-1 gap-4 mt-6 text-center sm:grid-cols-3">
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-lg font-bold text-foreground">
              {chartData.reduce((sum, item) => sum + item.reviewCount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">총 리뷰 수</div>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-lg font-bold text-foreground">
              {Math.round(chartData.reduce((sum, item) => sum + item.reviewCount, 0) / chartData.length).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">월평균 리뷰수</div>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-lg font-bold text-foreground">
              {chartData.length}
            </div>
            <div className="text-xs text-muted-foreground">분석 기간(월)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
