import { BrowserRouter as Router, Routes, Route, Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Students from './pages/Students'
import Import from './pages/Import'
import Reports from './pages/Reports'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Students />
  },
  {
    path: "/students",
    element: <Students />
  },
  {
    path: "/import",
    element: <Import />
  },
  {
    path: "/reports",
    element: <Reports />
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
