import { ProductCard } from "@/lib/api"
import { Tag } from "lucide-react"
import { ProductItem } from "./product-item"

interface SubcategorySectionProps {
  subcategoryData: {[key: string]: ProductCard[]}
}

export function SubcategorySection({ subcategoryData }: SubcategorySectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">카테고리별 인기 제품</h2>
      {Object.entries(subcategoryData).map(([subcategory, products]) => (
        <div key={subcategory} className="bg-card border border-border shadow-sm rounded-xl">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl font-semibold">{subcategory}</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {products.map((product, index) => (
                <ProductItem key={product.productId} product={product} index={index} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
