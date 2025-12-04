"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatApi, ChatResponse, Recommendation } from "@/lib/api/chat";
import { Bot, ExternalLink, Send, Star, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  recommendations?: Recommendation[] | null;
  sessionId?: string;
  meta?: {
    latency_ms: number;
    route: string;
    has_more?: boolean;
    exact_match?: boolean;
  };
  set_info?: {
    level?: string;
    category?: string;
    total_price?: number;
    item_types?: string[];
  } | null;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "안녕하세요! 데카트론 제품 분석 챗봇입니다. 궁금한 것이 있으시면 언제든 물어보세요! 🛒",
    timestamp: new Date(),
  },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const MAX_MESSAGES = 80;

  // 세션 스토리지에서 메시지 불러오기
  useEffect(() => {
    const loadMessages = () => {
      try {
        const saved = sessionStorage.getItem("chatbot-messages");
        if (saved) {
          const parsedMessages = JSON.parse(saved).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          // 최신 MAX_MESSAGES 까지만 복원
          setMessages(parsedMessages.slice(-MAX_MESSAGES));
        } else {
          setMessages(initialMessages);
        }
      } catch (error) {
        console.error("메시지 로드 실패:", error);
        setMessages(initialMessages);
      }
    };

    loadMessages();
  }, []);

  // 메시지가 변경될 때마다 세션 스토리지에 저장 (크기 제한 적용)
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const toSave = messages.slice(-MAX_MESSAGES);
        sessionStorage.setItem("chatbot-messages", JSON.stringify(toSave));
      } catch (error) {
        console.error("메시지 저장 실패:", error);
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const newMsgs = [...prev, userMessage].slice(-MAX_MESSAGES);
      return newMsgs;
    });
    setInputValue("");
    setIsLoading(true);

    try {
      const response: ChatResponse = await chatApi.sendMessage(
        userMessage.content,
      );

      // recommendations가 null/undefined일 수 있음 → 빈 배열로 정규화
      const recs = Array.isArray(response.recommendations)
        ? response.recommendations
        : [];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer ?? "응답이 없습니다.",
        timestamp: new Date(),
        recommendations: recs,
        sessionId: response.session_id,
        meta: response.meta,
        set_info: response.set_info ?? null,
      };

      setMessages((prev) => {
        const newMsgs = [...prev, assistantMessage].slice(-MAX_MESSAGES);
        return newMsgs;
      });
    } catch (error) {
      console.error("채팅 오류:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage].slice(-MAX_MESSAGES));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearChatHistory = () => {
    setMessages(initialMessages);
    sessionStorage.removeItem("chatbot-messages");
  };

  const RecommendationCard = ({
    recommendation,
  }: {
    recommendation: Recommendation;
  }) => {
    const name = recommendation?.name ?? "제품명 없음";
    const priceNum = Number(recommendation?.price ?? NaN);
    const priceDisplay = Number.isFinite(priceNum)
      ? `₩${priceNum.toLocaleString()}`
      : "-";
    const rating =
      recommendation && recommendation.rating != null
        ? recommendation.rating
        : "-";
    const reviewCount =
      recommendation && recommendation.review_count != null
        ? recommendation.review_count
        : null;
    const evidenceSnippet =
      Array.isArray(recommendation?.evidence) &&
      recommendation!.evidence.length > 0
        ? recommendation!.evidence[0].snippet
        : null;
    const link = recommendation?.link ?? undefined;
    const type = recommendation?.type; // 세트 추천 시에만 존재
    const topReviews = Array.isArray(recommendation?.top_reviews)
      ? recommendation!.top_reviews
      : [];

    return (
      <div className="p-3 mt-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {name}
              </h4>
              {type && (
                <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                  {type}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {priceDisplay}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-muted-foreground">
                  {rating}
                  {reviewCount != null ? ` / 리뷰 ${reviewCount}개` : ""}
                </span>
              </div>
            </div>
            {evidenceSnippet && (
              <div className="mt-2">
                <p className="text-xs italic text-muted-foreground">
                  "{evidenceSnippet}"
                </p>
              </div>
            )}
            {/* product_info는 일부 필드가 null일 수 있음 */}
            {recommendation?.product_info && (
              <div className="mt-2 space-y-1">
                {recommendation.product_info.explanation && (
                  <p className="text-xs text-muted-foreground">
                    설명: {recommendation.product_info.explanation}
                  </p>
                )}
                {recommendation.product_info.technical_info && (
                  <p className="text-xs text-muted-foreground">
                    기술정보: {recommendation.product_info.technical_info}
                  </p>
                )}
                {recommendation.product_info.management && (
                  <p className="text-xs text-muted-foreground">
                    관리: {recommendation.product_info.management}
                  </p>
                )}
              </div>
            )}
            {/* top_reviews (일반 추천 시에만) */}
            {topReviews.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  상위 리뷰
                </p>
                <ul className="mt-1 space-y-1">
                  {topReviews.slice(0, 2).map((rv, i) => (
                    <li key={i} className="text-xs text-muted-foreground">
                      “{rv.text}” {rv.rating != null ? `(${rv.rating}/5)` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => (link ? window.open(link, "_blank") : undefined)}
            className="flex-shrink-0 ml-2"
            disabled={!link}
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container flex flex-col h-screen max-w-4xl px-4 py-6 mx-auto">
        {/* Header */}
        <div className="flex-shrink-0 mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl text-foreground">
            AI 챗봇
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            데카트론 제품에 대해 궁금한 것이 있으시면 언제든 물어보세요
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="flex flex-col flex-1 min-h-0">
          <CardHeader className="flex-shrink-0 border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-500" />
              데카트론 분석 챗봇
              <div className="flex items-center gap-2 ml-auto">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title="대화 기록 지우기"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>대화 기록 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        모든 대화 내용을 삭제하시겠습니까?
                        <br />
                        <strong>이 작업은 되돌릴 수 없습니다.</strong>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={clearChatHistory}>
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col flex-1 min-h-0 p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollAreaRef}>
              <div className="pb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`flex-1 max-w-[80%] ${
                        message.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="text-sm">
                          <ReactMarkdown
                            rehypePlugins={[
                              [
                                rehypeExternalLinks,
                                {
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                },
                              ],
                            ]}
                            components={{
                              p: ({ children }) => (
                                <p className="mb-2 whitespace-pre-wrap last:mb-0">
                                  {children}
                                </p>
                              ),
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-blue-600 underline dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                  {children}
                                </a>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic">{children}</em>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        {message.recommendations &&
                          message.recommendations.length > 0 && (
                            <div className="mt-3">
                              <p className="mb-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                                추천 상품:
                              </p>
                              {message.recommendations.map((rec, index) => (
                                <RecommendationCard
                                  key={index}
                                  recommendation={rec}
                                />
                              ))}
                            </div>
                          )}
                        {/* 세트 정보 표시 */}
                        {message.set_info && (
                          <div className="mt-3">
                            <div className="p-2 border border-blue-200 rounded bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                              <p className="text-xs font-medium text-blue-700 dark:text-blue-200">
                                세트 정보
                              </p>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {message.set_info.level && (
                                  <span>레벨: {message.set_info.level} </span>
                                )}
                                {message.set_info.category && (
                                  <span>
                                    카테고리: {message.set_info.category}{" "}
                                  </span>
                                )}
                                {typeof message.set_info.total_price ===
                                  "number" && (
                                  <span>
                                    총 가격: ₩
                                    {message.set_info.total_price.toLocaleString()}{" "}
                                  </span>
                                )}
                                {Array.isArray(message.set_info.item_types) &&
                                  message.set_info.item_types.length > 0 && (
                                    <span>
                                      구성:{" "}
                                      {message.set_info.item_types.join(", ")}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-600 bg-blue-100 rounded-full">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="메시지를 입력하세요..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                💡 실제 데카트론 데이터를 기반으로 AI가 응답합니다. 제품 추천도
                받아보세요!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
