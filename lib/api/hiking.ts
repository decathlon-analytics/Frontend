import { BaseApiClient } from './base'
import {
  ApiResponse,
  CategoryTopRatedResponse,
  PriceDistributionResponse,
  SubcategoryTopResponse,
  TopByReviewCountResponse,
  WordCloudResponse
} from './types'

export class HikingApiClient extends BaseApiClient {
  constructor() {
    super() // 기본 생성자로 프록시 활성화
  }

  async getTopRated(limit: number = 5, minReviews: number = 1): Promise<ApiResponse<CategoryTopRatedResponse>> {
    return this.fetchApi<CategoryTopRatedResponse>(`/hiking/top-rated?limit=${limit}&min_reviews=${minReviews}`)
  }

  async getTopByReviewCount(limit: number = 5, minReviews: number = 1): Promise<ApiResponse<TopByReviewCountResponse>> {
    return this.fetchApi<TopByReviewCountResponse>(`/hiking/top-by-reviewcount?limit=${limit}&min_reviews=${minReviews}`)
  }

  async getTopBySubcategory(subcategory: string, limit: number = 5, minReviews: number = 1): Promise<ApiResponse<SubcategoryTopResponse>> {
    return this.fetchApi<SubcategoryTopResponse>(`/hiking/top-by-subcategory?subcategory=${encodeURIComponent(subcategory)}&limit=${limit}&min_reviews=${minReviews}`)
  }

  async getPriceDistribution(binSize: number = 20000): Promise<PriceDistributionResponse> {
    // 프록시를 통해 호출
    const apiUrl = this.useProxy 
      ? `/api/proxy/hiking/price-distribution?bin_size=${binSize}`
      : `${this.baseUrl}/hiking/price-distribution?bin_size=${binSize}`
      
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)
    
    try {
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        credentials: 'include'
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('가격 분포 생성 시간 초과 (30초)')
      }
      throw error
    }
  }

  async getWordCloud(topN: number = 100): Promise<WordCloudResponse> {
    // 프록시를 통해 호출
    const apiUrl = this.useProxy 
      ? `/api/proxy/hiking/wordcloud?top_n=${topN}`
      : `${this.baseUrl}/hiking/wordcloud?top_n=${topN}`
      
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)
    
    try {
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        credentials: 'include'
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('워드클라우드 생성 시간 초과 (30초)')
      }
      throw error
    }
  }
}

export const hikingApi = new HikingApiClient()
