import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // 只保留这一个全局重置

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)