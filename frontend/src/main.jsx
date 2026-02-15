/**
 * Main entry point for News-Mania frontend.
 * Purpose: Renders the React application into the DOM and imports global styles.
 * Used to bootstrap the single-page application.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

