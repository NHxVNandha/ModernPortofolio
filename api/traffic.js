/* global process */
import { createHash } from 'node:crypto'
import { neon } from '@neondatabase/serverless'

const ACTIVE_VISITOR_MINUTES = 5
const PAGE_VIEW_THROTTLE_MINUTES = 30

const getDatabaseUrl = () => process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || ''

const json = (res, status, payload) => res.status(status).json({
  ...payload,
  updatedAt: new Date().toISOString(),
})

const hashValue = (value) => createHash('sha256').update(String(value || 'unknown')).digest('hex')

const readBody = (req) => {
  if (!req.body) return {}
  if (typeof req.body === 'object') return req.body

  try {
    return JSON.parse(req.body)
  } catch {
    return {}
  }
}

const ensureSchema = async (sql) => {
  await sql`
    CREATE TABLE IF NOT EXISTS site_sessions (
      session_hash text PRIMARY KEY,
      first_seen_at timestamptz NOT NULL DEFAULT now(),
      last_seen_at timestamptz NOT NULL DEFAULT now()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS site_page_views (
      id bigserial PRIMARY KEY,
      session_hash text NOT NULL,
      path text NOT NULL DEFAULT '/',
      user_agent_hash text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `

  await sql`CREATE INDEX IF NOT EXISTS site_page_views_created_at_idx ON site_page_views (created_at)`
  await sql`CREATE INDEX IF NOT EXISTS site_page_views_session_created_idx ON site_page_views (session_hash, created_at)`
  await sql`CREATE INDEX IF NOT EXISTS site_sessions_last_seen_idx ON site_sessions (last_seen_at)`
}

const getStats = async (sql) => {
  const [row] = await sql`
    SELECT
      (SELECT count(*)::int FROM site_page_views) AS total_views,
      (SELECT count(*)::int FROM site_page_views WHERE created_at >= date_trunc('day', now())) AS views_today,
      (SELECT count(DISTINCT session_hash)::int FROM site_page_views WHERE created_at >= date_trunc('day', now())) AS unique_today,
      (SELECT count(*)::int FROM site_sessions WHERE last_seen_at >= now() - (${ACTIVE_VISITOR_MINUTES} || ' minutes')::interval) AS active_visitors
  `

  return {
    totalViews: row?.total_views || 0,
    viewsToday: row?.views_today || 0,
    uniqueToday: row?.unique_today || 0,
    activeVisitors: row?.active_visitors || 0,
  }
}

export default async function handler(req, res) {
  const databaseUrl = getDatabaseUrl()

  res.setHeader('Cache-Control', 'no-store')

  if (!databaseUrl) {
    return json(res, 200, {
      enabled: false,
      reason: 'Traffic storage is not configured yet.',
      totalViews: 0,
      viewsToday: 0,
      uniqueToday: 0,
      activeVisitors: 0,
    })
  }

  const sql = neon(databaseUrl)

  try {
    await ensureSchema(sql)

    if (req.method === 'POST') {
      const body = readBody(req)
      const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 120) : ''
      const eventType = body.eventType === 'heartbeat' ? 'heartbeat' : 'page_view'
      const path = typeof body.path === 'string' && body.path.startsWith('/') ? body.path.slice(0, 180) : '/'

      if (!sessionId) {
        return json(res, 400, { enabled: true, reason: 'Missing session id.' })
      }

      const sessionHash = hashValue(sessionId)
      const userAgentHash = hashValue(req.headers['user-agent'] || 'unknown')

      await sql`
        INSERT INTO site_sessions (session_hash, first_seen_at, last_seen_at)
        VALUES (${sessionHash}, now(), now())
        ON CONFLICT (session_hash) DO UPDATE SET last_seen_at = now()
      `

      if (eventType === 'page_view') {
        await sql`
          INSERT INTO site_page_views (session_hash, path, user_agent_hash)
          SELECT ${sessionHash}, ${path}, ${userAgentHash}
          WHERE NOT EXISTS (
            SELECT 1
            FROM site_page_views
            WHERE session_hash = ${sessionHash}
              AND created_at >= now() - (${PAGE_VIEW_THROTTLE_MINUTES} || ' minutes')::interval
          )
        `
      }

      return json(res, 200, {
        enabled: true,
        reason: '',
        ...(await getStats(sql)),
      })
    }

    if (req.method === 'GET') {
      return json(res, 200, {
        enabled: true,
        reason: '',
        ...(await getStats(sql)),
      })
    }

    return json(res, 405, { enabled: true, reason: 'Method not allowed.' })
  } catch (error) {
    return json(res, 500, {
      enabled: false,
      reason: error?.message || 'Unable to load traffic metrics.',
      totalViews: 0,
      viewsToday: 0,
      uniqueToday: 0,
      activeVisitors: 0,
    })
  }
}
