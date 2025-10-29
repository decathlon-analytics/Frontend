"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PriceBin } from "@/lib/api/types"
import { BarChart3 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface PriceBinsChartProps {
  data: PriceBin[]
  isLoading?: boolean
}

export function PriceBinsChart({ data, isLoading }: PriceBinsChartProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border shadow-sm rounded-xl">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <h2 className="text-lg sm:text-xl font-semibold">가격대별 분석</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
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
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <h2 className="text-lg sm:text-xl font-semibold">가격대별 분석</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-center text-muted-foreground">데이터가 없습니다</p>
        </div>
      </div>
    )
  }

  // 유효한 데이터만 필터링
  const validData = data.filter(bin => 
    bin && 
    bin.bin_label && 
    typeof bin.bin_label === 'string' &&
    typeof bin.avg_rating === 'number' &&
    typeof bin.avg_total_reviews === 'number' &&
    typeof bin.n_products === 'number'
  )

  if (validData.length === 0) {
    return (
      <div className="bg-card border border-border shadow-sm rounded-xl">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <h2 className="text-lg sm:text-xl font-semibold">가격대별 분석</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-center text-muted-foreground">유효한 데이터가 없습니다</p>
        </div>
      </div>
    )
  }

  // 차트용 데이터 변환
  const chartData = validData.map((bin) => ({
    priceRange: bin.bin_label.replace(/,/g, ''),
    rating: bin.avg_rating,
    reviews: bin.avg_total_reviews,
    products: bin.n_products,
    // 표시용 라벨
    label: `₩${bin.bin_label}`
  }))

  const chartConfig = {
    rating: {
      label: "평균 평점",
      color: "hsl(var(--chart-1))",
    },
    reviews: {
      label: "평균 리뷰수",
      color: "hsl(var(--chart-2))",
    },
    products: {
      label: "상품 수",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <div className="bg-card border border-border shadow-sm rounded-xl">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          <h2 className="text-lg sm:text-xl font-semibold">가격대별 분석</h2>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    name === 'rating' ? `${Number(value).toFixed(1)}★` :
                    name === 'reviews' ? `${Number(value).toFixed(0)}개` :
                    `${value}개`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />
              } 
            />
            <Bar dataKey="products" fill="var(--color-products)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
        
        {/* 추가 통계 */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {validData.reduce((sum, bin) => sum + bin.n_products, 0)}
            </div>
            <div className="text-xs text-muted-foreground">총 상품수</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {(validData.reduce((sum, bin) => sum + bin.avg_rating, 0) / validData.length).toFixed(1)}★
            </div>
            <div className="text-xs text-muted-foreground">전체 평균 평점</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {Math.round(validData.reduce((sum, bin) => sum + bin.avg_total_reviews, 0) / validData.length)}
            </div>
            <div className="text-xs text-muted-foreground">평균 리뷰수</div>
          </div>
        </div>
      </div>
    </div>
  )
}
