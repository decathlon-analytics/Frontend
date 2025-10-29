import { ProductCard } from "@/lib/api"
import { Star, TrendingUp } from "lucide-react"
import { ProductItem } from "./product-item"

interface TopProductsSectionProps {
  topRated: ProductCard[]
  topByReviewCount: ProductCard[]
}

const DISPLAY_COUNT = 5

export function TopProductsSection({ topRated, topByReviewCount }: TopProductsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-2">
      <div className="bg-card border border-border shadow-sm rounded-xl">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <h2 className="text-lg sm:text-xl font-semibold">평점 높은 제품</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {topRated.slice(0, DISPLAY_COUNT).map((product, index) => (
            <ProductItem key={product.productId} product={product} index={index} />
          ))}
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <h2 className="text-lg sm:text-xl font-semibold">리뷰 수 TOP</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {topByReviewCount.slice(0, DISPLAY_COUNT).map((product, index) => (
            <ProductItem key={product.productId} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
