import { BaseApiClient } from './base'
import {
  ApiResponse,
  BestReviewsResponse,
  MonthlyReviewsResponse,
  MonthlyTopOneResponse,
  PriceBinsResponse,
  TopByReviewCountResponse
} from './types'

export class TotalApiClient extends BaseApiClient {
  constructor() {
    super() // 기본 생성자로 프록시 활성화
  }

  async getBestReviews(limit: number = 5, minReviews: number = 1): Promise<ApiResponse<BestReviewsResponse>> {
    return this.fetchApi<BestReviewsResponse>(`/total/best-review?limit=${limit}&min_reviews=${minReviews}`)
  }

  async getTopByReviewCount(limit: number = 5, minReviews: number = 1): Promise<ApiResponse<TopByReviewCountResponse>> {
    return this.fetchApi<TopByReviewCountResponse>(`/total/top-by-reviewcount?limit=${limit}&min_reviews=${minReviews}`)
  }

  async getMonthlyTopOne(): Promise<ApiResponse<MonthlyTopOneResponse>> {
    return this.fetchApi<MonthlyTopOneResponse>('/total/top-this-month-one')
  }

  async getPriceBins(binSize: number = 20000): Promise<ApiResponse<PriceBinsResponse>> {
    return this.fetchApi<PriceBinsResponse>(`/total/price-bins?bin_size=${binSize}`)
  }

  async getMonthlyReviews(): Promise<ApiResponse<MonthlyReviewsResponse>> {
    return this.fetchApi<MonthlyReviewsResponse>('/total/monthly-reviews')
  }
}

export const totalApi = new TotalApiClient()
