import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { SplashScreen } from '@/components/brand/SplashScreen'
import { AppProviders } from './providers'
import { AppRouter } from './router'

export function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <>
      <AnimatePresence mode="wait">
        {!splashDone ? <SplashScreen key="splash" onFinish={() => setSplashDone(true)} /> : null}
      </AnimatePresence>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </>
  )
}
