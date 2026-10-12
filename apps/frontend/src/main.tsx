import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Signin from './Signin'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Signin />
  </StrictMode>,
)
