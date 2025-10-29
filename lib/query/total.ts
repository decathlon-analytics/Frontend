import { totalApi } from '@/lib/api/total'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './keys'

// Total API hooks
export function useTotalBestReviews(limit: number = 5, minReviews: number = 1) {
  return useQuery({
    queryKey: queryKeys.total.bestReviews(limit, minReviews),
    queryFn: () => totalApi.getBestReviews(limit, minReviews),
    select: (data) => data.data.bestReviews,
  })
}

export function useTotalTopByReviewCount(limit: number = 5, minReviews: number = 1) {
  return useQuery({
    queryKey: queryKeys.total.topByReviewCount(limit, minReviews),
    queryFn: () => totalApi.getTopByReviewCount(limit, minReviews),
    select: (data) => data.data.topByReviewCount,
  })
}

export function useTotalMonthlyTopOne() {
  return useQuery({
    queryKey: queryKeys.total.monthlyTopOne(),
    queryFn: () => totalApi.getMonthlyTopOne(),
    select: (data) => data.data.monthlyTopOne,
  })
}

export function useTotalPriceBins(binSize: number = 20000) {
  return useQuery({
    queryKey: queryKeys.total.priceBins(binSize),
    queryFn: () => totalApi.getPriceBins(binSize),
    select: (data) => data.data.bins,
  })
}

export function useTotalMonthlyReviews() {
  return useQuery({
    queryKey: queryKeys.total.monthlyReviews(),
    queryFn: () => totalApi.getMonthlyReviews(),
    select: (data) => data.data.series,
  })
}
