export interface ChatRequest {
  message: string
}

export interface Evidence {
  snippet: string
  rating: number
  source: string
}

export interface Recommendation {
  product_id: string
  name: string
  price: number
  link: string
  score: number
  rating: number
  evidence: Evidence[]
}

export interface ChatResponse {
  answer: string
  recommendations: Recommendation[]
  used_contexts: any
  session_id: string
  meta: {
    latency_ms: number
    route: string
    env: string
  }
}

export class ChatApiClient {
  private baseUrl: string
  private useProxy: boolean

  constructor(baseUrl: string = 'https://decathlon-analytics.onrender.com', useProxy: boolean = true) {
    this.baseUrl = baseUrl
    this.useProxy = useProxy
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    // 개발 환경에서는 Next.js API 라우트를 프록시로 사용
    const apiUrl = this.useProxy && typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? '/api/proxy/chatbot/chat'
      : `${this.baseUrl}/chatbot/chat`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // withCredentials: true
      body: JSON.stringify({ message })
    })

    if (!response.ok) {
      throw new Error(`Chat API 요청 실패: ${response.status}`)
    }

    return response.json()
  }
}

export const chatApi = new ChatApiClient()
