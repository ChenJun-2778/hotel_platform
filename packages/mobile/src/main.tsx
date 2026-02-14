import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // 只保留这一个全局重置
import { createRoot } from 'react-dom/client' 
import { unstableSetRender } from 'antd-mobile'

unstableSetRender((node, container) => {
  // 强制把容器转为 any 类型，防止 TS 报错说没有 _reactRoot 属性
  const c = container as any
  c._reactRoot ||= createRoot(container)
  const root = c._reactRoot
  root.render(node)
  
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
    root.unmount()
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)