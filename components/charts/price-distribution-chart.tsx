"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PriceDistribution } from "@/lib/api/types"
import { BarChart3, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface PriceDistributionChartProps {
  data: PriceDistribution | undefined
  isLoading?: boolean
  category: string
}

export function PriceDistributionChart({ data, isLoading, category }: PriceDistributionChartProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border shadow-sm rounded-xl">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <h2 className="text-lg sm:text-xl font-semibold">{category} 가격 분포</h2>
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

  if (!data || !data.hist || data.hist.length === 0) {
    return (
      <div className="bg-card border border-border shadow-sm rounded-xl">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <h2 className="text-lg sm:text-xl font-semibold">{category} 가격 분포</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-center text-muted-foreground">데이터가 없습니다</p>
        </div>
      </div>
    )
  }

  // 유효한 히스토그램 데이터만 필터링
  const validData = data.hist.filter(bin => 
    bin && 
    bin.bin_label && 
    typeof bin.bin_label === 'string' &&
    typeof bin.count === 'number'
  )

  if (validData.length === 0) {
    return (
      <div className="bg-card border border-border shadow-sm rounded-xl">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <h2 className="text-lg sm:text-xl font-semibold">{category} 가격 분포</h2>
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
    priceRange: bin.bin_label,
    count: bin.count,
    // 표시용 라벨
    label: `₩${bin.bin_label.replace(',', '')}`
  }))

  const chartConfig = {
    count: {
      label: "상품 수",
      color: "hsl(var(--chart-1))",
    },
  }

  // 가격 통계 계산
  const totalProducts = data.prices?.length || 0
  const avgPrice = totalProducts > 0 ? Math.round(data.prices.reduce((sum, price) => sum + price, 0) / totalProducts) : 0
  const maxPrice = totalProducts > 0 ? Math.max(...data.prices) : 0
  const minPrice = totalProducts > 0 ? Math.min(...data.prices) : 0

  return (
    <div className="bg-card border border-border shadow-sm rounded-xl">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <h2 className="text-lg sm:text-xl font-semibold">{category} 가격 분포</h2>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>{totalProducts}개 상품</span>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="priceRange" 
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
            <Bar dataKey="count" fill="var(--color-count)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
        
        {/* 가격 통계 */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {totalProducts.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">총 상품수</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-foreground">
              ₩{avgPrice.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">평균 가격</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-foreground">
              ₩{minPrice.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">최저 가격</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-foreground">
              ₩{maxPrice.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">최고 가격</div>
          </div>
        </div>
      </div>
    </div>
  )
}
