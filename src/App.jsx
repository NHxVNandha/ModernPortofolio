import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TrueFocus from './components/TrueFocus.jsx'
import ElectricBorder from './components/ElectricBorder.jsx'
import TargetCursor from './components/TargetCursor.jsx'
import Dock from './components/Dock.jsx'
import Lanyard from './components/Lanyard.jsx'
import GitHubCommitChart from './components/GitHubCommitChart.jsx'
import HomeMusicPlayer from './components/HomeMusicPlayer.jsx'

const GITHUB_USERNAME = 'NHxVNandha'
const GITHUB_REFRESH_INTERVAL = 60000
const GITHUB_SNAKE_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}/output/github-contribution-grid-snake-dark.svg`
const CONTRIBUTION_YEARS_TO_SHOW = 3

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
  const [activeDockSection, setActiveDockSection] = useState('home')
  const [isContactVisible, setIsContactVisible] = useState(false)
  const [githubRepos, setGithubRepos] = useState([])
  const [githubEvents, setGithubEvents] = useState([])
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
    const sectionIds = ['home', 'about', 'skills', 'experience', 'education', 'projects', 'contact']
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    const dockSections = ['home', 'skills', 'education', 'projects', 'contact'].map((id) => document.getElementById(id)).filter(Boolean)

    const updateActiveSection = () => {
      const viewportAnchor = window.scrollY + window.innerHeight * 0.33
      let currentId = 'home'
      let currentDockId = 'home'

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY
        if (sectionTop <= viewportAnchor) {
          currentId = section.id
        }
      })

      dockSections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY
        if (sectionTop <= viewportAnchor) {
          currentDockId = section.id
        }
      })

      setActiveSection((prev) => (prev === currentId ? prev : currentId))
      setActiveDockSection((prev) => (prev === currentDockId ? prev : currentDockId))
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
        const [reposResponse, eventsResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=8`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`),
        ])

        if (!reposResponse.ok || !eventsResponse.ok) {
          throw new Error('GitHub API request failed')
        }

        const [reposData, eventsData] = await Promise.all([
          reposResponse.json(),
          eventsResponse.json(),
        ])

        if (ignore) return

        setGithubRepos(reposData.filter((repo) => !repo.fork))
        setGithubEvents(eventsData)
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

  const jumpTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const mobileDockItems = [
    { icon: <span className="material-symbols-outlined text-[20px]">home</span>, label: 'Home', onClick: () => jumpTo('home'), className: activeDockSection === 'home' ? 'rb-dock-active' : '' },
    { icon: <span className="material-symbols-outlined text-[20px]">auto_awesome</span>, label: 'Skills', onClick: () => jumpTo('skills'), className: activeDockSection === 'skills' ? 'rb-dock-active' : '' },
    { icon: <span className="material-symbols-outlined text-[20px]">school</span>, label: 'Education', onClick: () => jumpTo('education'), className: activeDockSection === 'education' ? 'rb-dock-active' : '' },
    { icon: <span className="material-symbols-outlined text-[20px]">work</span>, label: 'Projects', onClick: () => jumpTo('projects'), className: activeDockSection === 'projects' ? 'rb-dock-active' : '' },
    { icon: <span className="material-symbols-outlined text-[20px]">mail</span>, label: 'Contact', onClick: () => jumpTo('contact'), className: activeDockSection === 'contact' ? 'rb-dock-active' : '' },
  ]

  const projectRepos = githubRepos.slice(0, 6)
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
          <div className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">Kurnia Hary</div>
          <div className="hidden md:flex items-center gap-gutter font-body-md text-body-md">
            <a className={navClass('home')} href="#home">Home</a>
            <a className={navClass('skills')} href="#skills">Skills</a>
            <a className={navClass('experience')} href="#experience">Experience</a>
            <a className={navClass('projects')} href="#projects">Projects</a>
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
              <a className={activeSection === 'home' ? 'text-primary font-bold' : 'text-on-surface-variant'} href="#home" onClick={() => setMenuOpen(false)}>Home</a>
              <a className={activeSection === 'skills' ? 'text-primary font-bold' : 'text-on-surface-variant'} href="#skills" onClick={() => setMenuOpen(false)}>Skills</a>
              <a className={activeSection === 'experience' || activeSection === 'education' ? 'text-primary font-bold' : 'text-on-surface-variant'} href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
              <a className={activeSection === 'projects' ? 'text-primary font-bold' : 'text-on-surface-variant'} href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
              <a className={activeSection === 'contact' ? 'text-primary font-bold' : 'text-on-surface-variant'} href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
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
        <section className="min-h-screen px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto py-20 overflow-x-clip rb-reveal rb-home" id="home">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
            <div className="space-y-6 md:-mt-6 rb-profile-card">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-code text-label-code">
                <span className="mr-2">Available for projects</span>
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              </div>
              <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-surface rb-gradient-text">Kurnia Hary <span className="text-primary">Trisnandha</span></h1>
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
              <div className="flex flex-wrap gap-4 pt-4">
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
              <div className="home-tech-marquee pt-10">
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

        <section className="py-14 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto scroll-mt-24" id="skills">
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

        <section className="py-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto rb-reveal rb-experience" id="experience">
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
                    <p className="mt-6 text-on-surface-variant font-body-md text-sm text-justify leading-relaxed">Professional certifications that validate hands-on capability in digital marketing, technical support, backend development, database systems, and network infrastructure.</p>
                  </div>
                  <div className="relative border-l-2 border-glass-stroke ml-4">
                    <div className="mb-6 relative">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-secondary rounded-full ring-4 ring-secondary/20" />
                      <div className="pl-12">
                        <div className="glass-card p-6 rounded-lg flex gap-6 items-center hover:bg-surface-container-high transition-colors rb-target-card rb-target-cert"><div className="w-14 h-14 rounded-xl bg-white/5 border border-glass-stroke flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-secondary text-3xl">verified</span></div><div><h4 className="font-body-lg font-bold">BNSP - Digital Marketing</h4><p className="text-on-surface-variant text-sm">Professional certification in digital strategy and market analysis.</p></div></div>
                      </div>
                    </div>
                    <div className="mb-6 relative">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20" />
                      <div className="pl-12">
                        <div className="glass-card p-6 rounded-lg flex gap-6 items-center hover:bg-surface-container-high transition-colors rb-target-card rb-target-cert"><div className="w-14 h-14 rounded-xl bg-white/5 border border-glass-stroke flex items-center justify-center shrink-0"><i className="devicon-google-plain text-3xl text-secondary" /></div><div><h4 className="font-body-lg font-bold">Google Technical Support</h4><p className="text-on-surface-variant text-sm">Coursera IT Support Professional Certificate covering troubleshooting.</p></div></div>
                      </div>
                    </div>
                    <div className="mb-6 relative">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-tertiary rounded-full ring-4 ring-tertiary/20" />
                      <div className="pl-12">
                        <div className="glass-card p-6 rounded-lg flex gap-6 items-center hover:bg-surface-container-high transition-colors rb-target-card rb-target-cert"><div className="w-14 h-14 rounded-xl bg-white/5 border border-glass-stroke flex items-center justify-center shrink-0"><i className="devicon-linkedin-plain text-3xl text-secondary" /></div><div><h4 className="font-body-lg font-bold">LinkedIn Learning Path</h4><p className="text-on-surface-variant text-sm">Advanced training in ASP.NET Core and SQL Server.</p></div></div>
                      </div>
                    </div>
                    <div className="mb-2 relative">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-secondary rounded-full ring-4 ring-secondary/20" />
                      <div className="pl-12">
                        <div className="glass-card p-6 rounded-lg flex gap-6 items-center hover:bg-surface-container-high transition-colors rb-target-card rb-target-cert"><div className="w-14 h-14 rounded-xl bg-white/5 border border-glass-stroke flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-secondary text-3xl">router</span></div><div><h4 className="font-body-lg font-bold">MTCNA & Cisco Networking</h4><p className="text-on-surface-variant text-sm">Proficiency in Mikrotik and Cisco routing standards.</p></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-surface-container rb-reveal rb-projects rb-spotlight" id="projects" onMouseMove={spotlightMove}>
          <div className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
              <div className="relative">
                <h2 className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">GitHub <span className="text-secondary">Projects</span></h2>
                <div className="w-20 h-1 bg-secondary rounded-full" />
                <p className="mt-6 text-on-surface-variant max-w-3xl font-body-md text-sm text-justify leading-relaxed">Repository data is synced directly from GitHub, so new projects, stars, forks, languages, commits, and public activity update automatically.</p>
              </div>
              <div className="grid grid-cols-3 gap-3 min-w-full lg:min-w-[360px]">
                <div className="github-stat-card"><span>{githubRepos.length}</span><p>Repos</p></div>
                <div className="github-stat-card"><span>{githubStats.stars}</span><p>Stars</p></div>
                <div className="github-stat-card"><span>{githubStats.languages.size}</span><p>Languages</p></div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-label-code text-xs"><span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />Auto-refresh 60s</span>
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
                    return (
                      <a key={repo.id} className={`github-project-card rb-target-card ${index === 0 ? 'md:col-span-2' : ''}`} href={repo.html_url} target="_blank" rel="noreferrer">
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
                      </a>
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



        <section className="py-20 bg-surface-deep rb-reveal rb-contact" id="contact">
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
                <h2 className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">Let's <span className="text-primary">Collaborate</span></h2>
                <p className="text-on-surface-variant max-w-3xl mx-auto">I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
                <div className="md:pt-1">
                  <div className="grid grid-cols-1 gap-4 text-left mb-8">
                    <a className="flex items-center gap-4 group" href="mailto:contact@kurniahary.com">
                      <div className="w-14 h-14 rounded-xl bg-surface-container border border-glass-stroke flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all shadow-md">
                        <span className="material-symbols-outlined text-primary text-3xl">alternate_email</span>
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant font-label-code">Email Me</p>
                        <p className="font-bold break-all">contact@kurniahary.com</p>
                      </div>
                    </a>

                    <a className="flex items-center gap-4 group" href="#">
                      <div className="w-14 h-14 rounded-xl bg-surface-container border border-glass-stroke flex items-center justify-center group-hover:bg-secondary/20 group-hover:scale-110 transition-all shadow-md">
                        <span className="material-symbols-outlined text-secondary text-3xl">chat_bubble</span>
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant font-label-code">WhatsApp</p>
                        <p className="font-bold">+62 822 XXX XXX</p>
                      </div>
                    </a>
                  </div>

                  <div className="flex gap-6">
                    <a className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container border border-glass-stroke hover:bg-primary hover:text-on-primary hover:scale-110 transition-all shadow-lg" href="#" aria-label="GitHub">
                      <i className="devicon-github-original text-2xl" />
                    </a>
                    <a className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container border border-glass-stroke hover:bg-primary hover:text-on-primary hover:scale-110 transition-all shadow-lg" href="#" aria-label="LinkedIn">
                      <i className="devicon-linkedin-plain text-2xl" />
                    </a>
                    <a className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container border border-glass-stroke hover:bg-primary hover:text-on-primary hover:scale-110 transition-all shadow-lg" href="#" aria-label="Portfolio">
                      <span className="material-symbols-outlined text-2xl">person_search</span>
                    </a>
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

      <footer className="w-full py-20 bg-surface-deep border-t border-glass-stroke"><div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-gutter w-full max-w-7xl mx-auto"><div className="font-headline-md text-headline-md font-bold text-on-surface">Kurnia Hary</div><p className="font-body-md text-body-md text-on-surface-variant">© 2024 Kurnia Hary Trisnandha. All rights reserved.</p><div className="flex gap-6 font-body-md text-body-md"><a className="text-on-surface-variant hover:text-secondary" href="#">Github</a><a className="text-on-surface-variant hover:text-secondary" href="#">LinkedIn</a><a className="text-on-surface-variant hover:text-secondary" href="#">Source Code</a></div></div></footer>
    </div>
  )
}

export default App
