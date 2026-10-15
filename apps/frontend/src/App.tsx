import { Link, NavLink, Route, Routes } from 'react-router'
import { Card } from '@repo/ui'
import { Counter } from './components/counter'
import { ApiStatus } from './components/api-status'

export function App() {
  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header>
        <Link className="brand" to="/">
          <span className="brand-icon">c</span>codebalt
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            Overview
          </NavLink>
          <NavLink to="/playground">Playground</NavLink>
        </nav>
        <span className="workspace-label">Your workspace</span>
      </header>
      <main id="main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <p className="eyebrow">A fresh start</p>
                <h1>Ready for your next idea.</h1>
                <p className="intro">
                  React on the frontend. Go on the backend. One workspace to
                  build from.
                </p>
                <div className="grid">
                  <Counter />
                  <ApiStatus />
                </div>
                <section className="stack" aria-label="Workspace stack">
                  <span>Bun</span>
                  <span>Turborepo</span>
                  <span>Vite + React</span>
                  <span>React Router</span>
                  <span>Zustand</span>
                  <span>Go</span>
                  <span>Oxlint</span>
                </section>
              </>
            }
          />
          <Route
            path="/playground"
            element={
              <>
                <p className="eyebrow">Playground</p>
                <h1>A little state goes a long way.</h1>
                <p className="intro">
                  The counter keeps its value as you move between pages.
                  Refreshing starts a new session.
                </p>
                <Counter />
              </>
            }
          />
          <Route
            path="*"
            element={
              <Card
                title="Page not found"
                description="This route does not exist."
              >
                <Link to="/">Back to overview</Link>
              </Card>
            }
          />
        </Routes>
      </main>
      <footer>
        Codebalt <span>Built to make room for what comes next.</span>
      </footer>
    </div>
  )
}
