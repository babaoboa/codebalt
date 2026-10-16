import { Navigate, Route, Routes } from 'react-router'

export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <main>
            <h1>Codebalt</h1>
          </main>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
