import { runningApi } from '@/lib/api/running'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './keys'

// Running API hooks
export function useRunningTopRated(limit: number = 5, minReviews: number = 1) {
  return useQuery({
    queryKey: queryKeys.running.topRated(limit, minReviews),
    queryFn: () => runningApi.getTopRated(limit, minReviews),
    select: (data) => data.data.topRated,
  })
}

export function useRunningTopByReviewCount(limit: number = 5, minReviews: number = 1) {
  return useQuery({
    queryKey: queryKeys.running.topByReviewCount(limit, minReviews),
    queryFn: () => runningApi.getTopByReviewCount(limit, minReviews),
    select: (data) => data.data.topByReviewCount,
  })
}

export function useRunningTopBySubcategory(subcategory: string, limit: number = 5, minReviews: number = 1) {
  return useQuery({
    queryKey: queryKeys.running.topBySubcategory(subcategory, limit, minReviews),
    queryFn: () => runningApi.getTopBySubcategory(subcategory, limit, minReviews),
    select: (data) => data.data.topBySubcategory,
    enabled: !!subcategory, // Only run query if subcategory is provided
  })
}

export function useRunningPriceDistribution(binSize: number = 20000) {
  return useQuery({
    queryKey: queryKeys.running.priceDistribution(binSize),
    queryFn: () => runningApi.getPriceDistribution(binSize),
    select: (data) => data.data,
  })
}

export function useRunningWordCloud(topN: number = 100) {
  return useQuery({
    queryKey: queryKeys.running.wordCloud(topN),
    queryFn: () => runningApi.getWordCloud(topN),
    select: (data) => data.data,
  })
}
