import { useEffect, useState } from 'react'
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

const TRAFFIC_REFRESH_INTERVAL = 60000
const HEARTBEAT_INTERVAL = 60000
const PAGE_VIEW_THROTTLE = 30 * 60 * 1000

const defaultTraffic = {
  enabled: false,
  totalViews: 0,
  viewsToday: 0,
  uniqueToday: 0,
  activeVisitors: 0,
  reason: '',
  updatedAt: '',
}

const defaultHealth = {
  trafficApi: 'checking',
  githubApi: 'checking',
  githubCache: 'unknown',
  responseMs: 0,
  checkedAt: '',
}

const getSessionId = () => {
  const storageKey = 'modern-portfolio-session-id'
  const existing = window.localStorage.getItem(storageKey)
  if (existing) return existing

  const generated = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
  window.localStorage.setItem(storageKey, generated)
  return generated
}

const shouldTrackPageView = () => {
  const storageKey = 'modern-portfolio-last-page-view'
  const lastTracked = Number.parseInt(window.localStorage.getItem(storageKey) || '0', 10)
  const shouldTrack = !Number.isFinite(lastTracked) || Date.now() - lastTracked > PAGE_VIEW_THROTTLE

  if (shouldTrack) {
    window.localStorage.setItem(storageKey, String(Date.now()))
  }

  return shouldTrack
}

const formatNumber = (value) => new Intl.NumberFormat('en').format(value || 0)

const formatDuration = (value) => {
  if (!Number.isFinite(value) || value <= 0) return '...'
  if (value >= 1000) return `${(value / 1000).toFixed(2)}s`
  return `${Math.round(value)}ms`
}

const formatScore = (value) => {
  if (!Number.isFinite(value)) return '...'
  return value.toFixed(3)
}

const formatCheckedAt = (value) => {
  if (!value) return 'checking...'
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value))
}

const getVitalsScore = (metric, value) => {
  if (!Number.isFinite(value)) return 'pending'

  const limits = {
    LCP: [2500, 4000],
    INP: [200, 500],
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
    Load: [2500, 4500],
  }

  const [good, poor] = limits[metric] || [1000, 3000]
  if (value <= good) return 'good'
  if (value <= poor) return 'needs-work'
  return 'poor'
}

