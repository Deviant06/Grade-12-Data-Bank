import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Students from './pages/Students'
import Import from './pages/Import'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Students />} />
        <Route path="/students" element={<Students />} />
        <Route path="/import" element={<Import />} />
      </Routes>
    </Router>
  )
}

export default App
