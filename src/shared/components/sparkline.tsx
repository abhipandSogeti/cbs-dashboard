type SparklineProps = {
  data: number[]
  className?: string
}

function toPoints(data: number[]): string {
  if (data.length < 2) return ''
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  return data
    .map((v, i) => {
      const x = ((i / (data.length - 1)) * 96 + 2).toFixed(1)
      const y = (38 - ((v - min) / range) * 34 + 2).toFixed(1)
      return `${x},${y}`
    })
    .join(' ')
}

export const Sparkline = ({ data, className }: SparklineProps) => {
  const points = toPoints(data)
  if (!points) return null

  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-teal-500"
      />
    </svg>
  )
}
