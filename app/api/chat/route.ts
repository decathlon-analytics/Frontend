import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 백엔드 API로 요청 전달
    const response = await fetch('https://decathlon-analytics.onrender.com/chatbot/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 클라이언트에서 받은 쿠키를 백엔드로 전달
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // 백엔드 응답을 클라이언트로 전달
    const nextResponse = NextResponse.json(data)
    
    // 백엔드에서 받은 Set-Cookie 헤더를 클라이언트로 전달
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      nextResponse.headers.set('Set-Cookie', setCookieHeader)
    }
    
    return nextResponse
    
  } catch (error) {
    console.error('Chat proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
