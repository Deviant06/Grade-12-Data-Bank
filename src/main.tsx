import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { Toaster } from './components/ui/sonner'
import { FUTURE_FLAGS } from '@remix-run/router'

// Enable v7 features
FUTURE_FLAGS.v7_startTransition = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
)
