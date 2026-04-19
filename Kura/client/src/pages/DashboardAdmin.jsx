import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function DashboardAdmin() {
  const [users, setUsers] = useState([])
  const [athletes, setAthletes] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [systemStats, setSystemStats] = useState({})
  const [activeTab, setActiveTab] = useState('overview')
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
        fetchAdminData(token)
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

  const fetchAdminData = async (token) => {
    try {
      const [usersRes, athletesRes, statsRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/athletes', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } })
      ])
      
      const usersData = await usersRes.json()
      const athletesData = await athletesRes.json()
      const statsData = await statsRes.json()
      
      setUsers(usersData.users || [])
      setAthletes(athletesData.athletes || [])
      setSystemStats(statsData.stats || {})
    } catch (err) {
      console.error('Failed to fetch admin data:', err)
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

  const handleDeleteUser = async (userId, token) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchAdminData(token)
      }
    } catch (err) {
      console.error('Failed to delete user:', err)
    }
  }

  const handleToggleUserStatus = async (userId, newStatus, token) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchAdminData(token)
      }
    } catch (err) {
      console.error('Failed to update user:', err)
    }
  }

  const handleClearData = async (token) => {
    if (!confirm('WARNING: This will delete ALL data (users, athletes, sessions). This cannot be undone. Continue?')) return
    
    try {
      const res = await fetch('/api/admin/clear-data', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        alert('All data cleared successfully')
        fetchAdminData(token)
      }
    } catch (err) {
      console.error('Failed to clear data:', err)
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
      <header className="bg-white shadow border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Kura Admin</h1>
              <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">ADMIN</span>
            </div>
            <p className="text-sm text-gray-600">System Administration</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{currentUser?.name}</span>
              <span className="ml-2 text-gray-400">({currentUser?.email})</span>
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
        {/* System Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-blue-600">{systemStats.totalUsers || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Athletes</p>
            <p className="text-3xl font-bold text-green-600">{systemStats.totalAthletes || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Active Sessions</p>
            <p className="text-3xl font-bold text-purple-600">{systemStats.activeSessions || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">System Status</p>
            <p className="text-3xl font-bold text-green-600">✓</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-3 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'users'
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('athletes')}
                className={`pb-3 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'athletes'
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Athletes
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">System Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Quick Stats</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Registered Users:</span>
                      <span className="font-medium">{systemStats.totalUsers || 0}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Registered Athletes:</span>
                      <span className="font-medium">{systemStats.totalAthletes || 0}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Active Sessions:</span>
                      <span className="font-medium">{systemStats.activeSessions || 0}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">System Info</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Database:</span>
                      <span className="font-medium text-green-600">Connected</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">API Status:</span>
                      <span className="font-medium text-green-600">Operational</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">1.0.0</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <p className="text-gray-500 text-sm">Activity logging coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">User Management</h2>
              <p className="text-sm text-gray-600 mt-1">Manage all registered users</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">No users found</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">#{user.id}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{user.email || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteUser(user.id, token)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'athletes' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Athlete Management</h2>
              <p className="text-sm text-gray-600 mt-1">View all athletes across all coaches</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Team</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Coach</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">No athletes found</td>
                    </tr>
                  ) : (
                    athletes.map((athlete) => (
                      <tr key={athlete.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{athlete.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{athlete.email || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{athlete.team || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            athlete.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : athlete.status === 'inactive'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {athlete.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          Coach #{athlete.coach_id}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">System Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Maintenance Mode</p>
                    <p className="text-sm text-gray-600">Disable all user access</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                    Disabled
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">User Registration</p>
                    <p className="text-sm text-gray-600">Allow new user signups</p>
                  </div>
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium">
                    Enabled
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-2 border-red-200">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
              <p className="text-sm text-gray-600 mb-4">
                These actions are irreversible. Proceed with caution.
              </p>
              <button
                onClick={() => handleClearData(token)}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardAdmin
