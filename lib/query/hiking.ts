import { hikingApi } from '@/lib/api/hiking'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './keys'

// Hiking API hooks
export function useHikingTopRated(limit: number = 5, minReviews: number = 1) {
  return useQuery({
    queryKey: queryKeys.hiking.topRated(limit, minReviews),
    queryFn: () => hikingApi.getTopRated(limit, minReviews),
    select: (data) => data.data.topRated,
  })
}

export function useHikingTopByReviewCount(limit: number = 5, minReviews: number = 1) {
  return useQuery({
    queryKey: queryKeys.hiking.topByReviewCount(limit, minReviews),
    queryFn: () => hikingApi.getTopByReviewCount(limit, minReviews),
    select: (data) => data.data.topByReviewCount,
  })
}

export function useHikingTopBySubcategory(subcategory: string, limit: number = 5, minReviews: number = 1) {
  return useQuery({
    queryKey: queryKeys.hiking.topBySubcategory(subcategory, limit, minReviews),
    queryFn: () => hikingApi.getTopBySubcategory(subcategory, limit, minReviews),
    select: (data) => data.data.topBySubcategory,
    enabled: !!subcategory, // Only run query if subcategory is provided
  })
}

export function useHikingPriceDistribution(binSize: number = 20000) {
  return useQuery({
    queryKey: queryKeys.hiking.priceDistribution(binSize),
    queryFn: () => hikingApi.getPriceDistribution(binSize),
    select: (data) => data.data,
  })
}

export function useHikingWordCloud(topN: number = 100) {
  return useQuery({
    queryKey: queryKeys.hiking.wordCloud(topN),
    queryFn: () => hikingApi.getWordCloud(topN),
    select: (data) => data.data,
  })
}
