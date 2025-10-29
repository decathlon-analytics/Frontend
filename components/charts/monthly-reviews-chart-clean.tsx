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
      <div className="bg-card border border-border shadow-sm rounded-xl">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <h2 className="text-lg sm:text-xl font-semibold">월별 리뷰 추이</h2>
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
      <div className="bg-card border border-border shadow-sm rounded-xl">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <h2 className="text-lg sm:text-xl font-semibold">월별 리뷰 추이</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-center text-muted-foreground">데이터가 없습니다</p>
        </div>
      </div>
    )
  }

  // 데이터 정렬 및 변환
  const sortedData = [...data].sort((a, b) => a.year_month.localeCompare(b.year_month))
  
  const chartData = sortedData.map((item) => ({
    month: item.year_month,
    // 월-년 형식으로 표시
    label: item.year_month.split('-').reverse().join('.'),
    totalReviews: item.total_reviews,
    avgRating: item.avg_rating,
    productCount: item.n_products
  }))

  const chartConfig = {
    totalReviews: {
      label: "총 리뷰수",
      color: "hsl(var(--chart-1))",
    },
    avgRating: {
      label: "평균 평점",
      color: "hsl(var(--chart-2))",
    },
    productCount: {
      label: "상품 수",
      color: "hsl(var(--chart-3))",
    },
  }

  // 추세 계산
  const getTrend = () => {
    if (chartData.length < 2) return { direction: 'stable', percentage: 0 }
    const first = chartData[0].totalReviews
    const last = chartData[chartData.length - 1].totalReviews
    const percentage = ((last - first) / first) * 100
    return {
      direction: percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable',
      percentage: Math.abs(percentage)
    }
  }

  const trend = getTrend()

  return (
    <div className="bg-card border border-border shadow-sm rounded-xl">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <h2 className="text-lg sm:text-xl font-semibold">월별 리뷰 추이</h2>
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
                    name === 'avgRating' ? `${Number(value).toFixed(1)}★` :
                    name === 'totalReviews' ? `${Number(value).toLocaleString()}개` :
                    `${value}개`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />
              } 
            />
            <Line 
              type="monotone" 
              dataKey="totalReviews" 
              stroke="var(--color-totalReviews)" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
        
        {/* 추가 통계 */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {chartData.reduce((sum, item) => sum + item.totalReviews, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">총 리뷰 수</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {(chartData.reduce((sum, item) => sum + item.avgRating, 0) / chartData.length).toFixed(1)}★
            </div>
            <div className="text-xs text-muted-foreground">전체 평균 평점</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
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
