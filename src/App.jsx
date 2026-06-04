import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TrueFocus from './components/TrueFocus.jsx'
import ElectricBorder from './components/ElectricBorder.jsx'
import TargetCursor from './components/TargetCursor.jsx'
import Dock from './components/Dock.jsx'
import Lanyard from './components/Lanyard.jsx'
import GitHubCommitChart from './components/GitHubCommitChart.jsx'
import HomeMusicPlayer from './components/HomeMusicPlayer.jsx'
import LiveSiteMetrics from './components/LiveSiteMetrics.jsx'
import stitchProjects from './data/stitchProjects.json'

const GITHUB_USERNAME = 'NHxVNandha'
const GITHUB_REFRESH_INTERVAL = 30 * 60 * 1000
const GITHUB_SNAKE_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}/output/github-contribution-grid-snake-dark.svg`
const CONTRIBUTION_YEARS_TO_SHOW = 3
const EMAIL_ADDRESS = 'contact@kurniahary.com'
const WHATSAPP_NUMBER = '+62 895-3950-94858'
const WHATSAPP_URL = 'https://wa.me/62895395094858'
const LINKEDIN_URL = 'https://www.linkedin.com/in/kurnia-hary-trisnandha-a80240249/'
const INSTAGRAM_URL = 'https://www.instagram.com/kurniahary8'
const TIKTOK_URL = 'https://www.tiktok.com/@idamankleean'
const YOUTUBE_URL = 'https://www.youtube.com/@kurniaharytz6654'

const mobileViewByHash = {
  home: 'home',
  about: 'profile',
  skills: 'profile',
  experience: 'journey',
  education: 'journey',
  projects: 'projects',
  'site-metrics': 'metrics',
  stitch: 'stitch',
  contact: 'contact',
}

const mobileViewPrimarySection = {
  home: 'home',
  profile: 'skills',
  journey: 'experience',
  projects: 'projects',
  metrics: 'site-metrics',
  stitch: 'stitch',
  contact: 'contact',
}

const contactLinks = [
  {
    label: 'Email',
    value: EMAIL_ADDRESS,
    description: 'Best for formal inquiries, project briefs, and collaboration details.',
    href: `mailto:${EMAIL_ADDRESS}`,
    icon: 'alternate_email',
    iconClass: 'text-primary',
    iconWrapClass: 'bg-primary/10 border-primary/20 group-hover:bg-primary/20',
  },
  {
    label: 'WhatsApp',
    value: WHATSAPP_NUMBER,
    description: 'Fast response for direct discussion and opportunity follow-ups.',
    href: WHATSAPP_URL,
    icon: 'chat_bubble',
    iconClass: 'text-secondary',
    iconWrapClass: 'bg-secondary/10 border-secondary/20 group-hover:bg-secondary/20',
  },
  {
    label: 'LinkedIn',
    value: 'Kurnia Hary Trisnandha',
    description: 'Career profile, professional networking, and role opportunities.',
    href: LINKEDIN_URL,
    devicon: 'devicon-linkedin-plain',
    iconClass: 'text-primary',
    iconWrapClass: 'bg-primary/10 border-primary/20 group-hover:bg-primary/20',
  },
  {
    label: 'GitHub',
    value: GITHUB_USERNAME,
    description: 'Code portfolio, repositories, and recent development activity.',
    href: `https://github.com/${GITHUB_USERNAME}`,
    devicon: 'devicon-github-original',
    iconClass: 'text-secondary',
    iconWrapClass: 'bg-secondary/10 border-secondary/20 group-hover:bg-secondary/20',
  },
]

const socialLinks = [
  { label: 'GitHub', href: `https://github.com/${GITHUB_USERNAME}`, devicon: 'devicon-github-original' },
  { label: 'LinkedIn', href: LINKEDIN_URL, devicon: 'devicon-linkedin-plain' },
  { label: 'Instagram', href: INSTAGRAM_URL, icon: 'photo_camera' },
  { label: 'TikTok', href: TIKTOK_URL, icon: 'music_note' },
  { label: 'YouTube', href: YOUTUBE_URL, icon: 'smart_display' },
]

const footerNavLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'Metrics', href: '#site-metrics' },
  { label: 'Stitch', href: '#stitch' },
  { label: 'Contact', href: '#contact' },
]

const footerContactLabels = new Set(['WhatsApp'])
const footerSocialLabels = new Set(['GitHub', 'LinkedIn', 'Instagram', 'YouTube'])
const footerQuickLinks = [
  ...footerNavLinks,
  ...socialLinks.filter((item) => footerSocialLabels.has(item.label)),
  ...contactLinks.filter((item) => footerContactLabels.has(item.label)),
]

const certifications = [
  {
    title: 'Introduction to Artificial Intelligence',
    issuer: 'Pijak in collaboration with IBM SkillsBuild',
    issued: 'Mei 2026',
    credentialId: 'ALM-COURSE_4058918',
    icon: 'psychology',
    toneClass: 'text-primary',
    iconBgClass: 'rb-cert-icon-primary',
    dotClass: 'rb-cert-dot-primary',
  },
  {
    title: 'CSS (Basic)',
    issuer: 'HackerRank',
    issued: 'Nov 2025',
    credentialId: '613722766A22',
    devicon: 'devicon-css3-plain',
    toneClass: 'text-primary',
    iconBgClass: 'rb-cert-icon-primary',
    dotClass: 'rb-cert-dot-primary',
  },
  {
    title: 'SQL (Basic)',
    issuer: 'HackerRank',
    issued: 'Nov 2025',
    credentialId: 'ID022DDDAD4DEO',
    icon: 'database',
    toneClass: 'text-tertiary',
    iconBgClass: 'rb-cert-icon-tertiary',
    dotClass: 'rb-cert-dot-tertiary',
  },
  {
    title: 'Belajar Dasar Pemrograman JavaScript',
    issuer: 'Dicoding Indonesia',
    issued: 'Okt 2024',
    expires: 'Okt 2027',
    credentialId: '1OP84WYMQZQK',
    devicon: 'devicon-javascript-plain',
    toneClass: 'text-tertiary',
    iconBgClass: 'rb-cert-icon-tertiary',
    dotClass: 'rb-cert-dot-tertiary',
  },
  {
    title: 'Merancang dan Mengelola Jaringan Komputer',
    issuer: 'Cybers Academy',
    issued: 'Agu 2023',
    credentialId: 'BL2318LKCN8GINV/45142/16',
    icon: 'hub',
    toneClass: 'text-secondary',
    iconBgClass: 'rb-cert-icon-secondary',
    dotClass: 'rb-cert-dot-secondary',
  },
  {
    title: 'Dasar-Dasar Dukungan Teknis',
    issuer: 'Coursera',
    issued: 'Okt 2022',
    credentialId: 'ATNQ4DN4FC4K',
    icon: 'support_agent',
    toneClass: 'text-primary',
    iconBgClass: 'rb-cert-icon-primary',
    dotClass: 'rb-cert-dot-primary',
  },
  {
    title: 'Work In Tech Soft Skills Training',
    issuer: 'QED Research Consulting',
    issued: 'Sep 2022',
    icon: 'groups',
    toneClass: 'text-secondary',
    iconBgClass: 'rb-cert-icon-secondary',
    dotClass: 'rb-cert-dot-secondary',
  },
  {
    title: 'Digital Marketing Certified',
    issuer: 'Badan Nasional Sertifikasi Profesi (BNSP)',
    issued: 'Jan 2022',
    expires: 'Jan 2025',
    credentialId: '62090 2431 0 0016041 2022',
    icon: 'verified',
    toneClass: 'text-secondary',
    iconBgClass: 'rb-cert-icon-secondary',
    dotClass: 'rb-cert-dot-secondary',
  },
  {
    title: 'IT Network System Administration',
    issuer: 'LKS SMK',
    issued: 'Mar 2021',
    icon: 'router',
    toneClass: 'text-tertiary',
    iconBgClass: 'rb-cert-icon-tertiary',
    dotClass: 'rb-cert-dot-tertiary',
  },
]

