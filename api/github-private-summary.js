/* global process */
import fs from 'node:fs'
import path from 'node:path'

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'

const readEnvLocalValue = (key) => {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local')
    if (!fs.existsSync(envPath)) return ''

    const content = fs.readFileSync(envPath, 'utf8')
    const line = content
      .split(/\r?\n/)
      .find((item) => item.trim().startsWith(`${key}=`))

    if (!line) return ''
    return line.slice(line.indexOf('=') + 1).trim()
  } catch {
    return ''
  }
}

const toIsoDate = (date) => date.toISOString().slice(0, 10)

const getDateRange = (year) => {
  const from = new Date(Date.UTC(year, 0, 1, 0, 0, 0))
  const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59))
  return { from, to }
}

const sumWeek = (week) => week.contributionDays.reduce((total, day) => total + day.contributionCount, 0)

const toWeekly = (weeks) => weeks.map((week) => {
  const firstDay = week.contributionDays[0]?.date || null
  return {
    weekStart: firstDay,
    totalCount: sumWeek(week),
  }
})

const query = `
  query PrivateSummary($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
        restrictedContributionsCount
      }
    }
  }
`

export default async function handler(_req, res) {
  const token = process.env.GITHUB_TOKEN || readEnvLocalValue('GITHUB_TOKEN')
  const username = process.env.GITHUB_USERNAME || readEnvLocalValue('GITHUB_USERNAME') || 'NHxVNandha'
  const parsedYear = Number.parseInt(_req.query?.year, 10)
  const currentYear = new Date().getFullYear()
  const selectedYear = Number.isFinite(parsedYear) ? parsedYear : currentYear

  if (!token) {
    return res.status(200).json({
      enabled: false,
      reason: 'Missing GITHUB_TOKEN',
      privateContributions: 0,
      totalContributions: 0,
      weeklyContributions: [],
      publicContributions: 0,
      year: selectedYear,
      range: null,
    })
  }

  const { from, to } = getDateRange(selectedYear)

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          login: username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
    })

    const payload = await response.json()

    if (!response.ok || payload.errors?.length) {
      return res.status(500).json({
        enabled: false,
        reason: payload.errors?.[0]?.message || 'GitHub GraphQL request failed',
        privateContributions: 0,
        totalContributions: 0,
        weeklyContributions: [],
        publicContributions: 0,
        year: selectedYear,
        range: null,
      })
    }

    const collection = payload.data?.user?.contributionsCollection
    const calendar = collection?.contributionCalendar
    const weekly = toWeekly(calendar?.weeks || [])
    const totalContributions = calendar?.totalContributions || 0
    const privateContributions = collection?.restrictedContributionsCount || 0
    const publicContributions = Math.max(0, totalContributions - privateContributions)

    return res.status(200).json({
      enabled: true,
      reason: '',
      privateContributions,
      totalContributions,
      publicContributions,
      weeklyContributions: weekly,
      year: selectedYear,
      range: {
        from: toIsoDate(from),
        to: toIsoDate(to),
      },
      updatedAt: new Date().toISOString(),
    })
  } catch {
    return res.status(500).json({
      enabled: false,
      reason: 'Unable to fetch private contribution summary',
      privateContributions: 0,
      totalContributions: 0,
      weeklyContributions: [],
      publicContributions: 0,
      year: selectedYear,
      range: null,
    })
  }
}
