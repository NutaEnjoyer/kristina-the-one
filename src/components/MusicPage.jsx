import { useState, useRef, useEffect } from 'react'
import './MusicPage.css'

export function MusicPage({ onBack }) {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  const musicList = [
    {
      id: 1,
      artist: 'Diplo feat. Trippie Redd',
      track: 'Wish',
      file: '/music/Diplo feat. Trippie Redd - Wish.mp3'
    },
    {
      id: 2,
      artist: 'NLE Choppa',
      track: 'Do It Again',
      file: '/music/Do it again.mp3'
    },
    {
      id: 3,
      artist: 'NLE Choppa',
      track: 'Drop Shit',
      file: '/music/NLE Choppa - Drop Shit (2).mp3'
    },
    {
      id: 4,
      artist: 'NLE Choppa',
      track: 'Lick Me Baby',
      file: '/music/NLE Choppa-Lick Me Baby (2).mp3'
    },
    {
      id: 5,
      artist: 'PAWSA, Adventures Of Stevie V',
      track: 'Dirty Cash (Money Talks)',
      file: '/music/PAWSA, Adventures Of Stevie V - Dirty Cash (Money Talks).mp3'
    },
    {
      id: 6,
      artist: 'ABBA',
      track: 'The Winner Takes It All',
      file: '/music/The Winner Takes It All - ABBA.mp3'
    },
    {
      id: 7,
      artist: 'Live Piano',
      track: 'Took Her To The O (Medley)',
      file: '/music/Took Her To The O (Live Piano Medley).mp3'
    }
  ]

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => handleNext()

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrack])

  const handleTrackClick = (track) => {
    setCurrentTrack(track)
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNext = () => {
    const currentIndex = musicList.findIndex(t => t.id === currentTrack?.id)
    const nextIndex = (currentIndex + 1) % musicList.length
    setCurrentTrack(musicList[nextIndex])
  }

  const handlePrev = () => {
    const currentIndex = musicList.findIndex(t => t.id === currentTrack?.id)
    const prevIndex = currentIndex === 0 ? musicList.length - 1 : currentIndex - 1
    setCurrentTrack(musicList[prevIndex])
  }

  const handleSeek = (e) => {
    const progressBar = e.currentTarget
    const clickX = e.nativeEvent.offsetX
    const width = progressBar.offsetWidth
    const newTime = (clickX / width) * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="music-page">
      <div className="music-container">
        <button className="back-btn" onClick={onBack}>
          ← Назад
        </button>

        <header className="music-header">
          <h1>Музыка</h1>
          <p>Треки, которые меня вдохновляют</p>
        </header>

        <div className="music-list">
          {musicList.map(item => (
            <div
              key={item.id}
              className={`music-item ${currentTrack?.id === item.id ? 'playing' : ''}`}
              onClick={() => handleTrackClick(item)}
            >
              <div className="music-content">
                <span className="music-track">{item.track}</span>
                <span className="music-artist">{item.artist}</span>
              </div>
              <span className="music-icon">
                {currentTrack?.id === item.id ? '⏸' : '▶'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {currentTrack && (
        <div className="fixed-player">
          <audio
            ref={audioRef}
            key={currentTrack.id}
            src={currentTrack.file}
          />

          <div className="fixed-player-content">
            <div className="player-track-info">
              <span className="player-artist-name">{currentTrack.artist}</span>
              <span className="player-track-name">{currentTrack.track}</span>
            </div>

            <div className="player-controls">
              <button className="control-btn prev" onClick={handlePrev}>
                ⏮
              </button>

              <button className="control-btn play-pause" onClick={handlePlayPause}>
                {isPlaying ? '⏸' : '▶'}
              </button>

              <button className="control-btn next" onClick={handleNext}>
                ⏭
              </button>
            </div>

            <div className="player-progress">
              <span className="time-current">{formatTime(currentTime)}</span>
              <div className="progress-bar" onClick={handleSeek}>
                <div
                  className="progress-fill"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="time-duration">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
