import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import '@fontsource/manrope/latin-400.css'
import { App } from './App'
import './styles.css'
import './layout.css'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
