interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <p className="mb-4 text-lg text-red-600">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  )
}
