// Query key factory - consistent key generation
export const queryKeys = {
  total: {
    all: ['total'] as const,
    bestReviews: (limit?: number, minReviews?: number) => 
      [...queryKeys.total.all, 'bestReviews', { limit, minReviews }] as const,
    topByReviewCount: (limit?: number, minReviews?: number) => 
      [...queryKeys.total.all, 'topByReviewCount', { limit, minReviews }] as const,
    monthlyTopOne: () => 
      [...queryKeys.total.all, 'monthlyTopOne'] as const,
    priceBins: (binSize?: number) => 
      [...queryKeys.total.all, 'priceBins', { binSize }] as const,
    monthlyReviews: () => 
      [...queryKeys.total.all, 'monthlyReviews'] as const,
  },
  
  running: {
    all: ['running'] as const,
    topRated: (limit?: number, minReviews?: number) => 
      [...queryKeys.running.all, 'topRated', { limit, minReviews }] as const,
    topByReviewCount: (limit?: number, minReviews?: number) => 
      [...queryKeys.running.all, 'topByReviewCount', { limit, minReviews }] as const,
    topBySubcategory: (subcategory: string, limit?: number, minReviews?: number) => 
      [...queryKeys.running.all, 'topBySubcategory', { subcategory, limit, minReviews }] as const,
    priceDistribution: (binSize?: number) => 
      [...queryKeys.running.all, 'priceDistribution', { binSize }] as const,
    wordCloud: (topN?: number) => 
      [...queryKeys.running.all, 'wordCloud', { topN }] as const,
  },
  
  hiking: {
    all: ['hiking'] as const,
    topRated: (limit?: number, minReviews?: number) => 
      [...queryKeys.hiking.all, 'topRated', { limit, minReviews }] as const,
    topByReviewCount: (limit?: number, minReviews?: number) => 
      [...queryKeys.hiking.all, 'topByReviewCount', { limit, minReviews }] as const,
    topBySubcategory: (subcategory: string, limit?: number, minReviews?: number) => 
      [...queryKeys.hiking.all, 'topBySubcategory', { subcategory, limit, minReviews }] as const,
    priceDistribution: (binSize?: number) => 
      [...queryKeys.hiking.all, 'priceDistribution', { binSize }] as const,
    wordCloud: (topN?: number) => 
      [...queryKeys.hiking.all, 'wordCloud', { topN }] as const,
  },
} as const
