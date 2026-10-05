import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/bebas-neue/latin-400.css'
import '@fontsource/bebas-neue/latin-ext-400.css'
import '@fontsource/rajdhani/latin-500.css'
import '@fontsource/rajdhani/latin-ext-500.css'
import '@fontsource/rajdhani/latin-700.css'
import '@fontsource/rajdhani/latin-ext-700.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-ext-600.css'
import './index.css'
import { parseEnv } from './lib/env'
import { ConfigErrorScreen } from './components/ConfigErrorScreen'

const root = createRoot(document.getElementById('root')!)
const envResult = parseEnv()

if (!envResult.ok) {
  root.render(<ConfigErrorScreen errors={envResult.errors} />)
} else {
  // Import dynamiczny: klient Supabase powstaje dopiero przy poprawnej konfiguracji.
  void import('./AppRoot').then(({ App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
}
