import { useState, useEffect } from 'react'

const LoadingScreen = ({ onSkip }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 3 + 1
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onSkip()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [progress, onSkip])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-midnight overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-noir to-blood-dark/30" />

      {/* Blood drip lines */}
      <div className="absolute top-0 left-[15%] w-[3px] h-[120px] bg-gradient-to-b from-blood via-blood-light to-transparent"
        style={{ transform: `scaleY(${Math.min(progress * 1.2 / 120, 1)})`, transformOrigin: 'top', transition: 'transform 0.3s' }} />
      <div className="absolute top-0 left-[85%] w-[3px] h-[80px] bg-gradient-to-b from-blood via-blood-light to-transparent"
        style={{ transform: `scaleY(${Math.min(progress * 0.8 / 80, 1)})`, transformOrigin: 'top', transition: 'transform 0.3s' }} />

      {/* Central content */}
      <div className="relative z-10 text-center">
        {/* Icon */}
        <div className="relative inline-block mb-8">
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            <span className="text-5xl md:text-6xl filter drop-shadow-lg">🔍</span>
          </div>
        </div>

        {/* Main title */}
        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold mb-2 tracking-tight">
          <span className="text-gradient-blood">PRISMA</span>
        </h1>

        {/* Tagline */}
        <p className="font-heading text-xl md:text-2xl text-gold italic mb-8">
          #TheMysteryUnfolds
        </p>

        {/* Crime tape */}
        <div className="crime-tape text-midnight text-xs md:text-sm inline-block mb-10">
          ⚠ INVESTIGATION IN PROGRESS ⚠
        </div>

        {/* Progress bar */}
        <div className="w-72 md:w-96 mx-auto">
          <div className="flex justify-between text-xs font-mono text-fog-light mb-3 tracking-widest">
            <span>LOADING EVIDENCE</span>
            <span>{Math.min(Math.round(progress), 100)}%</span>
          </div>

          <div className="h-2 bg-noir-lighter rounded-full overflow-hidden relative">
            <div
              className="h-full w-full gradient-blood rounded-full"
              style={{ transform: `scaleX(${Math.min(progress, 100) / 100})`, transformOrigin: 'left', transition: 'transform 0.3s' }}
            />
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-blood/40" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-blood/40" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-gold/30" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-gold/30" />
    </div>
  )
}

export default LoadingScreen

