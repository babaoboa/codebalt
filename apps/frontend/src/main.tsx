import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Signin from './Signin'
import Backend from './Backend'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Signin />
  </StrictMode>,
)
