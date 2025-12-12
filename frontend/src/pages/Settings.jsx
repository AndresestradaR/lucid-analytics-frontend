import { useState, useEffect } from 'react'
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
  EyeOff,
  Brain,
  Key,
  ExternalLink,
  Trash2,
  Loader2
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

  // Anthropic API Key
  const [anthropicKey, setAnthropicKey] = useState('')
  const [anthropicStatus, setAnthropicStatus] = useState({ has_key: false, key_preview: null })
  const [anthropicLoading, setAnthropicLoading] = useState(false)
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)

  useEffect(() => {
    loadAnthropicStatus()
  }, [])

  const loadAnthropicStatus = async () => {
    try {
      const response = await api.get('/auth/anthropic-key')
      setAnthropicStatus(response.data)
    } catch (err) {
      console.error('Error loading Anthropic status:', err)
    }
  }

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

  const handleSaveAnthropicKey = async (e) => {
    e.preventDefault()
    
    if (!anthropicKey.trim()) {
      setError('Ingresa tu API key')
      return
    }

    setAnthropicLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post('/auth/anthropic-key', { api_key: anthropicKey })
      setAnthropicStatus({ has_key: true, key_preview: response.data.key_preview })
      setAnthropicKey('')
      setSuccess('API key guardada correctamente. ¡El Cerebro está listo!')
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al guardar API key')
    } finally {
      setAnthropicLoading(false)
    }
  }

  const handleDeleteAnthropicKey = async () => {
    if (!confirm('¿Eliminar tu API key de Anthropic? El Cerebro dejará de funcionar.')) return

    setAnthropicLoading(true)
    setError(null)

    try {
      await api.delete('/auth/anthropic-key')
      setAnthropicStatus({ has_key: false, key_preview: null })
      setSuccess('API key eliminada')
    } catch (err) {
      setError(err.message || 'Error al eliminar API key')
    } finally {
      setAnthropicLoading(false)
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

      {/* Anthropic API Key Section */}
      <div className="glass rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-lucid-500/20">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-white text-lg">
              El Cerebro - API de Anthropic
            </h2>
            <p className="text-sm text-dark-400">
              Conecta tu API key para usar el asistente IA
            </p>
          </div>
        </div>

        {anthropicStatus.has_key ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-lucid-400" />
                <div>
                  <p className="text-white font-medium">API Key conectada</p>
                  <p className="text-sm text-dark-400 font-mono">{anthropicStatus.key_preview}</p>
                </div>
              </div>
              <button
                onClick={handleDeleteAnthropicKey}
                disabled={anthropicLoading}
                className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Eliminar API key"
              >
                {anthropicLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-sm text-dark-400">
              ✨ El Cerebro está listo para ayudarte a analizar tu rentabilidad.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSaveAnthropicKey} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-300">
                API Key de Anthropic
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type={showAnthropicKey ? 'text' : 'password'}
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  className="input-dark pl-12 pr-12 font-mono text-sm"
                  placeholder="sk-ant-api03-..."
                />
                <button
                  type="button"
                  onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                >
                  {showAnthropicKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-dark-500">
                Tu API key se guarda encriptada y solo tú puedes usarla.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={anthropicLoading || !anthropicKey.trim()}
                className="btn-primary flex items-center gap-2"
              >
                {anthropicLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Guardar API Key
              </button>
              
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-dark-400 hover:text-lucid-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Obtener API key
              </a>
            </div>
          </form>
        )}
      </div>

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
