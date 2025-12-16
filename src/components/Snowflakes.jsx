import { motion } from 'framer-motion'
import './Snowflakes.css'

// Компонент создаёт падающие снежинки
function Snowflakes() {
  const snowflakesCount = 20
  const snowflakes = Array.from({ length: snowflakesCount })

  return (
    <div className="snowflakes-container">
      {snowflakes.map((_, i) => (
        <Snowflake key={i} index={i} />
      ))}
    </div>
  )
}

function Snowflake({ index }) {
  // Рандомные параметры для каждой снежинки
  const randomX = Math.random() * 100
  const randomDelay = Math.random() * 5
  const randomDuration = 5 + Math.random() * 10
  const randomSize = 12 + Math.random() * 16
  const randomOpacity = 0.3 + Math.random() * 0.3

  // Случайный символ снежинки
  const snowflakeSymbols = ['❄', '❅', '❆']
  const symbol = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)]

  return (
    <motion.div
      className="snowflake"
      style={{
        left: `${randomX}%`,
        fontSize: `${randomSize}px`,
        opacity: randomOpacity,
      }}
      initial={{ y: -20, x: 0 }}
      animate={{
        y: typeof window !== 'undefined' ? window.innerHeight + 20 : 1000,
        x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: randomDuration,
        repeat: Infinity,
        repeatType: "loop",
        delay: randomDelay,
        ease: "linear",
        x: {
          duration: randomDuration / 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut"
        },
        rotate: {
          duration: randomDuration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear"
        }
      }}
    >
      {symbol}
    </motion.div>
  )
}

export default Snowflakes
