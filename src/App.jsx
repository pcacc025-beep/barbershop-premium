import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import AdminPanel from './components/AdminPanel'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  )
}
