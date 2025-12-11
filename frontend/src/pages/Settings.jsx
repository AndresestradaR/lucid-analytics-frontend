import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  AlertCircle, 
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.put('/auth/profile', { name, email })
      updateUser(response.data)
      setSuccess('Perfil actualizado correctamente')
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await api.put('/auth/password', {
        current_password: currentPassword,
        new_password: newPassword
      })
      setSuccess('Contraseña actualizada correctamente')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message || 'Error al cambiar contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-2">
          Configuración
        </h1>
        <p className="text-dark-400">
          Administra tu cuenta y preferencias
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-lucid-500/10 border border-lucid-500/20 rounded-xl text-lucid-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Profile Section */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-semibold text-white text-lg mb-6">
          Información del Perfil
        </h2>
        
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">
              Nombre
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-dark pl-12"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark pl-12"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-semibold text-white text-lg mb-6">
          Cambiar Contraseña
        </h2>
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">
              Contraseña Actual
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-dark pl-12 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
              >
                {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-dark pl-12"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-dark pl-12"
                placeholder="••••••••"
              />
            </div>
            {newPassword && confirmPassword && newPassword === confirmPassword && (
              <p className="text-sm text-lucid-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Las contraseñas coinciden
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              className="btn-primary flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-semibold text-white text-lg mb-4">
          Información de la Cuenta
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-dark-700">
            <span className="text-dark-400">Estado</span>
            <span className={`font-medium ${user?.is_active ? 'text-lucid-400' : 'text-red-400'}`}>
              {user?.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-700">
            <span className="text-dark-400">Tipo de cuenta</span>
            <span className="text-white font-medium">
              {user?.is_admin ? 'Administrador' : 'Usuario'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-dark-400">Miembro desde</span>
            <span className="text-white">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
