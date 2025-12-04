export interface ChatRequest {
  message: string;
}

export interface Evidence {
  snippet: string;
  rating: number;
  source: string;
}

export interface TopReview {
  text: string;
  rating?: number;
}

export interface ProductInfo {
  explanation?: string | null;
  technical_info?: string | null;
  management?: string | null;
}

export interface Recommendation {
  product_id?: string;
  name?: string;
  price?: number;
  rating?: number;
  review_count?: number;
  link?: string;
  product_info?: ProductInfo | null;
  evidence?: { snippet: string }[]; // 백엔드가 제공하면 사용, 없으면 무시
  top_reviews?: TopReview[]; // 일반 추천 시에만
  type?: string; // 세트 추천 시에만
}

export interface ChatMeta {
  latency_ms: number;
  route: string;
  has_more?: boolean;
  exact_match?: boolean;
}

export interface SetInfo {
  level?: string;
  category?: string;
  total_price?: number;
  item_types?: string[];
}

export interface ChatResponse {
  answer: string;
  recommendations?: Recommendation[] | null;
  set_info?: SetInfo | null;
  meta: ChatMeta;
  session_id: string;
}

export class ChatApiClient {
  private baseUrl: string;
  private useProxy: boolean;

  constructor(
    baseUrl: string = "https://decathlon-analytics.onrender.com",
    useProxy: boolean = true,
  ) {
    this.baseUrl = baseUrl;
    this.useProxy = useProxy;
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    // 개발 환경에서는 Next.js API 라우트를 프록시로 사용
    const apiUrl =
      this.useProxy &&
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
        ? "/api/proxy/chatbot/chat"
        : `${this.baseUrl}/chatbot/chat`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // withCredentials: true
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Chat API 요청 실패: ${response.status}`);
    }

    return response.json();
  }
}

export const chatApi = new ChatApiClient();
