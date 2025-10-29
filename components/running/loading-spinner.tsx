interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = "데이터를 불러오는 중..." }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
