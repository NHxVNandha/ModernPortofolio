import { useEffect, useMemo, useState } from 'react'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatMonthLabel = (year, monthIndex) => {
  const date = new Date(Date.UTC(year, monthIndex, 1))
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date)
}

const formatMonthTrend = (value) => {
  if (value === 0) return 'flat'
  if (value > 0) return `+${value}`
  return `${value}`
}

const resolveYear = (value) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : new Date().getFullYear()
}

const getMonthFromWeekStart = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.getUTCMonth()
}

export default function GitHubCommitChart({
  data,
  isLoading,
  years,
  selectedYear,
  onSelectYear,
  totals,
  summaryEnabled,
  summaryReason,
}) {
  const [hoveredMonth, setHoveredMonth] = useState(null)
  const [isChartEntering, setIsChartEntering] = useState(false)

  const monthlyData = useMemo(() => {
    const year = resolveYear(selectedYear)
    const totalsPerMonth = Array.from({ length: 12 }, (_, monthIndex) => ({
      id: `${year}-${monthIndex}`,
      monthIndex,
      monthShort: MONTH_LABELS[monthIndex],
      monthLong: formatMonthLabel(year, monthIndex),
      total: 0,
      trend: 0,
    }))

    data.forEach((item) => {
      const monthIndex = getMonthFromWeekStart(item.weekStart)
      if (monthIndex === null || monthIndex < 0 || monthIndex > 11) return
      totalsPerMonth[monthIndex].total += Math.max(0, item.totalCount || 0)
    })

    totalsPerMonth.forEach((month, index) => {
      if (index === 0) {
        month.trend = 0
        return
      }
      month.trend = month.total - totalsPerMonth[index - 1].total
    })

    return totalsPerMonth
  }, [data, selectedYear])

  const maxMonthlyTotal = useMemo(() => {
    const max = monthlyData.reduce((currentMax, item) => Math.max(currentMax, item.total), 0)
    return Math.max(max, 1)
  }, [monthlyData])

  useEffect(() => {
    if (isLoading) return undefined
    setIsChartEntering(true)
    const timeoutId = window.setTimeout(() => {
      setIsChartEntering(false)
    }, 160)

    return () => window.clearTimeout(timeoutId)
  }, [isLoading, selectedYear])

  if (isLoading) {
    return (
      <section className="github-commit-chart-card" aria-busy="true" aria-live="polite">
        <div className="github-commit-chart-header github-commit-chart-top">
          <div>
            <h3 className="font-headline-md text-2xl">Contribution</h3>
            <p className="text-on-surface-variant text-sm">Loading contribution trends...</p>
          </div>
        </div>
        <div className="github-commit-loading" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={`loading-${index}`} className="github-commit-loading-bar" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="github-commit-chart-card" aria-labelledby="weekly-commit-activity">
      <div className="github-commit-chart-header github-commit-chart-top">
        <div>
          <h3 id="weekly-commit-activity" className="font-headline-md text-2xl">Contribution</h3>
          <p className="text-on-surface-variant text-sm">Minimal monthly trend from weekly contribution totals.</p>
        </div>
        <div className="github-year-switch" role="tablist" aria-label="Select contribution year">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              className={`github-year-chip ${selectedYear === year ? 'is-active' : ''}`}
              onClick={() => onSelectYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="github-private-totals mb-3">
        <span className="github-chip">Total: {totals.total}</span>
        <span className="github-chip">Public: {totals.public}</span>
        <span className="github-chip">Private: {totals.private}</span>
      </div>

      {!summaryEnabled && !isLoading ? (
        <div className="github-commit-empty mb-3">
          <span className="material-symbols-outlined text-secondary text-3xl">lock</span>
          <p>{summaryReason || 'Private summary unavailable. Showing public-only state if available.'}</p>
        </div>
      ) : null}

      <div className={`github-commit-chart-wrap ${isChartEntering ? 'is-entering' : ''}`} role="img" aria-label="Monthly contribution bar chart">
        <div className="github-commit-grid" />
        <div className="github-commit-bars">
          {monthlyData.map((item) => {
            const ratio = item.total / maxMonthlyTotal
            const height = `${Math.max(ratio * 100, item.total > 0 ? 10 : 2)}%`
            const isActive = hoveredMonth?.id === item.id

            return (
              <div key={item.id} className="github-month-group">
                <button
                  type="button"
                  className={`github-commit-bar ${isActive ? 'is-active' : ''}`}
                  style={{ height }}
                  onMouseEnter={() => setHoveredMonth(item)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  onFocus={() => setHoveredMonth(item)}
                  onBlur={() => setHoveredMonth(null)}
                  aria-label={`${item.monthLong}: ${item.total} contributions, trend ${formatMonthTrend(item.trend)}`}
                >
                  <span className="sr-only">{item.monthLong}: {item.total} contributions, trend {formatMonthTrend(item.trend)}</span>
                </button>
                <span className="github-month-label" aria-hidden="true">{item.monthShort}</span>
              </div>
            )
          })}
        </div>
        <div className="github-month-trend" aria-hidden="true">
          {monthlyData.map((item) => (
            <span key={`${item.id}-trend`} className={item.trend >= 0 ? 'is-up' : 'is-down'}>
              {item.monthShort} {formatMonthTrend(item.trend)}
            </span>
          ))}
        </div>
        {hoveredMonth ? (
          <div className="github-commit-tooltip">
            <p>{hoveredMonth.monthLong}</p>
            <strong>{hoveredMonth.total} contributions</strong>
            <small>Trend: {formatMonthTrend(hoveredMonth.trend)} vs previous month</small>
          </div>
        ) : null}
      </div>
    </section>
  )
}
