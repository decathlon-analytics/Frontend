"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { chatApi, ChatResponse, Recommendation } from "@/lib/api/chat"
import { Bot, ExternalLink, Send, Star, Trash2, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  recommendations?: Recommendation[]
  sessionId?: string
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: '안녕하세요! 데카트론 제품 분석 챗봇입니다. 궁금한 것이 있으시면 언제든 물어보세요! 🛒',
    timestamp: new Date()
  }
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 세션 스토리지에서 메시지 불러오기
  useEffect(() => {
    const loadMessages = () => {
      try {
        const saved = sessionStorage.getItem('chatbot-messages')
        if (saved) {
          const parsedMessages = JSON.parse(saved).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(parsedMessages)
        } else {
          // 세션에 메시지가 없으면 초기 메시지 설정
          setMessages(initialMessages)
        }
      } catch (error) {
        console.error('메시지 로드 실패:', error)
        setMessages(initialMessages)
      }
    }

    loadMessages()
  }, [])

  // 메시지가 변경될 때마다 세션 스토리지에 저장
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem('chatbot-messages', JSON.stringify(messages))
      } catch (error) {
        console.error('메시지 저장 실패:', error)
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response: ChatResponse = await chatApi.sendMessage(userMessage.content)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        recommendations: response.recommendations,
        sessionId: response.session_id
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('채팅 오류:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const clearChatHistory = () => {
    setMessages(initialMessages)
    sessionStorage.removeItem('chatbot-messages')
  }

  const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => (
    <div className="p-3 mt-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {recommendation.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              ₩{recommendation.price.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-muted-foreground">{recommendation.rating}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {(recommendation.score * 100).toFixed(1)}% 매치
            </Badge>
          </div>
          {recommendation.evidence.length > 0 && (
            <div className="mt-2">
              <p className="text-xs italic text-muted-foreground">
                "{recommendation.evidence[0].snippet}"
              </p>
            </div>
          )}
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => window.open(recommendation.link, '_blank')}
          className="flex-shrink-0 ml-2"
        >
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container flex flex-col h-screen max-w-4xl px-4 py-6 mx-auto">
        {/* Header */}
        <div className="flex-shrink-0 mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl text-foreground">AI 챗봇</h1>
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
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[80%] ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`inline-block p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <div className="text-sm">
                          <ReactMarkdown
                            rehypePlugins={[
                              [rehypeExternalLinks, { target: '_blank', rel: 'noopener noreferrer' }]
                            ]}
                            components={{
                              p: ({ children }) => <p className="mb-2 whitespace-pre-wrap last:mb-0">{children}</p>,
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
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        {message.recommendations && message.recommendations.length > 0 && (
                          <div className="mt-3">
                            <p className="mb-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                              추천 상품:
                            </p>
                            {message.recommendations.map((rec, index) => (
                              <RecommendationCard key={index} recommendation={rec} />
                            ))}
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
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
                💡 실제 데카트론 데이터를 기반으로 AI가 응답합니다. 제품 추천도 받아보세요!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
