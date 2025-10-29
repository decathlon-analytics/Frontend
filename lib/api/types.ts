export interface ProductCard {
  reviewId: string | null;
  productId: string;
  category: string;
  subcategory?: string;
  brand: string | null;
  productName: string;
  price?: number;
  rating: number;
  review_text: string;
  total_reviews: number;
  positive_reviews: number;
  images: string; // 단일 이미지 URL (문자열)
  url: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    generatedAt: string;
    category?: string;
    subcategory?: string;
    range?: string;
  };
}

export interface BestReviewsResponse {
  bestReviews: ProductCard[];
}

export interface TopByReviewCountResponse {
  topByReviewCount: ProductCard[];
}

export interface MonthlyTopOneResponse {
  monthlyTopOne: ProductCard | null;
}

export interface CategoryTopRatedResponse {
  topRated: ProductCard[];
}

export interface SubcategoryTopResponse {
  topBySubcategory: ProductCard[];
}

// 새로운 total API 응답 타입들
export interface PriceBin {
  bin_label: string;
  avg_rating: number;
  avg_total_reviews: number;
  n_products: number;
}

export interface PriceBinsResponse {
  bins: PriceBin[];
}

export interface MonthlyReview {
  month: string;
  count: number;
}

export interface MonthlyReviewsResponse {
  series: MonthlyReview[];
}

export interface PriceHistogramBin {
  bin_label: string;
  count: number;
}

export interface PriceDistribution {
  prices: number[];
  hist: PriceHistogramBin[];
}

export interface PriceDistributionResponse {
  data: PriceDistribution;
  meta: {
    generatedAt: string;
    category: string;
    binSize: number;
  };
}

export interface WordCloudWord {
  text: string;
  count: number;
}

export interface WordCloudData {
  words: WordCloudWord[];
}

export interface WordCloudResponse {
  data: WordCloudData;
  meta: {
    generatedAt: string;
    category: string;
  };
}
