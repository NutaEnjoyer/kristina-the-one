import { motion } from 'framer-motion'
import './ChristmasLights.css'

// Компонент создаёт новогоднюю гирлянду вверху экрана
function ChristmasLights() {
  const lightsCount = 20
  const lights = Array.from({ length: lightsCount })

  return (
    <div className="christmas-lights">
      {/* Провод гирлянды */}
      <svg className="lights-wire" viewBox="0 0 1000 100" preserveAspectRatio="none">
        <path
          d="M 0,30 Q 50,10 100,30 T 200,30 T 300,30 T 400,30 T 500,30 T 600,30 T 700,30 T 800,30 T 900,30 T 1000,30"
          fill="none"
          stroke="rgba(100, 100, 100, 0.3)"
          strokeWidth="2"
        />
      </svg>

      {/* Елочки по краям */}
      <div className="tree tree-left">🎄</div>
      <div className="tree tree-right">🎄</div>

      {/* Лампочки */}
      {lights.map((_, i) => (
        <Light key={i} index={i} total={lightsCount} />
      ))}
    </div>
  )
}

function Light({ index, total }) {
  // Позиция лампочки по горизонтали
  const position = (index / (total - 1)) * 100

  // Цвета лампочек (чередуются)
  const colors = [
    '#ff4444', // красный
    '#ffaa00', // оранжевый
    '#44ff44', // зеленый
    '#4444ff', // синий
    '#ff44ff', // фиолетовый
    '#ffff44', // желтый
  ]
  const color = colors[index % colors.length]

  // Случайная задержка для мигания
  const delay = Math.random() * 2

  return (
    <motion.div
      className="light"
      style={{
        left: `${position}%`,
      }}
    >
      {/* Лампочка */}
      <motion.div
        className="light-bulb"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
        }}
        animate={{
          opacity: [1, 0.3, 1],
          scale: [1, 0.95, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: delay,
          ease: "easeInOut"
        }}
      />
      {/* Свечение */}
      <motion.div
        className="light-glow"
        style={{
          backgroundColor: color,
        }}
        animate={{
          opacity: [0.3, 0.1, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: delay,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

export default ChristmasLights
