import { useState } from 'react'
import App from './App'
import { Docs } from './pages/Docs'
import { useKV } from '@github/spark/hooks'

export function AppRouter() {
  const [route, setRoute] = useKV<string>('app-route', 'app')
  
  if (route === 'docs') {
    return <Docs onBackToApp={() => setRoute('app')} />
  }
  
  return <App onNavigateToDocs={() => setRoute('docs')} />
}
