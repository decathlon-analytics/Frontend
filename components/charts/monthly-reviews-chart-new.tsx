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

  // 최근 12개월만 표시
  const recentData = data.slice(-12)

  // 월 이름 변환 함수
  const formatMonth = (yearMonth: string) => {
    if (!yearMonth || typeof yearMonth !== 'string') {
      return 'N/A'
    }
    
    const parts = yearMonth.split('-')
    if (parts.length !== 2) {
      return yearMonth // 원본 반환
    }
    
    const [year, month] = parts
    return `${year.slice(2)}.${month}`
  }

  // 차트용 데이터 변환
  const chartData = recentData.map((item) => ({
    month: formatMonth(item.year_month),
    reviews: item.review_count,
    fullMonth: item.year_month
  }))

  const chartConfig = {
    reviews: {
      label: "리뷰 수",
      color: "hsl(var(--chart-1))",
    },
  }

  // 최대값과 평균 계산
  const maxReviews = Math.max(...recentData.map(item => item.review_count))
  const totalReviews = recentData.reduce((sum, item) => sum + item.review_count, 0)
  const avgReviews = Math.round(totalReviews / recentData.length)

  return (
    <div className="bg-card border border-border shadow-sm rounded-xl">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <h2 className="text-lg sm:text-xl font-semibold">월별 리뷰 추이</h2>
          </div>
          <span className="text-sm text-muted-foreground">최근 12개월</span>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 11 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value, name) => [
                    `${Number(value).toLocaleString()}건`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `${payload[0].payload.fullMonth} (${label})`
                    }
                    return label
                  }}
                />
              } 
            />
            <Line 
              type="monotone" 
              dataKey="reviews" 
              stroke="var(--color-reviews)" 
              strokeWidth={3}
              dot={{ fill: "var(--color-reviews)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>
        
        {/* 요약 통계 */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-foreground">
                {totalReviews.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">총 리뷰 수</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-foreground">
                {avgReviews.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">월평균 리뷰</div>
            </div>
            <div className="p-3 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-lg font-bold text-foreground">
                    {maxReviews.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">최고 리뷰</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
