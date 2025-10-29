"use client"

import { PriceDistributionChart } from "@/components/charts/price-distribution-chart"
import { WordCloudChart } from "@/components/charts/wordcloud-chart"
import { ErrorDisplay } from "@/components/hiking/error-display"
import { LoadingSpinner } from "@/components/hiking/loading-spinner"
import { SubcategorySection } from "@/components/hiking/subcategory-section"
import { TopProductsSection } from "@/components/hiking/top-products-section"
import { ProductCard } from "@/lib/api/types"
import { useHikingPriceDistribution, useHikingTopByReviewCount, useHikingTopBySubcategory, useHikingTopRated, useHikingWordCloud } from "@/lib/query"

const SUBCATEGORIES = ['의류', '가방', '용품'] as const
const SUBCATEGORY_LIMIT = 3

export default function HikingPage() {
  // TanStack Query hooks
  const topRatedQuery = useHikingTopRated()
  const topByReviewCountQuery = useHikingTopByReviewCount()
  const priceDistributionQuery = useHikingPriceDistribution()
  const wordCloudQuery = useHikingWordCloud()
  
  // Subcategory queries
  const subcategoryQueries = SUBCATEGORIES.map(subcategory => 
    useHikingTopBySubcategory(subcategory, SUBCATEGORY_LIMIT)
  )

  // Loading state - 개별 로딩 상태 관리
  const isInitialLoading = (topRatedQuery.isLoading && !topRatedQuery.data) || 
    (topByReviewCountQuery.isLoading && !topByReviewCountQuery.data)
  
  // Error state - any query has error
  const error = topRatedQuery.error || topByReviewCountQuery.error || 
    priceDistributionQuery.error || wordCloudQuery.error || subcategoryQueries.find(query => query.error)?.error
  
  const handleRetry = () => {
    topRatedQuery.refetch()
    topByReviewCountQuery.refetch()
    subcategoryQueries.forEach(query => query.refetch())
  }

  // Process subcategory data
  const subcategoryData = SUBCATEGORIES.reduce((acc, subcategory, index) => {
    acc[subcategory] = subcategoryQueries[index]?.data || []
    return acc
  }, {} as {[key: string]: ProductCard[]})

  if (isInitialLoading) {
    return <LoadingSpinner message="등산 데이터를 불러오는 중..." />
  }

  if (error) {
    return <ErrorDisplay error={error.message} onRetry={handleRetry} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-6 sm:py-8 mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">등산 용품 대시보드</h1>
          <p className="text-sm sm:text-base text-muted-foreground">등산 관련 제품 데이터</p>
        </div>

        {/* Content */}
        <div className="space-y-6 sm:space-y-8">
          <TopProductsSection 
            topRated={topRatedQuery.data ?? []} 
            topByReviewCount={topByReviewCountQuery.data ?? []} 
          />
          
          {/* Price Distribution Chart */}
          <PriceDistributionChart 
            data={priceDistributionQuery.data}
            isLoading={priceDistributionQuery.isLoading}
            category="등산"
          />
          
          {/* Word Cloud Chart */}
          <WordCloudChart 
            data={wordCloudQuery.data}
            isLoading={wordCloudQuery.isLoading}
            category="등산"
          />
          
          <SubcategorySection subcategoryData={subcategoryData} />
        </div>
      </div>
    </div>
  )
}
