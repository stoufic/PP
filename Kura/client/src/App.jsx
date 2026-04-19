import { Routes, Route } from 'react-router-dom'
import DashboardParent from './pages/DashboardParent.jsx'
import DashboardCoach from './pages/DashboardCoach.jsx'
import DashboardAdmin from './pages/DashboardAdmin.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<DashboardParent />} />
        <Route path="/dashboard/parent" element={<DashboardParent />} />
        <Route path="/dashboard/coach" element={<DashboardCoach />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </div>
  )
}

export default App
