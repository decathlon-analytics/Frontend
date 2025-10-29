"use client"

import { MonthlyReviewsChart } from "@/components/charts/monthly-reviews-chart"
import { PriceBinsChart } from "@/components/charts/price-bins-chart"
import { ProductCard } from "@/lib/api/types"
import {
  useTotalBestReviews,
  useTotalMonthlyReviews,
  useTotalMonthlyTopOne,
  useTotalPriceBins,
  useTotalTopByReviewCount
} from "@/lib/query"
import { Award, Star, Tag, TrendingUp } from "lucide-react"

export default function HomePage() {
  // TanStack Query hooks
  const monthlyTopOneQuery = useTotalMonthlyTopOne()
  const bestReviewsQuery = useTotalBestReviews()
  const topByReviewCountQuery = useTotalTopByReviewCount()
  const priceBinsQuery = useTotalPriceBins()
  const monthlyReviewsQuery = useTotalMonthlyReviews()

  // Loading state - any query is loading
  const isLoading = monthlyTopOneQuery.isLoading || bestReviewsQuery.isLoading || 
    topByReviewCountQuery.isLoading || priceBinsQuery.isLoading || monthlyReviewsQuery.isLoading
  
  // Error state - any query has error
  const error = monthlyTopOneQuery.error || bestReviewsQuery.error || 
    topByReviewCountQuery.error || priceBinsQuery.error || monthlyReviewsQuery.error
  
  const handleRetry = () => {
    monthlyTopOneQuery.refetch()
    bestReviewsQuery.refetch()
    topByReviewCountQuery.refetch()
    priceBinsQuery.refetch()
    monthlyReviewsQuery.refetch()
  }

  const ProductItem = ({ product, index }: { product: ProductCard; index: number }) => (
      <div className="flex items-center p-3 space-x-2 transition-shadow border rounded-lg sm:p-4 sm:space-x-4 bg-card border-border hover:shadow-md">
      <div className="flex-shrink-0 w-4 text-xs font-semibold sm:w-6 sm:text-sm text-muted-foreground">
        #{index + 1}
      </div>
      {product.images && (
        <img 
          src={product.images} 
          alt={product.productName}
          className="flex-shrink-0 object-cover w-8 h-8 rounded-md sm:w-12 sm:h-12"
        />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate text-foreground sm:text-base">{product.productName}</h3>
        <div className="flex items-center space-x-1 text-xs sm:space-x-2 sm:text-sm text-muted-foreground">
          <span className="truncate max-w-[80px] sm:max-w-none">{product.brand || '브랜드 없음'}</span>
          {product.subcategory && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="items-center hidden sm:inline-flex">
                <Tag className="w-3 h-3 mr-1" />
                {product.subcategory}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end flex-shrink-0 space-y-1">
        {product.price && (
          <span className="text-xs font-semibold text-blue-600 sm:text-sm">
            ₩{product.price.toLocaleString()}
          </span>
        )}
        <div className="flex items-center space-x-1">
          <Star className="w-3 h-3 text-yellow-400 sm:w-4 sm:h-4 fill-yellow-400" />
          <span className="text-xs font-medium sm:text-sm">{product.rating}</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">({product.total_reviews})</span>
        </div>
      </div>
    </div>
  )

  const MonthlyTopOne = ({ product }: { product: ProductCard | null }) => {
    if (!product) return null
    
    return (
      <div className="p-4 mb-6 text-white sm:p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
        <div className="flex items-center mb-4 space-x-2">
          <Award className="w-5 h-5 text-yellow-300 sm:w-6 sm:h-6" />
          <h2 className="text-lg font-bold sm:text-xl">이달의 TOP 제품</h2>
        </div>
        <div className="flex flex-col items-start space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          {product.images && (
            <img 
              src={product.images} 
              alt={product.productName}
              className="flex-shrink-0 object-cover w-16 h-16 rounded-lg sm:w-20 sm:h-20"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 text-base font-semibold truncate sm:text-lg">{product.productName}</h3>
            <p className="mb-2 text-sm text-blue-100 truncate sm:text-base">{product.brand || '브랜드 없음'}</p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              {product.price && (
                <span className="text-base font-bold text-yellow-300 sm:text-lg">
                  ₩{product.price.toLocaleString()}
                </span>
              )}
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-300 sm:w-5 sm:h-5 fill-yellow-300" />
                <span className="text-sm font-medium sm:text-base">{product.rating}</span>
                <span className="text-xs text-blue-200 sm:text-sm">({product.total_reviews} 리뷰)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        <MonthlyTopOne product={monthlyTopOneQuery.data ?? null} />
        
        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-2">
          <PriceBinsChart 
            data={priceBinsQuery.data ?? []} 
            isLoading={priceBinsQuery.isLoading}
          />
          <MonthlyReviewsChart 
            data={monthlyReviewsQuery.data ?? []} 
            isLoading={monthlyReviewsQuery.isLoading}
          />
        </div>
        
        {/* 제품 리스트 섹션 */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-2">
          <div className="border shadow-sm bg-card border-border rounded-xl">
            <div className="p-4 border-b sm:p-6">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500 sm:w-5 sm:h-5" />
                <h2 className="text-lg font-semibold sm:text-xl">베스트 리뷰 제품</h2>
              </div>
            </div>
            <div className="p-4 space-y-3 sm:p-6 sm:space-y-4">
              {(bestReviewsQuery.data ?? []).slice(0, 5).map((product: ProductCard, index: number) => (
                <ProductItem key={product.productId} product={product} index={index} />
              ))}
            </div>
          </div>

          <div className="border shadow-sm bg-card border-border rounded-xl">
            <div className="p-4 border-b sm:p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500 sm:w-5 sm:h-5" />
                <h2 className="text-lg font-semibold sm:text-xl">리뷰 수 TOP</h2>
              </div>
            </div>
            <div className="p-4 space-y-3 sm:p-6 sm:space-y-4">
              {(topByReviewCountQuery.data ?? []).slice(0, 5).map((product: ProductCard, index: number) => (
                <ProductItem key={product.productId} product={product} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="mb-4 text-lg text-red-600">{error.message}</p>
          <button 
            onClick={handleRetry} 
            className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-6 mx-auto sm:py-8">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl text-foreground">스포츠 용품 대시보드</h1>
          <p className="text-sm sm:text-base text-muted-foreground">전체 카테고리 통합 데이터</p>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  )
}
