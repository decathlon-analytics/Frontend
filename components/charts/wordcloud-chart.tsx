"use client"

import { WordCloudData } from "@/lib/api/types";
import { Cloud } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

// ZingChart 타입 선언
declare global {
  interface Window {
    zingchart: any;
  }
}

interface WordCloudChartProps {
  data: WordCloudData | undefined
  isLoading?: boolean
  category: string
}

export function WordCloudChart({ data, isLoading, category }: WordCloudChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartId = useRef(`wordcloud-${Math.random().toString(36).substr(2, 9)}`)
  const [chartReady, setChartReady] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const { theme, resolvedTheme } = useTheme()

  // 테마에 따른 색상 팔레트 정의
  const getThemeColors = () => {
    const isDark = resolvedTheme === 'dark'
    
    if (isDark) {
      return {
        palette: [
          '#60A5FA', // blue-400
          '#34D399', // emerald-400  
          '#FBBF24', // amber-400
          '#A78BFA', // violet-400
          '#FB7185', // rose-400
          '#10B981', // emerald-500
          '#3B82F6', // blue-500
          '#8B5CF6', // violet-500
          '#EF4444', // red-500
          '#F59E0B'  // amber-500
        ],
        hoverColor: '#F8FAFC', // slate-50
        textColor: '#1E293B',  // slate-800
        tooltipBg: '#1F2937',  // gray-800
        tooltipText: '#F9FAFB', // gray-50
        tooltipBorder: '#374151' // gray-700
      }
    } else {
      return {
        palette: [
          '#1E40AF', // blue-800
          '#059669', // emerald-600
          '#D97706', // amber-600
          '#7C3AED', // violet-600
          '#DC2626', // red-600
          '#0D9488', // teal-600
          '#2563EB', // blue-600
          '#9333EA', // purple-600
          '#EA580C', // orange-600
          '#CA8A04'  // yellow-600
        ],
        hoverColor: '#1E293B', // slate-800
        textColor: '#F8FAFC',  // slate-50
        tooltipBg: '#FFFFFF',  // white
        tooltipText: '#1F2937', // gray-800
        tooltipBorder: '#E5E7EB' // gray-200
      }
    }
  }

  useEffect(() => {
    // ZingChart 스크립트 동적 로딩
    const loadZingChart = async () => {
      if (typeof window !== 'undefined') {
        // 이미 로드된 경우
        if (window.zingchart) {
          setScriptLoaded(true)
          return
        }

        const script = document.createElement('script')
        script.src = 'https://cdn.zingchart.com/zingchart.min.js'
        script.async = true
        
        return new Promise<void>((resolve, reject) => {
          script.onload = () => {
            if (window.zingchart) {
              window.zingchart.MODULESDIR = 'https://cdn.zingchart.com/modules/'
              setScriptLoaded(true)
              resolve()
            } else {
              reject(new Error('ZingChart failed to load'))
            }
          }
          script.onerror = () => reject(new Error('Failed to load ZingChart script'))
          document.head.appendChild(script)
        })
      }
    }

    loadZingChart().catch(console.error)
  }, [])

  useEffect(() => {
    if (!scriptLoaded || !data || !data.words || data.words.length === 0 || !window.zingchart) {
      return
    }

    // DOM 요소가 준비될 때까지 대기
    const waitForDom = () => {
      if (!chartRef.current) {
        setTimeout(waitForDom, 50)
        return
      }

      // 유효한 워드 데이터만 필터링
      const validWords = data.words.filter(word => 
        word && 
        word.text && 
        typeof word.text === 'string' &&
        typeof word.count === 'number' &&
        word.count > 0
      )

      if (validWords.length === 0) return

      // 테마에 맞는 색상 가져오기
      const colors = getThemeColors()

      // ZingChart 워드클라우드 설정
      const myConfig = {
        type: 'wordcloud',
        options: {
          words: validWords.map(word => ({
            text: word.text,
            count: word.count
          })),
          minLength: 2,
          ignore: [""],
          maxItems: Math.min(validWords.length, 100),
          aspect: 'spiral',
          
          colorType: 'palette',
          palette: colors.palette,
          
          style: {
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            fontWeight: 600,
            
            hoverState: {
              backgroundColor: colors.hoverColor,
              borderRadius: 6,
              fontColor: colors.textColor,
              borderWidth: 2,
              borderColor: colors.palette[0],
              alpha: 0.9
            },
            tooltip: {
              text: '%text: %hits회',
              visible: true,
              alpha: 0.95,
              backgroundColor: colors.tooltipBg,
              borderRadius: 8,
              borderColor: colors.tooltipBorder,
              borderWidth: 1,
              fontColor: colors.tooltipText,
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              fontSize: 13,
              fontWeight: 500,
              padding: '8px 12px',
              shadow: true,
              shadowDistance: 3,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            }
          }
        },
        
        plot: {
          backgroundColor: 'transparent'
        },
        
        backgroundColor: 'transparent'
      }

      // 기존 차트 제거
      if (window.zingchart.exec) {
        try {
          window.zingchart.exec(chartId.current, 'destroy')
        } catch (e) {
          // 차트가 없으면 무시
        }
      }

      // 워드클라우드 렌더링
      try {
        window.zingchart.render({
          id: chartId.current,
          data: myConfig,
          height: 400,
          width: '100%',
          output: 'canvas'
        })
        setChartReady(true)
      } catch (error) {
        console.error('워드클라우드 렌더링 실패:', error)
      }
    }

    // DOM 준비 확인 후 렌더링
    setTimeout(waitForDom, 100)

    // 정리 함수
    return () => {
      if (window.zingchart && window.zingchart.exec) {
        try {
          window.zingchart.exec(chartId.current, 'destroy')
        } catch (e) {
          // 차트가 없으면 무시
        }
      }
      setChartReady(false)
    }
  }, [scriptLoaded, data, resolvedTheme]) // resolvedTheme 추가로 테마 변경 시 재렌더링

  if (isLoading || !scriptLoaded) {
    return (
      <div className="border shadow-sm bg-card border-border rounded-xl">
        <div className="p-4 border-b sm:p-6">
          <div className="flex items-center space-x-2">
            <Cloud className="w-4 h-4 text-purple-500 sm:w-5 sm:h-5" />
            <h2 className="text-lg font-semibold sm:text-xl">{category} 리뷰 워드클라우드</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-b-2 border-purple-500 rounded-full animate-spin"></div>
              <p className="text-sm text-muted-foreground">
                {!scriptLoaded ? 'ZingChart 라이브러리 로딩 중...' : '워드클라우드 생성 중...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data || !data.words || data.words.length === 0) {
    return (
      <div className="border shadow-sm bg-card border-border rounded-xl">
        <div className="p-4 border-b sm:p-6">
          <div className="flex items-center space-x-2">
            <Cloud className="w-4 h-4 text-purple-500 sm:w-5 sm:h-5" />
            <h2 className="text-lg font-semibold sm:text-xl">{category} 리뷰 워드클라우드</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-center text-muted-foreground">데이터가 없습니다</p>
        </div>
      </div>
    )
  }

  // 통계 계산
  const totalWords = data.words.length
  const totalMentions = data.words.reduce((sum, word) => sum + word.count, 0)
  const topWord = data.words[0] // 첫 번째가 가장 많이 언급된 단어
  const avgMentions = Math.round(totalMentions / totalWords)

  return (
    <div className="border shadow-sm bg-card border-border rounded-xl">
      <div className="p-4 border-b sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="w-4 h-4 text-purple-500 sm:w-5 sm:h-5" />
            <h2 className="text-lg font-semibold sm:text-xl">{category} 리뷰 워드클라우드</h2>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>{totalWords}개 키워드</span>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {/* 워드클라우드 */}
        <div className="relative">
          <div 
            id={chartId.current} 
            ref={chartRef}
            className="w-full rounded-lg h-96 bg-gradient-to-br from-background to-muted/20"
          />
          {!chartReady && data && data.words && data.words.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-6 h-6 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground">워드클라우드 렌더링 중...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* 키워드 통계 */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-center sm:grid-cols-4">
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-lg font-bold text-foreground">
              {totalWords.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">총 키워드</div>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-lg font-bold text-foreground">
              {totalMentions.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">총 언급 수</div>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="overflow-hidden text-lg font-bold text-foreground text-ellipsis">
              {topWord?.text || '-'}
            </div>
            <div className="text-xs text-muted-foreground">최다 키워드</div>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-lg font-bold text-foreground">
              {avgMentions.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">평균 언급</div>
          </div>
        </div>
      </div>
    </div>
  )
}
