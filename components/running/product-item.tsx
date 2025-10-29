import { ProductCard } from "@/lib/api"
import { Star, Tag } from "lucide-react"

interface ProductItemProps {
  product: ProductCard
  index: number
}

export function ProductItem({ product, index }: ProductItemProps) {
  return (
    <div className="flex items-center p-3 sm:p-4 space-x-2 sm:space-x-4 transition-shadow bg-card border border-border rounded-lg hover:shadow-md">
      <div className="w-4 sm:w-6 text-xs sm:text-sm font-semibold text-muted-foreground flex-shrink-0">
        #{index + 1}
      </div>
      {product.images && (
        <img 
          src={product.images} 
          alt={product.productName}
          className="object-cover w-8 h-8 sm:w-12 sm:h-12 rounded-md flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate text-sm sm:text-base">{product.productName}</h3>
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground">
          <span className="truncate max-w-[80px] sm:max-w-none">{product.brand || '브랜드 없음'}</span>
          {product.subcategory && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline-flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                {product.subcategory}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end space-y-1 flex-shrink-0">
        {product.price && (
          <span className="text-xs sm:text-sm font-semibold text-blue-600">
            ₩{product.price.toLocaleString()}
          </span>
        )}
        <div className="flex items-center space-x-1">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-xs sm:text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">({product.total_reviews})</span>
        </div>
      </div>
    </div>
  )
}
