// Re-export types
export * from './types'

// Re-export API clients
export { hikingApi } from './hiking'
export { runningApi } from './running'
export { totalApi } from './total'

// Legacy compatibility - 기존 apiClient와 호환성을 위한 통합 클래스
import { BaseApiClient } from './base'
import { hikingApi } from './hiking'
import { runningApi } from './running'
import { totalApi } from './total'

export class LegacyApiClient extends BaseApiClient {
  // Total APIs
  getTotalBestReviews = totalApi.getBestReviews.bind(totalApi)
  getTotalTopByReviewCount = totalApi.getTopByReviewCount.bind(totalApi)
  getTotalMonthlyTopOne = totalApi.getMonthlyTopOne.bind(totalApi)

  // Running APIs
  getRunningTopRated = runningApi.getTopRated.bind(runningApi)
  getRunningTopByReviewCount = runningApi.getTopByReviewCount.bind(runningApi)
  getRunningTopBySubcategory = runningApi.getTopBySubcategory.bind(runningApi)

  // Hiking APIs
  getHikingTopRated = hikingApi.getTopRated.bind(hikingApi)
  getHikingTopByReviewCount = hikingApi.getTopByReviewCount.bind(hikingApi)
  getHikingTopBySubcategory = hikingApi.getTopBySubcategory.bind(hikingApi)

  // Health check
  async healthCheck(): Promise<any> {
    return this.fetchApi('/')
  }
}

// 기존 코드와의 호환성을 위해 유지
export const apiClient = new LegacyApiClient()
