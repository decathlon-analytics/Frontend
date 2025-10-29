import { NextRequest, NextResponse } from 'next/server'

const BACKEND_BASE_URL = 'https://decathlon-analytics.onrender.com'

export async function GET(request: NextRequest) {
  return handleApiRequest(request, 'GET')
}

export async function POST(request: NextRequest) {
  return handleApiRequest(request, 'POST')
}

export async function PUT(request: NextRequest) {
  return handleApiRequest(request, 'PUT')
}

export async function DELETE(request: NextRequest) {
  return handleApiRequest(request, 'DELETE')
}

async function handleApiRequest(request: NextRequest, method: string) {
  try {
    // URL에서 프록시할 경로 추출
    const url = new URL(request.url)
    const pathSegments = url.pathname.split('/').slice(3) // /api/proxy/ 이후 부분
    const targetPath = '/' + pathSegments.join('/')
    const targetUrl = `${BACKEND_BASE_URL}${targetPath}${url.search}`

    console.log(`🔄 Proxying ${method} ${targetPath}`)

    // 요청 헤더 준비
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // 클라이언트 쿠키를 백엔드로 전달
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader
    }

    // 요청 본문 처리
    let body: string | undefined
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const requestBody = await request.json()
        body = JSON.stringify(requestBody)
      } catch (error) {
        // 본문이 없거나 JSON이 아닌 경우
      }
    }

    // 백엔드로 요청 전달
    const backendResponse = await fetch(targetUrl, {
      method,
      headers,
      body,
    })

    if (!backendResponse.ok) {
      console.error(`❌ Backend error: ${backendResponse.status} ${backendResponse.statusText}`)
      return NextResponse.json(
        { error: `Backend API error: ${backendResponse.status}` },
        { status: backendResponse.status }
      )
    }

    // 응답 데이터 가져오기
    const data = await backendResponse.json()
    
    // 응답 생성
    const response = NextResponse.json(data)
    
    // 백엔드에서 받은 Set-Cookie 헤더를 클라이언트로 전달
    const setCookieHeader = backendResponse.headers.get('set-cookie')
    if (setCookieHeader) {
      response.headers.set('Set-Cookie', setCookieHeader)
    }

    console.log(`✅ Proxy success: ${method} ${targetPath}`)
    return response
    
  } catch (error) {
    console.error('🚨 Proxy error:', error)
    return NextResponse.json(
      { error: 'Proxy server error' },
      { status: 500 }
    )
  }
}
