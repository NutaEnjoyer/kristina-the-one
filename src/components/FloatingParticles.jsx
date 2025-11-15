import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './FloatingParticles.css'

// Компонент создаёт плавающие частицы на фоне
function FloatingParticles() {
  const particlesCount = 30
  const particles = Array.from({ length: particlesCount })

  return (
    <div className="floating-particles">
      {particles.map((_, i) => (
        <Particle key={i} index={i} />
      ))}
    </div>
  )
}

function Particle({ index }) {
  // Рандомные параметры для каждой частицы
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomDelay = Math.random() * 5
  const randomDuration = 10 + Math.random() * 20
  const randomSize = 2 + Math.random() * 4

  return (
    <motion.div
      className="particle"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
      }}
      animate={{
        y: [0, -100, 0],
        x: [0, Math.random() * 50 - 25, 0],
        opacity: [0.2, 0.8, 0.2],
        scale: [1, 1.5, 1]
      }}
      transition={{
        duration: randomDuration,
        repeat: Infinity,
        delay: randomDelay,
        ease: "easeInOut"
      }}
    />
  )
}

export default FloatingParticles
