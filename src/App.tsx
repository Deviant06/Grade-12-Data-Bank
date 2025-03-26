import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Students from './pages/Students'
import Import from './pages/Import'
import Reports from './pages/Reports'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/students" replace />} />
        <Route path="/students" element={<Students />} />
        <Route path="/import" element={<Import />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  )
}

export default App
