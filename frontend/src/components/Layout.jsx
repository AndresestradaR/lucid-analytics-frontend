import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  LayoutDashboard, 
  Link2, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  ChevronRight,
  Zap,
  Sun,
  Moon
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Conexiones', href: '/connect', icon: Link2 },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-dark-900/95 backdrop-blur-xl border-r border-dark-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-dark-800">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="Trucos Ecomm & Drop" 
                className="w-12 h-12 rounded-xl object-cover shadow-lg"
              />
              <div>
                <h1 className="font-display font-bold text-lg text-white">Trucos</h1>
                <p className="text-xs text-dark-400 font-medium">Ecomm & Drop</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-lucid-500/10 text-lucid-400 shadow-sm' 
                    : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}

            {/* Admin Link */}
            {user?.is_admin && (
              <NavLink
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-amber-500/10 text-amber-400 shadow-sm' 
                    : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                  }
                `}
              >
                <Shield className="w-5 h-5" />
                <span>Admin</span>
              </NavLink>
            )}
          </nav>

          {/* Theme Toggle */}
          <div className="px-4 pb-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-dark-400 hover:text-white hover:bg-dark-800/50 transition-all duration-200"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  <span>Modo Oscuro</span>
                </>
              )}
            </button>
          </div>

          {/* User section */}
          <div className="p-4 border-t border-dark-800">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-800/50">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lucid-400 to-lucid-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-dark-400 truncate">{user?.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-dark-900/95 backdrop-blur-xl border-b border-dark-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <img 
                src="/logo.jpg" 
                alt="Trucos" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-display font-bold text-white">Trucos</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