export default function LiveSiteMetrics() {
  const [traffic, setTraffic] = useState(defaultTraffic)
  const [health, setHealth] = useState(defaultHealth)
  const [vitals, setVitals] = useState({
    FCP: null,
    LCP: null,
    CLS: null,
    INP: null,
    TTFB: null,
    Load: null,
  })

  useEffect(() => {
    const updateMetric = (metric) => {
      setVitals((current) => ({
        ...current,
        [metric.name]: metric.value,
      }))
    }

    onFCP(updateMetric)
    onLCP(updateMetric)
    onCLS(updateMetric)
    onINP(updateMetric)
    onTTFB(updateMetric)

    const updateLoadTime = () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation?.loadEventEnd) {
        setVitals((current) => ({ ...current, Load: navigation.loadEventEnd - navigation.startTime }))
      }
    }

    if (document.readyState === 'complete') {
      updateLoadTime()
    } else {
      window.addEventListener('load', updateLoadTime, { once: true })
    }

    return () => window.removeEventListener('load', updateLoadTime)
  }, [])

  useEffect(() => {
    const sessionId = getSessionId()

    const requestTraffic = async (eventType = 'heartbeat') => {
      const startedAt = performance.now()
      try {
        const response = await fetch('/api/traffic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            eventType,
            path: window.location.pathname,
          }),
        })
        const payload = await response.json()
        setTraffic({ ...defaultTraffic, ...payload })
        setHealth((current) => ({
          ...current,
          trafficApi: response.ok && payload.enabled ? 'online' : 'degraded',
          responseMs: Math.round(performance.now() - startedAt),
          checkedAt: new Date().toISOString(),
        }))
      } catch {
        setHealth((current) => ({
          ...current,
          trafficApi: 'offline',
          responseMs: Math.round(performance.now() - startedAt),
          checkedAt: new Date().toISOString(),
        }))
      }
    }

    const fetchTraffic = async () => {
      const startedAt = performance.now()
      try {
        const response = await fetch('/api/traffic')
        const payload = await response.json()
        setTraffic({ ...defaultTraffic, ...payload })
        setHealth((current) => ({
          ...current,
          trafficApi: response.ok && payload.enabled ? 'online' : 'degraded',
          responseMs: Math.round(performance.now() - startedAt),
          checkedAt: new Date().toISOString(),
        }))
      } catch {
        setHealth((current) => ({
          ...current,
          trafficApi: 'offline',
          responseMs: Math.round(performance.now() - startedAt),
          checkedAt: new Date().toISOString(),
        }))
      }
    }

    const checkGitHubHealth = async () => {
      try {
        const response = await fetch(`/api/github-private-summary?year=${new Date().getFullYear()}`)
        setHealth((current) => ({
          ...current,
          githubApi: response.ok ? 'online' : 'degraded',
          githubCache: response.headers.get('x-vercel-cache') || 'fresh',
          checkedAt: new Date().toISOString(),
        }))
      } catch {
        setHealth((current) => ({
          ...current,
          githubApi: 'offline',
          githubCache: 'unknown',
          checkedAt: new Date().toISOString(),
        }))
      }
    }

    requestTraffic(shouldTrackPageView() ? 'page_view' : 'heartbeat')
    checkGitHubHealth()

    const trafficInterval = window.setInterval(fetchTraffic, TRAFFIC_REFRESH_INTERVAL)
    const heartbeatInterval = window.setInterval(() => requestTraffic('heartbeat'), HEARTBEAT_INTERVAL)

    return () => {
      window.clearInterval(trafficInterval)
      window.clearInterval(heartbeatInterval)
    }
  }, [])

  const trafficCards = [
    { label: 'Active Visitors', value: formatNumber(traffic.activeVisitors), icon: 'groups' },
    { label: 'Views Today', value: formatNumber(traffic.viewsToday), icon: 'today' },
    { label: 'Unique Today', value: formatNumber(traffic.uniqueToday), icon: 'fingerprint' },
    { label: 'Total Views', value: formatNumber(traffic.totalViews), icon: 'query_stats' },
  ]

  const vitalCards = [
    { label: 'LCP', value: formatDuration(vitals.LCP), raw: vitals.LCP, description: 'Largest content paint' },
    { label: 'INP', value: formatDuration(vitals.INP), raw: vitals.INP, description: 'Interaction latency' },
    { label: 'CLS', value: formatScore(vitals.CLS), raw: vitals.CLS, description: 'Layout stability' },
    { label: 'FCP', value: formatDuration(vitals.FCP), raw: vitals.FCP, description: 'First content paint' },
    { label: 'TTFB', value: formatDuration(vitals.TTFB), raw: vitals.TTFB, description: 'Server response' },
    { label: 'Load', value: formatDuration(vitals.Load), raw: vitals.Load, description: 'Full page load' },
  ]

  return (
    <div className="metrics-shell">
      <div className="metrics-grid-primary">
        {trafficCards.map((item) => (
          <article key={item.label} className="metrics-stat-card rb-target-card">
            <span className="material-symbols-outlined metrics-stat-icon">{item.icon}</span>
            <strong>{item.value}</strong>
            <p>{item.label}</p>
          </article>
        ))}
      </div>

      <div className="metrics-panel-grid">
        <section className="metrics-performance-card">
          <div className="metrics-card-head">
            <div>
              <p className="font-label-code text-xs text-secondary">Runtime Performance</p>
              <h3>Core Web Vitals</h3>
            </div>
            <span className="metrics-live-pill"><i /> Real-time</span>
          </div>

          <div className="metrics-vitals-grid">
            {vitalCards.map((item) => (
              <div key={item.label} className={`metrics-vital-card is-${getVitalsScore(item.label, item.raw)}`}>
                <div>
                  <span>{item.label}</span>
                  <small>{item.description}</small>
                </div>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <aside className="metrics-health-card">
          <div className="metrics-card-head">
            <div>
              <p className="font-label-code text-xs text-secondary">Live Health</p>
              <h3>Service Status</h3>
            </div>
            <span className={`metrics-status-dot is-${health.trafficApi}`} />
          </div>

          <div className="metrics-health-list">
            <div><span>Traffic API</span><strong>{health.trafficApi}</strong></div>
            <div><span>GitHub API</span><strong>{health.githubApi}</strong></div>
            <div><span>GitHub Cache</span><strong>{health.githubCache}</strong></div>
            <div><span>Traffic Latency</span><strong>{health.responseMs ? `${health.responseMs}ms` : '...'}</strong></div>
            <div><span>Last Checked</span><strong>{formatCheckedAt(health.checkedAt)}</strong></div>
          </div>

          {!traffic.enabled && traffic.reason ? (
            <p className="metrics-storage-note">{traffic.reason}</p>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