const formatCompactDate = (value) => {
  if (!value) return 'Unknown'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

const formatRelativeTime = (value) => {
  if (!value) return 'just now'

  const diffSeconds = Math.round((new Date(value).getTime() - Date.now()) / 1000)
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]

  for (const [unit, seconds] of units) {
    const amount = Math.trunc(diffSeconds / seconds)
    if (Math.abs(amount) >= 1) {
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(amount, unit)
    }
  }

  return 'just now'
}

const getActivityLabel = (event) => {
  const repoName = event.repo?.name?.split('/').pop() || 'repository'

  switch (event.type) {
    case 'PushEvent':
      return `Pushed ${event.payload?.commits?.length || 1} commit${event.payload?.commits?.length === 1 ? '' : 's'} to ${repoName}`
    case 'CreateEvent':
      return `Created ${event.payload?.ref_type || 'item'} in ${repoName}`
    case 'ForkEvent':
      return `Forked ${repoName}`
    case 'WatchEvent':
      return `Starred ${repoName}`
    case 'PullRequestEvent':
      return `Updated pull request in ${repoName}`
    case 'IssuesEvent':
      return `Updated issue in ${repoName}`
    default:
      return `Updated ${repoName}`
  }
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [musicOpen, setMusicOpen] = useState(false)
  const [musicPlayRequest, setMusicPlayRequest] = useState(1)
  const [nowPlaying, setNowPlaying] = useState({
    title: 'No track',
    artist: 'Unknown',
    mood: 'Unknown',
  })
  const [musicIsPlaying, setMusicIsPlaying] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [activeMobileView, setActiveMobileView] = useState('home')
  const [isContactVisible, setIsContactVisible] = useState(false)
  const [selectedStitchSlug, setSelectedStitchSlug] = useState(stitchProjects[0]?.slug || '')
  const [githubRepos, setGithubRepos] = useState([])
  const [githubEvents, setGithubEvents] = useState([])
  const [githubProfile, setGithubProfile] = useState({
    name: '',
    bio: '',
    avatarUrl: '',
    profileUrl: `https://github.com/${GITHUB_USERNAME}`,
    followers: 0,
    following: 0,
  })
  const [githubLoading, setGithubLoading] = useState(true)
  const [githubError, setGithubError] = useState('')
  const [githubLastSync, setGithubLastSync] = useState(null)
  const [privateSummary, setPrivateSummary] = useState({
    enabled: false,
    reason: '',
    privateContributions: 0,
    totalContributions: 0,
    publicContributions: 0,
    weeklyContributions: [],
    year: new Date().getFullYear(),
    range: null,
  })
  const [privateSummaryLoading, setPrivateSummaryLoading] = useState(true)
  const [selectedContributionYear, setSelectedContributionYear] = useState(new Date().getFullYear())
  const [snakeAvailable, setSnakeAvailable] = useState(true)
  const contactBorderRef = useRef(null)
  const homeTechs = [
    { label: 'C#', icon: 'devicon-csharp-plain text-primary icon-glow-blue', border: 'group-hover:border-primary' },
    { label: 'PHP', icon: 'devicon-php-plain text-secondary icon-glow-emerald', border: 'group-hover:border-secondary' },
    { label: 'JS', icon: 'devicon-javascript-plain text-tertiary icon-glow-tertiary', border: 'group-hover:border-tertiary' },
    { label: 'SQL', icon: 'devicon-mysql-plain text-primary icon-glow-blue', border: 'group-hover:border-primary' },
    { label: 'ASP.NET Core', icon: 'devicon-dotnetcore-plain text-primary icon-glow-blue', border: 'group-hover:border-primary' },
    { label: 'Laravel', icon: 'devicon-laravel-plain text-secondary icon-glow-emerald', border: 'group-hover:border-secondary' },
    { label: 'React.js', icon: 'devicon-react-original text-primary icon-glow-blue', border: 'group-hover:border-primary' },
    { label: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain text-primary icon-glow-blue', border: 'group-hover:border-primary' },
    { label: 'PostgreSQL', icon: 'devicon-postgresql-plain text-tertiary icon-glow-tertiary', border: 'group-hover:border-tertiary' },
    { label: 'SQL Server', icon: 'devicon-microsoftsqlserver-plain text-tertiary icon-glow-tertiary', border: 'group-hover:border-tertiary' },
    { label: 'MySQL', icon: 'devicon-mysql-plain text-tertiary icon-glow-tertiary', border: 'group-hover:border-tertiary' },
    { label: 'Git / GitHub', icon: 'devicon-github-original text-on-surface-variant', border: 'group-hover:border-on-surface-variant' },
    { label: 'Docker', icon: 'devicon-docker-plain text-on-surface-variant', border: 'group-hover:border-on-surface-variant' },
    { label: 'Postman', icon: 'devicon-postman-plain text-on-surface-variant', border: 'group-hover:border-on-surface-variant' },
    { label: 'Visual Studio', icon: 'devicon-visualstudio-plain text-on-surface-variant', border: 'group-hover:border-on-surface-variant' },
    { label: 'Codex', symbol: 'code', iconTone: 'text-primary icon-glow-blue', border: 'group-hover:border-primary' },
    { label: 'OpenCode', symbol: 'smart_toy', iconTone: 'text-secondary icon-glow-emerald', border: 'group-hover:border-secondary' },
    { label: 'Gemini CLI', symbol: 'terminal', iconTone: 'text-tertiary icon-glow-tertiary', border: 'group-hover:border-tertiary' },
  ]

  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'experience', 'education', 'projects', 'site-metrics', 'stitch', 'contact']
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)

    const updateActiveSection = () => {
      const viewportAnchor = window.scrollY + window.innerHeight * 0.33
      let currentId = 'home'

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY
        if (sectionTop <= viewportAnchor) {
          currentId = section.id
        }
      })

      setActiveSection((prev) => (prev === currentId ? prev : currentId))
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  useEffect(() => {
    const syncMobileViewFromHash = () => {
      const hashId = window.location.hash.replace('#', '')
      const nextView = mobileViewByHash[hashId] || 'home'
      const sectionId = mobileViewPrimarySection[nextView] || 'home'
      setActiveMobileView(nextView)
      setActiveSection(sectionId)
    }

    syncMobileViewFromHash()
    window.addEventListener('hashchange', syncMobileViewFromHash)
    return () => window.removeEventListener('hashchange', syncMobileViewFromHash)
  }, [])

  useEffect(() => {
    let ignore = false

    const fetchPrivateSummary = async () => {
      if (!ignore) {
        setPrivateSummaryLoading(true)
      }

      try {
        const response = await fetch(`/api/github-private-summary?year=${selectedContributionYear}`)
        const payload = await response.json()
        if (ignore) return

        if (!response.ok) {
          setPrivateSummary({
            enabled: false,
            reason: payload?.reason || 'Unable to load private summary',
            privateContributions: 0,
            totalContributions: 0,
            weeklyContributions: [],
            range: null,
          })
        } else {
          setPrivateSummary(payload)
        }
      } catch {
        if (!ignore) {
          setPrivateSummary({
            enabled: false,
            reason: 'Unable to load private summary',
            privateContributions: 0,
            totalContributions: 0,
            weeklyContributions: [],
            range: null,
          })
        }
      } finally {
        if (!ignore) {
          setPrivateSummaryLoading(false)
        }
      }
    }

    fetchPrivateSummary()
    const intervalId = window.setInterval(fetchPrivateSummary, GITHUB_REFRESH_INTERVAL)

    return () => {
      ignore = true
      window.clearInterval(intervalId)
    }
  }, [selectedContributionYear])

  useEffect(() => {
    const nodes = document.querySelectorAll('.rb-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const target = contactBorderRef.current
    if (!target) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsContactVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.15 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let ignore = false

    const fetchGitHubData = async () => {
      try {
        const [reposResponse, eventsResponse, profileResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=8`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
        ])

        if (!reposResponse.ok || !eventsResponse.ok || !profileResponse.ok) {
          throw new Error('GitHub API request failed')
        }

        const [reposData, eventsData, profileData] = await Promise.all([
          reposResponse.json(),
          eventsResponse.json(),
          profileResponse.json(),
        ])

        if (ignore) return

        setGithubRepos(reposData.filter((repo) => !repo.fork))
        setGithubEvents(eventsData)
        setGithubProfile({
          name: profileData?.name || GITHUB_USERNAME,
          bio: profileData?.bio || '',
          avatarUrl: profileData?.avatar_url || '',
          profileUrl: profileData?.html_url || `https://github.com/${GITHUB_USERNAME}`,
          followers: profileData?.followers || 0,
          following: profileData?.following || 0,
        })
        setGithubLastSync(new Date().toISOString())
        setGithubError('')
      } catch {
        if (!ignore) {
          setGithubError('Unable to sync GitHub data right now.')
        }
      } finally {
        if (!ignore) {
          setGithubLoading(false)
        }
      }
    }

    fetchGitHubData()
    const intervalId = window.setInterval(fetchGitHubData, GITHUB_REFRESH_INTERVAL)

    return () => {
      ignore = true
      window.clearInterval(intervalId)
    }
  }, [])

  const tiltMove = (event) => {
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    const rx = (py - 0.5) * -8
    const ry = (px - 0.5) * 10
    const mx = (px - 0.5) * 18
    const my = (py - 0.5) * 18
    el.style.setProperty('--rb-rx', `${rx.toFixed(2)}deg`)
    el.style.setProperty('--rb-ry', `${ry.toFixed(2)}deg`)
    el.style.setProperty('--rb-mx', `${mx.toFixed(2)}px`)
    el.style.setProperty('--rb-my', `${my.toFixed(2)}px`)
  }

  const tiltLeave = (event) => {
    const el = event.currentTarget
    el.style.setProperty('--rb-rx', '0deg')
    el.style.setProperty('--rb-ry', '0deg')
    el.style.setProperty('--rb-mx', '0px')
    el.style.setProperty('--rb-my', '0px')
  }

  const magneticMove = (event) => {
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12
    el.style.setProperty('--mag-x', `${x.toFixed(2)}px`)
    el.style.setProperty('--mag-y', `${y.toFixed(2)}px`)
  }

  const magneticLeave = (event) => {
    const el = event.currentTarget
    el.style.setProperty('--mag-x', '0px')
    el.style.setProperty('--mag-y', '0px')
  }

  const spotlightMove = (event) => {
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    el.style.setProperty('--spot-x', `${x}px`)
    el.style.setProperty('--spot-y', `${y}px`)
  }

  const navClass = (id) => {
    const isActive = id === 'experience'
      ? activeSection === 'experience' || activeSection === 'education'
      : activeSection === id

    return isActive
      ? 'text-primary font-bold border-b-2 border-primary pb-1 transition-all duration-300'
      : 'text-on-surface-variant hover:text-primary transition-all duration-300'
  }

  const mobileViewClass = (view, baseClass) => `${baseClass} mobile-view-panel ${activeMobileView === view ? 'mobile-view-active' : 'mobile-view-hidden'}`

  const showMobileView = (view) => {
    const sectionId = mobileViewPrimarySection[view] || 'home'
    setMenuOpen(false)
    setActiveMobileView(view)
    setActiveSection(sectionId)
    window.history.pushState(null, '', `#${sectionId}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const mobileDockItems = [
    { icon: <span className="material-symbols-outlined text-[20px]">home</span>, label: 'Home', onClick: () => showMobileView('home'), className: activeMobileView === 'home' ? 'rb-dock-active' : '' },
    { icon: <span className="material-symbols-outlined text-[20px]">auto_awesome</span>, label: 'Profile', onClick: () => showMobileView('profile'), className: activeMobileView === 'profile' ? 'rb-dock-active' : '' },
    { icon: <span className="material-symbols-outlined text-[20px]">school</span>, label: 'Journey', onClick: () => showMobileView('journey'), className: activeMobileView === 'journey' ? 'rb-dock-active' : '' },
    { icon: <span className="material-symbols-outlined text-[20px]">work</span>, label: 'Projects', onClick: () => showMobileView('projects'), className: activeMobileView === 'projects' ? 'rb-dock-active' : '' },
    { icon: <span className="material-symbols-outlined text-[20px]">mail</span>, label: 'Contact', onClick: () => showMobileView('contact'), className: activeMobileView === 'contact' ? 'rb-dock-active' : '' },
  ]

  const projectRepos = githubRepos.slice(0, 6)
  const selectedStitchProject = stitchProjects.find((project) => project.slug === selectedStitchSlug) || stitchProjects[0] || null
  const selectedStitchIndex = selectedStitchProject ? stitchProjects.findIndex((project) => project.slug === selectedStitchProject.slug) : -1
  const githubStats = githubRepos.reduce(
    (stats, repo) => ({
      stars: stats.stars + repo.stargazers_count,
      forks: stats.forks + repo.forks_count,
      languages: repo.language ? stats.languages.add(repo.language) : stats.languages,
    }),
    { stars: 0, forks: 0, languages: new Set() },
  )
  const recentCommits = githubEvents
    .filter((event) => event.type === 'PushEvent')
    .flatMap((event) =>
      (event.payload?.commits || []).map((commit) => ({
        id: `${event.id}-${commit.sha}`,
        repo: event.repo?.name?.split('/').pop() || 'Repository',
        message: commit.message,
        url: commit.url?.replace('api.github.com/repos', 'github.com')?.replace('/commits/', '/commit/'),
        createdAt: event.created_at,
      })),
    )
    .slice(0, 4)
  const latestCommitByRepo = recentCommits.reduce((items, commit) => {
    if (!items[commit.repo]) items[commit.repo] = commit
    return items
  }, {})
  const contributionYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: CONTRIBUTION_YEARS_TO_SHOW }, (_, index) => currentYear - index)
  }, [])

  const toggleMusicPanel = () => {
    setMusicOpen((prev) => {
      const next = !prev
      if (next) {
        setMusicPlayRequest((value) => value + 1)
      }
      return next
    })
  }

  const triggerMusicPlayback = () => {
    setMusicPlayRequest((value) => value + 1)
  }

  const handleTrackTitleChange = useCallback((title) => {
    setNowPlaying((prev) => (prev.title === title ? prev : { ...prev, title }))
  }, [])

  const handleTrackMetaChange = useCallback((nextMeta) => {
    setNowPlaying((prev) => {
      if (
        prev.title === nextMeta.title
        && prev.artist === nextMeta.artist
        && prev.mood === nextMeta.mood
      ) {
        return prev
      }

      return nextMeta
    })
  }, [])

  return (
    <div className="font-body-md text-on-surface rb-root">
      <TargetCursor
        targetSelector=".rb-target-card"
        spinDuration={2.2}
        hideDefaultCursor={false}
        hoverDuration={0.2}
        parallaxOn
        color="#4edea3"
        colorMap={{
          '.rb-target-edu': '#adc6ff',
          '.rb-target-cert': '#4edea3',
        }}
      />
      <div className="particles-bg" />
      <div className="rb-ambient-orb rb-ambient-a" />
      <div className="rb-ambient-orb rb-ambient-b" />
      <nav className="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-[20px] border-b border-glass-stroke h-20">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full max-w-7xl mx-auto">
          <a
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-glass-stroke bg-surface-container-low/70 p-1.5 transition-transform duration-300 hover:scale-105"
            href="#home"
            aria-label="Kurnia Hary home"
            onClick={(event) => {
              if (window.innerWidth < 768) {
                event.preventDefault()
                showMobileView('home')
              }
            }}
          >
            <img className="h-full w-full" src="/favicon.svg" alt="" aria-hidden="true" />
          </a>
          <div className="hidden md:flex items-center gap-gutter font-body-md text-body-md">
            <a className={navClass('home')} href="#home">Home</a>
            <a className={navClass('skills')} href="#skills">Skills</a>
            <a className={navClass('experience')} href="#experience">Experience</a>
            <a className={navClass('projects')} href="#projects">Projects</a>
            <a className={navClass('site-metrics')} href="#site-metrics">Metrics</a>
            <a className={navClass('stitch')} href="#stitch">Stitch</a>
            <a className={navClass('contact')} href="#contact">Contact</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              className="rb-music-toggle"
              onClick={toggleMusicPanel}
              aria-expanded={musicOpen}
              aria-controls="global-music-player"
            >
              <span className="material-symbols-outlined text-base">library_music</span>
              <span>{musicOpen ? 'Close Music' : 'Open Music'}</span>
            </button>
            <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold active:scale-95 transition-transform duration-300 glow-hover-blue">Resume</button>
          </div>
          <button
            type="button"
            className="md:hidden w-11 h-11 inline-flex items-center justify-center rounded-xl border border-glass-stroke bg-surface-container-low text-on-surface"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
        {menuOpen ? (
          <div className="md:hidden border-t border-glass-stroke bg-surface/95 backdrop-blur-[20px]">
            <div className="px-margin-mobile py-4 flex flex-col gap-3 font-body-md">
              <button type="button" className={`text-left ${activeMobileView === 'home' ? 'text-primary font-bold' : 'text-on-surface-variant'}`} onClick={() => showMobileView('home')}>Home</button>
              <button type="button" className={`text-left ${activeMobileView === 'profile' ? 'text-primary font-bold' : 'text-on-surface-variant'}`} onClick={() => showMobileView('profile')}>Profile</button>
              <button type="button" className={`text-left ${activeMobileView === 'journey' ? 'text-primary font-bold' : 'text-on-surface-variant'}`} onClick={() => showMobileView('journey')}>Journey</button>
              <button type="button" className={`text-left ${activeMobileView === 'projects' ? 'text-primary font-bold' : 'text-on-surface-variant'}`} onClick={() => showMobileView('projects')}>Projects</button>
              <button type="button" className={`text-left ${activeMobileView === 'metrics' ? 'text-primary font-bold' : 'text-on-surface-variant'}`} onClick={() => showMobileView('metrics')}>Metrics</button>
              <button type="button" className={`text-left ${activeMobileView === 'stitch' ? 'text-primary font-bold' : 'text-on-surface-variant'}`} onClick={() => showMobileView('stitch')}>Stitch</button>
              <button type="button" className={`text-left ${activeMobileView === 'contact' ? 'text-primary font-bold' : 'text-on-surface-variant'}`} onClick={() => showMobileView('contact')}>Contact</button>
              <button className="mt-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold w-full">Resume</button>
            </div>
          </div>
        ) : null}
      </nav>

      <div className="rb-now-playing-bar" aria-live="polite">
        <div className="rb-now-playing-track">
          <span className={`rb-now-playing-dot ${musicIsPlaying ? 'is-active' : ''}`} aria-hidden="true" />
          <span className="rb-now-playing-label">{musicIsPlaying ? 'Now Playing' : 'Music Paused'}</span>
          <span className="rb-now-playing-sep">-</span>
          <span className="rb-now-playing-meta">{nowPlaying.artist}</span>
          <span className="rb-now-playing-sep">-</span>
          <span className="rb-now-playing-title">{nowPlaying.title}</span>
          <span className="rb-now-playing-sep">-</span>
          <span className="rb-now-playing-meta">{nowPlaying.mood}</span>
        </div>
      </div>

      {!menuOpen ? (
        <div className="rb-mobile-dock">
          <Dock
            items={mobileDockItems}
            panelHeight={58}
            baseItemSize={42}
            magnification={56}
            distance={140}
            dockHeight={130}
            className="rb-dock-theme"
          />
        </div>
      ) : null}

      <main className="pt-20 pb-28 md:pb-0">
        <section className={mobileViewClass('home', 'min-h-[calc(100svh-5rem)] md:min-h-screen px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto pt-10 pb-8 md:py-20 overflow-x-clip rb-reveal rb-home')} id="home">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
            <div className="space-y-5 md:space-y-6 md:-mt-6 rb-profile-card min-w-0">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-code text-label-code">
                <span className="mr-2">Available for projects</span>
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              </div>
              <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-surface rb-gradient-text rb-home-title">Kurnia Hary <span className="text-primary">Trisnandha</span></h1>
              <div className="rb-true-focus" aria-label=".NET Developer and Full Stack Web Developer">
                <TrueFocus
                  sentence=".NET Developer Fullstack"
                  manualMode={false}
                  blurAmount={2}
                  borderColor="#adc6ff"
                  glowColor="rgba(173, 198, 255, 0.6)"
                  animationDuration={0.7}
                  pauseBetweenAnimations={1}
                />
              </div>
              <p className="font-body-md text-sm text-on-surface-variant max-w-xl text-justify leading-relaxed">A passionate software developer with experience in ASP.NET, Laravel, POS systems, and healthcare systems. Focused on building scalable applications and solving real-world problems.</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 md:gap-4 pt-2 md:pt-4 rb-home-actions">
                <a className="px-8 py-4 bg-primary text-on-primary rounded-full font-bold glow-hover-blue transition-all rb-magnetic" onMouseMove={magneticMove} onMouseLeave={magneticLeave} href="#projects">View Portfolio</a>
                <a className="px-8 py-4 border border-glass-stroke backdrop-blur-md rounded-full font-bold hover:bg-white/5 transition-all rb-magnetic" onMouseMove={magneticMove} onMouseLeave={magneticLeave} href="#contact">Contact Me</a>
              </div>

            </div>
              <div className="md:pt-2">
              <div className="relative flex justify-center max-w-[280px] mx-auto md:max-w-none hero-portrait" onMouseMove={tiltMove} onMouseLeave={tiltLeave}>
                <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
                <div className="magic-rings" aria-hidden="true">
                  <span className="magic-ring ring-a" />
                  <span className="magic-ring ring-b" />
                  <span className="magic-ring ring-c" />
                </div>
                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-glass-stroke rb-tilt">
                  <img
                    alt="Portrait of Kurnia Hary"
                    className="w-full h-full object-cover cursor-pointer"
                    src="/profile.png"
                    onClick={triggerMusicPlayback}
                  />
                </div>
              </div>
              <div className="home-tech-marquee pt-6 md:pt-10">
                <div className="home-tech-track">
                  {[...homeTechs, ...homeTechs].map((item, index) => (
                    <div key={`${item.label}-${index}`} className="flex flex-col items-center group">
                      <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-surface-container border border-glass-stroke ${item.border} transition-all duration-300 group-hover:scale-110`}>
                        {item.symbol ? (
                          <span className={`material-symbols-outlined text-3xl ${item.iconTone}`}>{item.symbol}</span>
                        ) : (
                          <i className={`${item.icon} text-3xl`} />
                        )}
                      </div>
                      <span className="font-label-code text-[12px] mt-2 text-on-surface-variant whitespace-nowrap">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className={mobileViewClass('profile', 'pt-8 pb-14 md:py-14 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto scroll-mt-24')} id="skills">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
            <div className="rb-reveal rb-about" id="about">
              <div className="glass-card p-8 rounded-lg grid gap-bento-gap">
                <div><div><h2 className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">Professional <span className="text-secondary">Story</span></h2><div className="w-20 h-1 bg-secondary rounded-full" /></div><p className="font-body-md text-sm text-on-surface-variant leading-relaxed text-justify mt-6">I specialize in architecting robust backend systems and intuitive full-stack web applications. With a strong foundation in C# and the .NET ecosystem, I've spent the last few years developing mission-critical software for healthcare providers and retail environments. My approach combines technical precision with a focus on user experience, ensuring that complex data management remains seamless for the end user.</p><p className="font-body-md text-sm text-on-surface-variant mt-6 leading-relaxed text-justify">From optimizing SQL queries to designing responsive front-end interfaces with Laravel and modern JS frameworks, I thrive in environments that challenge my problem-solving skills.</p></div>
                <div className="grid grid-cols-2 gap-bento-gap">
                  <div className="p-6 flex flex-col items-center justify-center text-center"><div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-2xl">history_toggle_off</span></div><span className="font-headline-md text-2xl text-primary font-bold">3+</span><span className="font-label-code text-on-surface-variant text-[12px]">Years Exp.</span></div>
                  <div className="p-6 flex flex-col items-center justify-center text-center"><div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center"><span className="material-symbols-outlined text-on-secondary text-2xl">code_blocks</span></div><span className="font-label-code text-on-surface-variant text-[12px]">Full Stack</span></div>
                  <div className="p-6 flex flex-col items-center justify-center text-center"><div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-tertiary to-tertiary-container flex items-center justify-center"><span className="material-symbols-outlined text-on-tertiary text-2xl">payments</span></div><span className="font-label-code text-on-surface-variant text-[12px]">Backend</span></div>
                  <div className="p-6 flex flex-col items-center justify-center text-center"><div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-2xl">web</span></div><span className="font-label-code text-on-surface-variant text-[12px]">Frontend</span></div>
                </div>
              </div>
            </div>

            <div className="rb-reveal rb-skills">
              <div className="glass-card p-8 rounded-lg">
                <div className="text-left mb-8"><h2 className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">Technical <span className="text-primary">Arsenal</span></h2><p className="font-body-md text-sm text-on-surface-variant leading-relaxed">Tools and technologies I use to bring ideas to life.</p></div>
                <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass-card arsenal-card arsenal-card-lang p-5 rounded-lg glow-hover-emerald bg-gradient-to-br from-secondary/10 to-surface-container-low min-w-0 rb-tilt" onMouseMove={tiltMove} onMouseLeave={tiltLeave}>
                <div className="flex items-center justify-between mb-4"><h3 className="font-headline-md text-xl text-secondary">Languages</h3><span className="material-symbols-outlined text-secondary text-2xl">terminal</span></div>
                <ul className="space-y-2.5"><li className="flex items-center gap-2.5"><i className="devicon-csharp-plain text-secondary" /><span className="font-body-md text-sm">C# / .NET</span></li><li className="flex items-center gap-2.5"><i className="devicon-php-plain text-secondary" /><span className="font-body-md text-sm">PHP</span></li><li className="flex items-center gap-2.5"><i className="devicon-javascript-plain text-secondary" /><span className="font-body-md text-sm">JavaScript</span></li><li className="flex items-center gap-2.5"><i className="devicon-typescript-plain text-secondary" /><span className="font-body-md text-sm">TypeScript</span></li></ul>
              </div>
              <div className="glass-card arsenal-card arsenal-card-framework p-5 rounded-lg glow-hover-blue bg-gradient-to-br from-primary/10 to-surface-container-low min-w-0 rb-tilt" onMouseMove={tiltMove} onMouseLeave={tiltLeave}>
                <div className="flex items-center justify-between mb-4"><h3 className="font-headline-md text-xl text-primary">Frameworks</h3><span className="material-symbols-outlined text-primary text-2xl">architecture</span></div>
                <ul className="space-y-2.5"><li className="flex items-center gap-2.5"><i className="devicon-dotnetcore-plain text-primary" /><span className="font-body-md text-sm">ASP.NET Core</span></li><li className="flex items-center gap-2.5"><i className="devicon-laravel-plain text-primary" /><span className="font-body-md text-sm">Laravel</span></li><li className="flex items-center gap-2.5"><i className="devicon-react-original text-primary" /><span className="font-body-md text-sm">React.js</span></li><li className="flex items-center gap-2.5"><i className="devicon-tailwindcss-plain text-primary" /><span className="font-body-md text-sm">Tailwind CSS</span></li></ul>
              </div>
              <div className="glass-card arsenal-card arsenal-card-db p-5 rounded-lg glow-hover-emerald bg-gradient-to-br from-tertiary/10 to-surface-container-low min-w-0 rb-tilt" onMouseMove={tiltMove} onMouseLeave={tiltLeave}>
                <div className="flex items-center justify-between mb-4"><h3 className="font-headline-md text-xl text-tertiary">Databases</h3><span className="material-symbols-outlined text-tertiary text-2xl">database</span></div>
                <ul className="space-y-2.5"><li className="flex items-center gap-2.5"><i className="devicon-postgresql-plain text-tertiary" /><span className="font-body-md text-sm">PostgreSQL</span></li><li className="flex items-center gap-2.5"><i className="devicon-microsoftsqlserver-plain text-tertiary" /><span className="font-body-md text-sm">SQL Server</span></li><li className="flex items-center gap-2.5"><i className="devicon-mysql-plain text-tertiary" /><span className="font-body-md text-sm">MySQL</span></li><li className="flex items-center gap-2.5"><i className="devicon-redis-plain text-tertiary" /><span className="font-body-md text-sm">Redis</span></li></ul>
              </div>
              <div className="glass-card arsenal-card arsenal-card-tools p-5 rounded-lg bg-gradient-to-br from-surface-container-high to-surface-container-low min-w-0 rb-tilt" onMouseMove={tiltMove} onMouseLeave={tiltLeave}>
                <div className="flex items-center justify-between mb-4"><h3 className="font-headline-md text-xl text-on-surface">Tools</h3><span className="material-symbols-outlined text-on-surface-variant text-2xl">build</span></div>
                <ul className="space-y-2.5"><li className="flex items-center gap-2.5"><i className="devicon-github-original text-on-surface-variant" /><span className="font-body-md text-sm">Git / GitHub</span></li><li className="flex items-center gap-2.5"><i className="devicon-docker-plain text-on-surface-variant" /><span className="font-body-md text-sm">Docker</span></li><li className="flex items-center gap-2.5"><i className="devicon-postman-plain text-on-surface-variant" /><span className="font-body-md text-sm">Postman</span></li><li className="flex items-center gap-2.5"><i className="devicon-visualstudio-plain text-on-surface-variant" /><span className="font-body-md text-sm">Visual Studio</span></li><li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-on-surface-variant text-base">receipt_long</span><span className="font-body-md text-sm">Crystal Reports</span></li><li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-on-surface-variant text-base">smart_toy</span><span className="font-body-md text-sm">OpenCode</span></li><li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-on-surface-variant text-base">terminal</span><span className="font-body-md text-sm">Gemini CLI</span></li></ul>
              </div>
              <div className="sm:col-span-2">
                <p className="text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">In SQL Server, I regularly design and optimize <span className="text-on-surface">Stored Procedures</span>, <span className="text-on-surface">Triggers</span>, and <span className="text-on-surface">Index Tuning</span> strategies for faster query execution, safer transactions, and stable reporting performance in production systems.</p>
              </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={mobileViewClass('journey', 'py-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto rb-reveal rb-experience')} id="experience">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="order-2">
              <div className="mb-12">
                <h2 className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">Work <span className="text-primary">Journey</span></h2>
                <div className="w-20 h-1 bg-primary rounded-full" />
                <p className="mt-6 max-w-3xl text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">A journey across software engineering, infrastructure support, creative production, and digital marketing, with hands-on execution in real operational environments.</p>
              </div>

              <div className="relative border-l-2 border-glass-stroke ml-4 md:ml-8">
            <div className="mb-12 relative">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20 shadow-[0_0_15px_rgba(173,198,255,0.8)]" />
              <div className="pl-12">
                <div className="glass-card p-8 rounded-lg relative overflow-hidden">
                  <span className="absolute top-4 right-4 material-symbols-outlined text-primary/10 text-6xl">local_hospital</span>
                  <span className="font-label-code text-primary">Dec 2022 - Present</span>
                  <div className="flex items-center gap-3 mt-2">
                    <h3 className="font-headline-md text-xl font-bold">RS Husada Utama Surabaya</h3>
                    <span className="material-symbols-outlined text-primary text-xl">medical_services</span>
                  </div>
                  <p className="text-on-surface-variant font-bold mb-4">IT Programmer</p>
                  <p className="text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">Develop and maintain web applications using C#, ASP.NET, jQuery, JavaScript, and SQL Server. Handle troubleshooting and bug fixing in daily operations. Design, build, and generate business and clinical reports using Crystal Reports. Implement SQL Server stored procedures, triggers, and indexing strategies to support performance and data integrity.</p>
                </div>
              </div>
            </div>

            <div className="mb-12 relative">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-secondary rounded-full ring-4 ring-secondary/20 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
              <div className="pl-12">
                <div className="glass-card p-8 rounded-lg relative overflow-hidden">
                  <span className="absolute top-4 right-4 material-symbols-outlined text-secondary/10 text-6xl">apartment</span>
                  <span className="font-label-code text-secondary">Aug 2021 - Oct 2021</span>
                  <div className="flex items-center gap-3 mt-2">
                    <h3 className="font-headline-md text-xl font-bold">Aston Madiun Hotel &amp; Conference Center</h3>
                    <span className="material-symbols-outlined text-secondary text-xl">meeting_room</span>
                  </div>
                  <p className="text-on-surface-variant font-bold mb-4">IT Staff - 2 Month Internship</p>
                  <p className="text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">Installed and configured LAN devices and access points. Diagnosed printer, scanner, and fingerprint issues. Repaired and reset PC systems and peripherals. Installed hotel system applications (VHP) and workstation software. Received and resolved day-to-day IT incidents while maintaining IT asset inventory across departments.</p>
                </div>
              </div>
            </div>

            <div className="mb-12 relative">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-tertiary rounded-full ring-4 ring-tertiary/20 shadow-[0_0_15px_rgba(255,183,134,0.5)]" />
              <div className="pl-12">
                <div className="glass-card p-8 rounded-lg relative overflow-hidden">
                  <span className="absolute top-4 right-4 material-symbols-outlined text-tertiary/10 text-6xl">web</span>
                  <span className="font-label-code text-tertiary">Feb 2021 - Jul 2021</span>
                  <div className="flex items-center gap-3 mt-2">
                    <h3 className="font-headline-md text-xl font-bold">PT Samudra Mutiara Satria</h3>
                    <span className="material-symbols-outlined text-tertiary text-xl">palette</span>
                  </div>
                  <p className="text-on-surface-variant font-bold mb-4">IT &amp; Design Staff - 5 Month Work</p>
                  <p className="text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">Edited photos and videos for company campaigns and communication materials. Performed hardware and software troubleshooting for office devices. Managed Blogspot and WordPress content operations. Received and solved IT-related operational issues from internal users.</p>
                </div>
              </div>
            </div>

            <div className="mb-12 relative">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20" />
              <div className="pl-12">
                <div className="glass-card p-8 rounded-lg">
                  <span className="font-label-code text-primary">Sep 2020 - Dec 2020</span>
                  <h3 className="font-headline-md text-xl font-bold mt-2">eFABe Entertainment</h3>
                  <p className="text-on-surface-variant font-bold mb-4">Digital Marketing - 2 Month Internship</p>
                  <p className="text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">Conducted keyword research and market analysis. Managed social media optimization and content creation with copywriting. Supported online advertising promotions and campaign execution. Operated photography techniques and equipment, including post-processing for photo and video assets.</p>
                </div>
              </div>
            </div>

            <div className="mb-2 relative">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-secondary rounded-full ring-4 ring-secondary/20" />
              <div className="pl-12">
                <div className="glass-card p-8 rounded-lg">
                  <span className="font-label-code text-secondary">2019 - 2020</span>
                  <h3 className="font-headline-md text-xl font-bold mt-2">CV Elsa Mandiri Abadi</h3>
                  <p className="text-on-surface-variant font-bold mb-4">Computer Technician - 2 Month Work &amp; 5 Month Internship</p>
                  <p className="text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">Diagnosed PC operational issues and performed system repair/reset procedures. Diagnosed and resolved printer issues. Installed LAN devices and executed preventive maintenance for PCs, printers, and computer laboratory equipment.</p>
                </div>
              </div>
            </div>
            </div>
            </div>

            <div className="rb-reveal rb-education order-1 scroll-mt-24" id="education">
              <div className="mb-12">
                <h2 className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">Education</h2>
                <div className="w-20 h-1 bg-secondary rounded-full" />
                <p className="mt-6 text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">My education path combines formal informatics training with practical IT fundamentals, shaping a balanced profile in software development, systems troubleshooting, networking, and database-oriented problem solving.</p>
              </div>

              <div className="space-y-10">
                <div>
                  <div className="relative border-l-2 border-glass-stroke ml-4">
                    <div className="mb-6 relative">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20" />
                      <div className="pl-12">
                        <div className="glass-card p-6 rounded-lg flex gap-6 items-start hover:bg-surface-container-high transition-colors rb-target-card rb-target-edu">
                          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 shadow-lg"><span className="material-symbols-outlined text-primary text-3xl">school</span></div>
                          <div><h4 className="font-headline-md text-xl font-bold">Politeknik Elektronika Negeri Surabaya</h4><p className="text-primary font-label-code text-sm">Diploma 3 - Teknik Informatika (Present)</p><p className="text-on-surface-variant mt-2 font-body-md text-sm leading-relaxed text-justify">Currently pursuing Diploma 3 in Informatics Engineering with focus on software engineering, backend development, and modern web technologies to strengthen industry-ready technical skills.</p></div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 relative">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-secondary rounded-full ring-4 ring-secondary/20" />
                      <div className="pl-12">
                        <div className="glass-card p-6 rounded-lg flex gap-6 items-start hover:bg-surface-container-high transition-colors rb-target-card rb-target-edu">
                          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 shadow-lg"><span className="material-symbols-outlined text-primary text-3xl">school</span></div>
                          <div><h4 className="font-headline-md text-xl font-bold">Wearnes Education Center Madiun</h4><p className="text-primary font-label-code text-sm">Diploma 1 - Information Technology (Graduated 2022)</p><p className="text-on-surface-variant mt-2 font-body-md text-sm leading-relaxed text-justify">Informatics & Computer Science major. Focused on Application Development and Database Management. Recognized for excellence in .NET ecosystem development.</p></div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2 relative">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-tertiary rounded-full ring-4 ring-tertiary/20" />
                      <div className="pl-12">
                        <div className="glass-card p-6 rounded-lg flex gap-6 items-start hover:bg-surface-container-high transition-colors rb-target-card rb-target-edu">
                          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 shadow-lg"><span className="material-symbols-outlined text-primary text-3xl">settings_ethernet</span></div>
                          <div><h4 className="font-headline-md text-xl font-bold">SMKN 5 Madiun</h4><p className="text-primary font-label-code text-sm">Computer & Network Engineering (Graduated 2021)</p><p className="text-on-surface-variant mt-2 font-body-md text-sm leading-relaxed text-justify">IT Network System Administration competition participant. Proficient in Linux server configuration and Cisco protocols.</p></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-12">
                    <h2 className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">Certifications</h2>
                    <div className="w-20 h-1 bg-secondary rounded-full" />
                    <p className="mt-6 text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">Licenses and certifications that validate practical capability across artificial intelligence, web fundamentals, database systems, technical support, networking, digital marketing, and professional work readiness.</p>
                  </div>
                  <div className="rb-cert-timeline">
                    {certifications.map((cert) => (
                      <div key={`${cert.title}-${cert.issued}`} className="rb-cert-item">
                        <span className={`rb-cert-dot ${cert.dotClass}`} aria-hidden="true" />
                        <article className="rb-cert-card rb-target-card rb-target-cert">
                          <div className={`rb-cert-icon ${cert.iconBgClass}`}>
                            {cert.devicon ? <i className={`${cert.devicon} ${cert.toneClass}`} /> : <span className={`material-symbols-outlined ${cert.toneClass}`}>{cert.icon}</span>}
                          </div>
                          <div className="min-w-0">
                            <h4 className="rb-cert-title">{cert.title}</h4>
                            <p className="rb-cert-issuer">{cert.issuer}</p>
                            <div className="rb-cert-meta">
                              <span>Diterbitkan {cert.issued}</span>
                              {cert.expires ? <span>Berakhir {cert.expires}</span> : null}
                            </div>
                            {cert.credentialId ? <p className="rb-cert-id">ID Kredensial <span>{cert.credentialId}</span></p> : null}
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={mobileViewClass('projects', 'py-20 bg-surface-container rb-reveal rb-projects rb-spotlight')} id="projects" onMouseMove={spotlightMove}>
          <div className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
            <div className="mb-14 grid md:grid-cols-12 gap-8 items-start">
              <div className="relative md:col-span-12">
                <h2 className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">Github <span className="text-secondary">Integration</span></h2>
                <div className="w-20 h-1 bg-secondary rounded-full" />
              </div>
              <div className="md:col-span-8">
                <p className="text-on-surface-variant max-w-3xl font-body-md text-sm text-justify leading-relaxed">This GitHub integration highlights how I build and ship real software over time, not only as portfolio output but also as part of my daily professional workflow. The repositories, commit patterns, language usage, and public activity shown here are designed to give a clear view of what I am actively working on and how my technical focus evolves.</p>
                <p className="mt-4 text-on-surface-variant max-w-3xl font-body-md text-sm text-justify leading-relaxed">In my current role as an IT Programmer at RS Husada Utama Surabaya, I handle practical healthcare system needs that require stable backend logic, maintainable code structure, and reliable data handling. Many of my implementation decisions are shaped by production demands, operational continuity, and user-facing reliability.</p>
                <p className="mt-4 text-on-surface-variant max-w-3xl font-body-md text-sm text-justify leading-relaxed">At the same time, as a current Diploma 3 Informatics Engineering student at Politeknik Elektronika Negeri Surabaya, I continuously sharpen my engineering fundamentals through academic projects, technical exploration, and structured problem-solving. This section reflects that ongoing balance between real-world implementation and continuous learning, from feature development and optimization to experimentation, refactoring, and long-term skill growth.</p>
              </div>
              <div className="md:col-span-4">
                <div className="github-mini-profile mb-3">
                  <div className="github-mini-profile-head">
                    <img
                      src={githubProfile.avatarUrl || '/profile.png'}
                      alt={`${githubProfile.name || GITHUB_USERNAME} GitHub avatar`}
                      className="github-mini-avatar"
                    />
                    <div className="min-w-0">
                      <p className="github-mini-name">{githubProfile.name || GITHUB_USERNAME}</p>
                      <p className="github-mini-handle">@{GITHUB_USERNAME}</p>
                    </div>
                  </div>
                  <p className="github-mini-bio">{githubProfile.bio || 'GitHub profile synced. Bio is not available yet.'}</p>
                  <div className="github-mini-stats">
                    <span>{githubProfile.followers} followers</span>
                    <span>{githubProfile.following} following</span>
                  </div>
                  <a className="github-mini-link" href={githubProfile.profileUrl} target="_blank" rel="noreferrer">View GitHub Profile</a>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="github-stat-card"><span>{githubRepos.length}</span><p>Repos</p></div>
                  <div className="github-stat-card"><span>{githubStats.stars}</span><p>Stars</p></div>
                  <div className="github-stat-card"><span>{githubStats.languages.size}</span><p>Languages</p></div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-label-code text-xs"><span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />Auto-refresh 30m</span>
              <span className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-label-code text-xs">Last sync: {githubLastSync ? formatRelativeTime(githubLastSync) : 'syncing...'}</span>
              {githubError ? <span className="px-4 py-2 rounded-full bg-tertiary/10 text-tertiary font-label-code text-xs">{githubError}</span> : null}
            </div>

            <div className="mb-10">
              <GitHubCommitChart
                data={privateSummary.weeklyContributions}
                isLoading={privateSummaryLoading}
                years={contributionYears}
                selectedYear={selectedContributionYear}
                onSelectYear={setSelectedContributionYear}
                totals={{
                  total: privateSummary.totalContributions,
                  public: privateSummary.publicContributions,
                  private: privateSummary.privateContributions,
                }}
                summaryEnabled={privateSummary.enabled}
                summaryReason={privateSummary.reason}
              />
            </div>

            <div className="github-snake-card mb-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-headline-md text-2xl mb-2">Contribution Graph</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Animated snake graph generated from GitHub contribution activity.</p>
                </div>
                <a className="inline-flex items-center gap-2 text-secondary font-label-code text-xs hover:text-primary transition-colors" href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
                  @{GITHUB_USERNAME}<span className="material-symbols-outlined text-base">open_in_new</span>
                </a>
              </div>
              {snakeAvailable ? (
                <div className="github-snake-frame">
                  <img src={GITHUB_SNAKE_URL} alt={`${GITHUB_USERNAME} GitHub contribution snake animation`} onError={() => setSnakeAvailable(false)} />
                </div>
              ) : (
                <div className="github-snake-fallback">
                  <span className="material-symbols-outlined text-secondary text-3xl">hourglass_top</span>
                  <p>Snake graph is waiting for GitHub Action output in the profile repository.</p>
                </div>
              )}
            </div>

            {githubLoading ? (
              <div className="grid md:grid-cols-3 gap-bento-gap">
                {[1, 2, 3].map((item) => <div key={item} className="github-skeleton rounded-3xl h-72" />)}
              </div>
            ) : projectRepos.length ? (
              <div className="grid lg:grid-cols-12 gap-bento-gap items-start">
                <div className="lg:col-span-8 grid md:grid-cols-2 gap-bento-gap">
                  {projectRepos.map((repo, index) => {
                    const latestCommit = latestCommitByRepo[repo.name]
                    const liveUrl = typeof repo.homepage === 'string' && repo.homepage.trim() ? repo.homepage.trim() : ''
                    return (
                      <article key={repo.id} className={`github-project-card rb-target-card ${index === 0 ? 'md:col-span-2' : ''}`}>
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0"><i className="devicon-github-original text-primary text-2xl" /></div>
                          <span className="font-label-code text-xs text-on-surface-variant">Updated {formatRelativeTime(repo.updated_at)}</span>
                        </div>
                        <h3 className="font-headline-md text-2xl mb-3 text-on-surface group-hover:text-primary">{repo.name}</h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{repo.description || 'Public GitHub repository synced automatically into this portfolio.'}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {repo.language ? <span className="github-chip text-primary bg-primary/10">{repo.language}</span> : null}
                          <span className="github-chip"><span className="material-symbols-outlined text-sm">star</span>{repo.stargazers_count}</span>
                          <span className="github-chip"><span className="material-symbols-outlined text-sm">fork_right</span>{repo.forks_count}</span>
                          <span className="github-chip"><span className="material-symbols-outlined text-sm">calendar_month</span>{formatCompactDate(repo.created_at)}</span>
                        </div>
                        {latestCommit ? <div className="github-commit-line"><span className="material-symbols-outlined text-secondary text-base">commit</span><span>{latestCommit.message}</span></div> : null}
                        <div className="github-project-actions">
                          {liveUrl ? (
                            <a className="github-project-action is-primary" href={liveUrl} target="_blank" rel="noreferrer">
                              View Live
                            </a>
                          ) : (
                            <span className="github-project-action is-disabled" aria-disabled="true">No Live Demo</span>
                          )}
                          <a className="github-project-action is-secondary" href={repo.html_url} target="_blank" rel="noreferrer">GitHub</a>
                        </div>
                      </article>
                    )
                  })}
                </div>
                <aside className="lg:col-span-4 github-activity-panel">
                  <div className="flex items-center justify-between mb-6"><h3 className="font-headline-md text-2xl">Latest Activity</h3><span className="material-symbols-outlined text-secondary">monitoring</span></div>
                  <div className="space-y-4">
                    {githubEvents.slice(0, 6).map((event) => (
                      <a key={event.id} className="github-activity-item" href={`https://github.com/${event.repo?.name || GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
                        <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                        <span><strong>{getActivityLabel(event)}</strong><small>{formatRelativeTime(event.created_at)}</small></span>
                      </a>
                    ))}
                  </div>
                </aside>
              </div>
            ) : (
              <div className="github-empty-state">No public repositories found for {GITHUB_USERNAME}.</div>
            )}
          </div>
        </section>


        <section className={mobileViewClass('metrics', 'py-20 bg-surface rb-reveal rb-metrics')} id="site-metrics">
          <div className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
            <div className="metrics-section-head">
              <div>
                <p className="font-label-code text-xs uppercase tracking-[0.28em] text-secondary mb-3">Live Site Telemetry</p>
                <h2 className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">Performance <span className="text-secondary">Metrics</span></h2>
                <div className="w-20 h-1 bg-secondary rounded-full" />
                <p className="mt-6 text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">Realtime portfolio health and visitor telemetry powered by Neon, browser Web Vitals, and Vercel serverless APIs. The traffic counter uses anonymous sessions only and avoids storing raw visitor IP addresses.</p>
              </div>
              <span className="metrics-section-badge"><i /> Live telemetry</span>
            </div>
            <LiveSiteMetrics />
          </div>
        </section>


        <section className={mobileViewClass('stitch', 'py-20 bg-surface-deep rb-reveal')} id="stitch">
          <div className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
            <div className="stitch-section-head">
              <div>
                <p className="font-label-code text-xs uppercase tracking-[0.28em] text-secondary mb-3">Google Stitch Exports</p>
                <h2 className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">Stitch <span className="text-secondary">Concepts</span></h2>
                <div className="w-20 h-1 bg-secondary rounded-full" />
                <p className="mt-6 text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">Generated interface concepts exported from Google Stitch. Each project is loaded from the local portfolioStitch folder and previewed directly in this page without opening a modal or a new browser tab.</p>
              </div>
              <span className="stitch-count-badge">{stitchProjects.length} concepts</span>
            </div>

            {stitchProjects.length ? (
              <div className="stitch-showcase">
                <div className="stitch-tabs" aria-label="Stitch concept selector">
                  {stitchProjects.map((project) => {
                    const isActive = selectedStitchProject?.slug === project.slug
                    return (
                      <button
                        key={project.slug}
                        type="button"
                        className={`stitch-tab rb-target-card ${isActive ? 'is-active' : ''}`}
                        onClick={() => setSelectedStitchSlug(project.slug)}
                        aria-pressed={isActive}
                      >
                        <img src={project.thumbnail} alt={`${project.title} thumbnail`} loading="lazy" />
                        <span>
                          <strong>{project.title}</strong>
                          <small>Google Stitch Export</small>
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="stitch-active-bar">
                  <div>
                    <p className="font-label-code text-xs text-secondary">Selected Concept</p>
                    <h3>{selectedStitchProject?.title}</h3>
                    <p>{selectedStitchProject?.description}</p>
                  </div>
                  <span>{selectedStitchIndex + 1} / {stitchProjects.length}</span>
                </div>

                <div className="stitch-browser">
                  <div className="stitch-browser-chrome">
                    <span className="stitch-browser-dots" aria-hidden="true"><i /><i /><i /></span>
                    <code>{selectedStitchProject?.htmlUrl}</code>
                  </div>
                  <div className="stitch-browser-frame">
                    <iframe
                      key={selectedStitchProject?.slug}
                      src={selectedStitchProject?.htmlUrl}
                      title={`${selectedStitchProject?.title} Google Stitch preview`}
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="stitch-empty-state">
                <span className="material-symbols-outlined text-secondary text-4xl">folder_open</span>
                <h3>No Stitch exports detected yet.</h3>
                <p>Create folders inside <code>public/portofolioStitch</code>. Each folder should contain one HTML file and one PNG/JPG/WebP thumbnail, then run <code>npm run generate:stitch</code>.</p>
              </div>
            )}
          </div>
        </section>



        <section className={mobileViewClass('contact', 'py-20 bg-surface-deep rb-reveal rb-contact')} id="contact">
          <div className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto text-center">
            <ElectricBorder
              color="#4edea3"
              speed={0.85}
              chaos={0.08}
              borderRadius={16}
              active={isContactVisible}
              className="max-w-5xl mx-auto"
              style={{ width: '100%' }}
            >
            <div ref={contactBorderRef} className="glass-card p-8 md:p-12 rounded-lg w-full border-t-4 border-t-primary mx-auto text-left">
              <div className="text-center mb-10">
                <p className="font-label-code text-xs uppercase tracking-[0.28em] text-secondary mb-3">Professional Contact</p>
                <h2 className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">Let's <span className="text-primary">Collaborate</span></h2>
                <p className="text-on-surface-variant max-w-3xl mx-auto leading-relaxed">Open for backend development, web application projects, system integration, internships, freelance work, and professional opportunities. Use the channels below for clear, direct communication.</p>
              </div>
              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-10 items-start">
                <div>
                  <div className="grid sm:grid-cols-2 gap-4 text-left mb-8">
                    {contactLinks.map((item) => (
                      <a key={item.label} className="group rounded-3xl border border-glass-stroke bg-surface-container/50 p-5 transition-all hover:-translate-y-1 hover:border-primary/45 hover:bg-surface-container-high" href={item.href} target={item.href.startsWith('mailto:') ? undefined : '_blank'} rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}>
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 transition-colors ${item.iconWrapClass}`}>
                            {item.devicon ? <i className={`${item.devicon} ${item.iconClass} text-2xl`} /> : <span className={`material-symbols-outlined ${item.iconClass} text-2xl`}>{item.icon}</span>}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-on-surface-variant font-label-code uppercase tracking-[0.16em]">{item.label}</p>
                            <p className="font-bold break-words mt-1">{item.value}</p>
                            <p className="text-sm text-on-surface-variant leading-relaxed mt-2">{item.description}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-glass-stroke bg-surface-container/35 p-5 text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                      <div>
                        <p className="font-label-code text-xs uppercase tracking-[0.22em] text-secondary mb-2">Social Presence</p>
                        <p className="text-on-surface-variant text-sm leading-relaxed">Public channels for updates, learning content, and development activity.</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {socialLinks.map((item) => (
                          <a key={item.label} className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container border border-glass-stroke hover:bg-primary hover:text-on-primary hover:scale-110 transition-all shadow-lg" href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} title={item.label}>
                            {item.devicon ? <i className={`${item.devicon} text-2xl`} /> : <span className="material-symbols-outlined text-2xl">{item.icon}</span>}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-3xl border border-glass-stroke bg-surface-container/40 p-6 text-left">
                    <p className="font-label-code text-xs uppercase tracking-[0.22em] text-primary mb-4">Availability</p>
                    <div className="space-y-4 text-sm text-on-surface-variant">
                      <div className="flex gap-3"><span className="material-symbols-outlined text-secondary text-xl">verified</span><span>Open to professional opportunities and project-based collaboration.</span></div>
                      <div className="flex gap-3"><span className="material-symbols-outlined text-secondary text-xl">mail</span><span>Prefer email for formal briefs, requirements, and documentation.</span></div>
                      <div className="flex gap-3"><span className="material-symbols-outlined text-secondary text-xl">forum</span><span>Use WhatsApp for quick discussion or scheduling a follow-up.</span></div>
                    </div>
                  </div>
                  <div className="w-full h-[300px] md:h-[340px] rounded-3xl overflow-hidden border border-glass-stroke bg-transparent">
                  <Lanyard
                    position={[0, 0, 14]}
                    gravity={[0, -40, 0]}
                    fov={26}
                    transparent
                    fallback={<div className="w-full h-full rb-lanyard-skeleton" aria-hidden="true" />}
                  />
                  </div>
                </div>
              </div>
            </div>
            </ElectricBorder>
          </div>
        </section>
      </main>

      <aside
        id="global-music-player"
        className={`rb-music-panel ${musicOpen ? 'is-open' : 'is-closed'}`}
        aria-label="Global music player"
        aria-hidden={!musicOpen}
      >
          <div className="rb-music-panel-head">
            <p className="rb-music-panel-title">Music Player</p>
            <button
              type="button"
              className="rb-music-panel-close"
              onClick={() => setMusicOpen(false)}
              aria-label="Close music player"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <HomeMusicPlayer
            playRequest={musicPlayRequest}
            onTrackChange={handleTrackTitleChange}
            onTrackMetaChange={handleTrackMetaChange}
            onPlaybackChange={setMusicIsPlaying}
          />
      </aside>

      <footer className="rb-footer">
        <div className="rb-footer-shell px-margin-mobile md:px-margin-desktop">
          <div className="rb-footer-main">
            <div className="rb-footer-brand">
              <p className="rb-footer-name">Kurnia Hary Trisnandha</p>
              <p className="rb-footer-role">Backend Developer · Surabaya, Indonesia</p>
            </div>

            <nav className="rb-footer-links" aria-label="Footer links">
              {footerQuickLinks.map((item) => (
                <a key={item.label} className="rb-footer-link" href={item.href} target={item.href.startsWith('#') ? undefined : '_blank'} rel={item.href.startsWith('#') ? undefined : 'noreferrer'}>{item.label}</a>
              ))}
            </nav>
          </div>

          <div className="rb-footer-bottom">
            <p>© 2026 Kurnia Hary Trisnandha · Built with React + Vite</p>
            <a href="#home">Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
