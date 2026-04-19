import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function DashboardCoach() {
  const [athletes, setAthletes] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [newAthlete, setNewAthlete] = useState({ name: '', email: '', team: '' })
  const [stats, setStats] = useState({ total: 0, active: 0, newThisWeek: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('kura_token')
    const user = localStorage.getItem('kura_user')
    
    if (!token || !user) {
      navigate('/sign-in')
      return
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setCurrentUser(data.user)
        fetchAthletes(token)
      } else {
        localStorage.removeItem('kura_token')
        localStorage.removeItem('kura_user')
        navigate('/sign-in')
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      navigate('/sign-in')
    } finally {
      setLoading(false)
    }
  }

  const fetchAthletes = async (token) => {
    try {
      const res = await fetch('/api/coach/athletes', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setAthletes(data.athletes || [])
      
      // Calculate stats
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      setStats({
        total: data.athletes.length,
        active: data.athletes.filter(a => a.status === 'active').length,
        newThisWeek: data.athletes.filter(a => new Date(a.created_at) > weekAgo).length
      })
    } catch (err) {
      console.error('Failed to fetch athletes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const token = localStorage.getItem('kura_token')
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    } catch (err) {
      console.error('Sign out failed:', err)
    } finally {
      localStorage.removeItem('kura_token')
      localStorage.removeItem('kura_user')
      navigate('/sign-in')
    }
  }

  const handleAddAthlete = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('kura_token')
    
    try {
      const res = await fetch('/api/coach/athletes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAthlete)
      })
      if (res.ok) {
        setNewAthlete({ name: '', email: '', team: '' })
        fetchAthletes(token)
      }
    } catch (err) {
      console.error('Failed to add athlete:', err)
    }
  }

  const handleUpdateStatus = async (athleteId, newStatus, token) => {
    try {
      const res = await fetch(`/api/coach/athletes/${athleteId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchAthletes(token)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleDeleteAthlete = async (athleteId, token) => {
    if (!confirm('Are you sure you want to remove this athlete?')) return
    
    try {
      const res = await fetch(`/api/coach/athletes/${athleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchAthletes(token)
      }
    } catch (err) {
      console.error('Failed to delete athlete:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const token = localStorage.getItem('kura_token')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kura Coach</h1>
            <p className="text-sm text-gray-600">Coach Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{currentUser?.name}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Athletes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">New This Week</p>
                <p className="text-3xl font-bold text-purple-600">{stats.newThisWeek}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Add Athlete Form */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Add Athlete</h2>
            <form onSubmit={handleAddAthlete} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newAthlete.name}
                  onChange={(e) => setNewAthlete({ ...newAthlete, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newAthlete.email}
                  onChange={(e) => setNewAthlete({ ...newAthlete, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="athlete@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team
                </label>
                <input
                  type="text"
                  value={newAthlete.team}
                  onChange={(e) => setNewAthlete({ ...newAthlete, team: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Team A"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Athlete
              </button>
            </form>
          </div>

          {/* Athletes List */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Athletes</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : athletes.length === 0 ? (
              <p className="text-gray-500">No athletes yet. Add one!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Team</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {athletes.map((athlete) => (
                      <tr key={athlete.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{athlete.name}</p>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{athlete.email || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{athlete.team || '-'}</td>
                        <td className="py-3 px-4">
                          <select
                            value={athlete.status || 'active'}
                            onChange={(e) => handleUpdateStatus(athlete.id, e.target.value, token)}
                            className={`text-sm px-2 py-1 rounded-full border-0 font-medium ${
                              athlete.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : athlete.status === 'inactive'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteAthlete(athlete.id, token)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardCoach
