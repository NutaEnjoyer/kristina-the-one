import './Snowflakes.css'

// Компонент создаёт падающие снежинки
function Snowflakes() {
  // Создаем массив снежинок один раз при рендере
  const snowflakes = Array.from({ length: 15 }, (_, i) => {
    const randomX = Math.random() * 100
    const randomDuration = 8 + Math.random() * 7 // 8-15 секунд
    const randomDelay = -(Math.random() * 15) // отрицательная задержка для старта с разных позиций
    const randomSize = 12 + Math.random() * 16
    const randomOpacity = 0.3 + Math.random() * 0.3
    const symbol = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)]
    const randomDrift = (Math.random() - 0.5) * 100

    return {
      id: i,
      style: {
        left: `${randomX}%`,
        fontSize: `${randomSize}px`,
        animationDuration: `${randomDuration}s`,
        animationDelay: `${randomDelay}s`,
        '--drift': `${randomDrift}px`,
        '--opacity': randomOpacity
      },
      symbol
    }
  })

  return (
    <div className="snowflakes-container">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={flake.style}
        >
          {flake.symbol}
        </div>
      ))}
    </div>
  )
}

export default Snowflakes
