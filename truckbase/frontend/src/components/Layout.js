import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Locations', href: '/locations' },
    { name: 'Permits', href: '/permits' },
    { name: 'Inventory', href: '/inventory' },
    { name: 'Events', href: '/events' },
    { name: 'Social', href: '/social' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-primary-600">🚛 TruckBase</h1>
        </div>
        
        <nav className="mt-8 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-4 py-3 rounded-lg mb-2 transition-colors ${
                location.pathname === item.href
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
