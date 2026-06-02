import { useEffect, useMemo, useRef, useState } from 'react'

const tracks = [
  {
    id: 'rk-1',
    title: 'Driving Ambition',
    artist: 'SoundHelix',
    mood: 'Modern Rock',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    license: 'https://www.soundhelix.com/audio-examples',
  },
  {
    id: 'rk-2',
    title: 'Tech Future Bass',
    artist: 'SoundHelix',
    mood: 'Electro Rock',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    license: 'https://www.soundhelix.com/audio-examples',
  },
  {
    id: 'rk-3',
    title: 'Power Hit',
    artist: 'SoundHelix',
    mood: 'Alt Energy',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    license: 'https://www.soundhelix.com/audio-examples',
  },
  {
    id: 'rk-4',
    title: 'Codebreaker Run',
    artist: 'SoundHelix',
    mood: 'Industrial Rock',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    license: 'https://www.soundhelix.com/audio-examples',
  },
  {
    id: 'rk-5',
    title: 'Steel Horizon',
    artist: 'SoundHelix',
    mood: 'Heavy Alt',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    license: 'https://www.soundhelix.com/audio-examples',
  },
  {
    id: 'rk-6',
    title: 'Final Overdrive',
    artist: 'SoundHelix',
    mood: 'High Energy',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    license: 'https://www.soundhelix.com/audio-examples',
  },
]

const formatTime = (seconds) => {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const mins = Math.floor(value / 60)
  const secs = value % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export default function HomeMusicPlayer({ playRequest = 0, onTrackChange, onTrackMetaChange, onPlaybackChange }) {
  const audioRef = useRef(null)
  const [activeTrackId, setActiveTrackId] = useState(tracks[0].id)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const activeTrack = useMemo(() => tracks.find((track) => track.id === activeTrackId) || tracks[0], [activeTrackId])
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

  useEffect(() => {
    onTrackChange?.(activeTrack.title)
    onTrackMetaChange?.({
      title: activeTrack.title,
      artist: activeTrack.artist,
      mood: activeTrack.mood,
    })
  }, [activeTrack.artist, activeTrack.mood, activeTrack.title, onTrackChange, onTrackMetaChange])

  useEffect(() => {
    onPlaybackChange?.(isPlaying)
  }, [isPlaying, onPlaybackChange])

  useEffect(() => {
    if (playRequest === 0) return

    const startTrack = tracks[0]
    setActiveTrackId(startTrack.id)
    setCurrentTime(0)

    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }

    play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playRequest])

  const play = async () => {
    if (!audioRef.current) return
    try {
      await audioRef.current.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const pause = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
  }

  const moveTrack = (offset) => {
    const currentIndex = tracks.findIndex((track) => track.id === activeTrackId)
    const nextIndex = (currentIndex + offset + tracks.length) % tracks.length
    setActiveTrackId(tracks[nextIndex].id)
    setCurrentTime(0)
  }

  const selectTrack = (trackId) => {
    if (trackId === activeTrackId) return
    setActiveTrackId(trackId)
    setCurrentTime(0)
  }

  useEffect(() => {
    if (!isPlaying || !audioRef.current) return
    audioRef.current.play().catch(() => setIsPlaying(false))
  }, [activeTrackId, isPlaying])

  return (
    <section className="rb-music-card" aria-label="Home music player">
      <div className="rb-music-head">
        <p className="rb-music-kicker">Kingslayer Vibe (Legal)</p>
        <h3 className="rb-music-title">Rock Focus Playlist</h3>
      </div>

      <div className="rb-music-body">
        <p className="rb-music-track">{activeTrack.title}</p>
        <p className="rb-music-meta">{activeTrack.artist} • {activeTrack.mood}</p>

        <div className="rb-music-progress" aria-label="Track progress">
          <div className="rb-music-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <div className="rb-music-time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="rb-music-controls">
          <button type="button" className="rb-music-btn" onClick={() => moveTrack(-1)} aria-label="Previous track">Prev</button>
          {isPlaying ? (
            <button type="button" className="rb-music-btn rb-music-btn-primary" onClick={pause} aria-label="Pause">Pause</button>
          ) : (
            <button type="button" className="rb-music-btn rb-music-btn-primary" onClick={play} aria-label="Play">Play</button>
          )}
          <button type="button" className="rb-music-btn" onClick={() => moveTrack(1)} aria-label="Next track">Next</button>
        </div>

        <div className="rb-music-playlist" aria-label="Playlist tracks">
          {tracks.map((track) => (
            <button
              key={track.id}
              type="button"
              className={`rb-music-item ${track.id === activeTrackId ? 'is-active' : ''}`}
              onClick={() => selectTrack(track.id)}
              aria-label={`Play ${track.title}`}
            >
              <span className="rb-music-item-title">{track.title}</span>
              <span className="rb-music-item-meta">{track.artist} • {track.mood}</span>
            </button>
          ))}
        </div>

        <a className="rb-music-license" href={activeTrack.license} target="_blank" rel="noreferrer">Music license source</a>
      </div>

      <audio
        ref={audioRef}
        src={activeTrack.src}
        preload="none"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onEnded={() => moveTrack(1)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </section>
  )
}
