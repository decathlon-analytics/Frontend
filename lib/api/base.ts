import { ApiResponse } from './types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://decathlon-analytics.onrender.com'

export abstract class BaseApiClient {
  protected baseUrl: string
  protected useProxy: boolean

  constructor(baseUrl: string = BASE_URL, useProxy: boolean = true) {
    this.baseUrl = baseUrl
    // 개발 환경에서만 프록시 사용
    this.useProxy = useProxy && typeof window !== 'undefined' && window.location.hostname === 'localhost'
  }

  protected async fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30초 타임아웃
      
      // 프록시 사용 여부에 따라 URL 결정
      const apiUrl = this.useProxy 
        ? `/api/proxy${endpoint}`
        : `${this.baseUrl}${endpoint}`
      
      console.log(`📡 API Call: ${apiUrl}`)
      
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        credentials: 'include', // 쿠키 포함
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`API 요청 타임아웃 (${endpoint}): 30초 초과`)
        throw new Error(`요청 시간 초과: ${endpoint}`)
      }
      console.error(`API 요청 오류 (${endpoint}):`, error)
      throw error
    }
  }
}
