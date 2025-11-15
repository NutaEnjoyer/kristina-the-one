import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './MusicPlayer.css'

// Компонент музыкального плеера
// ВАЖНО: Добавь свой аудио-файл в папку /public/music.mp3
function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="music-player">
      <motion.button
        className="music-toggle"
        onClick={toggleMusic}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.span
              key="playing"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              🎵
            </motion.span>
          ) : (
            <motion.span
              key="paused"
              initial={{ opacity: 0, rotate: 180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -180 }}
              transition={{ duration: 0.3 }}
            >
              🎵
            </motion.span>
          )}
        </AnimatePresence>

        {/* Пульсирующие волны при воспроизведении */}
        {isPlaying && (
          <>
            <motion.div
              className="music-wave"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="music-wave"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </motion.button>

      {/* Аудио элемент */}
      <audio
        ref={audioRef}
        loop
        onEnded={() => setIsPlaying(false)}
      >
        {/*
          ИНСТРУКЦИЯ: Замени на свой аудио-файл
          Положи файл в папку /public/music.mp3
          Или используй ссылку на онлайн-источник
        */}
        <source src="/music.mp3" type="audio/mpeg" />
        {/* Запасной вариант - тихая ambient музыка через внешний источник */}
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>
    </div>
  )
}

export default MusicPlayer
