import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function DashboardParent() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [newUser, setNewUser] = useState({ name: '', email: '' })
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
        fetchUsers(token)
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

  const fetchUsers = async (token) => {
    try {
      const res = await fetch('/api/dashboard/parent', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setUsers(data.users || [])
    } catch (err) {
      console.error('Failed to fetch users:', err)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('kura_token')
    
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      })
      if (res.ok) {
        setNewUser({ name: '', email: '' })
        fetchUsers(token)
      }
    } catch (err) {
      console.error('Failed to create user:', err)
    }
  }

  const handleDeleteUser = async (userId, token) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchUsers(token)
      }
    } catch (err) {
      console.error('Failed to delete user:', err)
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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kura</h1>
            <p className="text-sm text-gray-600">Parent Dashboard</p>
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
      <main className="max-w-6xl mx-auto p-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Add User Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add User
              </button>
            </form>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500">No users yet. Add one!</p>
            ) : (
              <ul className="space-y-3">
                {users.map((user) => (
                  <li key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleDeleteUser(user.id, token)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardParent
