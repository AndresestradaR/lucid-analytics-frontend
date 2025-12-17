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
  Loader2,
  MessageCircle,
  RefreshCw,
  HelpCircle,
  Copy,
  Check,
  Database,
  Calendar
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

  // LucidBot JWT Token
  const [lucidJwt, setLucidJwt] = useState('')
  const [lucidPageId, setLucidPageId] = useState('')
  const [lucidStatus, setLucidStatus] = useState({ 
    has_jwt: false, 
    jwt_valid: false, 
    jwt_expires: null,
    page_id: null 
  })
  const [lucidLoading, setLucidLoading] = useState(false)
  const [showLucidJwt, setShowLucidJwt] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [syncStatus, setSyncStatus] = useState(null)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    loadAnthropicStatus()
    loadLucidStatus()
  }, [])

  const loadAnthropicStatus = async () => {
    try {
      const response = await api.get('/auth/anthropic-key')
      setAnthropicStatus(response.data)
    } catch (err) {
      console.error('Error loading Anthropic status:', err)
    }
  }

  const loadLucidStatus = async () => {
    try {
      const response = await api.get('/sync/lucidbot/jwt-status')
      setLucidStatus(response.data)
      if (response.data.page_id) {
        setLucidPageId(response.data.page_id)
      }
      
      // También cargar estado de sync
      const syncResponse = await api.get('/sync/lucidbot/sync-status')
      setSyncStatus(syncResponse.data)
    } catch (err) {
      console.error('Error loading LucidBot status:', err)
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

  // LucidBot JWT handlers
  const handleSaveLucidJwt = async (e) => {
    e.preventDefault()
    
    if (!lucidJwt.trim()) {
      setError('Ingresa el JWT token')
      return
    }

    if (!lucidPageId.trim()) {
      setError('Ingresa el Page ID de LucidBot')
      return
    }

    setLucidLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post('/sync/lucidbot/jwt-token', { 
        jwt_token: lucidJwt,
        page_id: lucidPageId
      })
      
      setLucidJwt('')
      setSuccess(`JWT token guardado. ${response.data.total_contacts} contactos disponibles para sincronizar.`)
      loadLucidStatus()
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al guardar JWT token')
    } finally {
      setLucidLoading(false)
    }
  }

  const handleDeleteLucidJwt = async () => {
    if (!confirm('¿Eliminar el JWT token? No podrás sincronizar contactos.')) return

    setLucidLoading(true)
    setError(null)

    try {
      await api.delete('/sync/lucidbot/jwt-token')
      setLucidStatus({ has_jwt: false, jwt_valid: false, jwt_expires: null, page_id: null })
      setSuccess('JWT token eliminado')
    } catch (err) {
      setError(err.message || 'Error al eliminar JWT token')
    } finally {
      setLucidLoading(false)
    }
  }

  const handleSyncContacts = async () => {
    setSyncing(true)
    setError(null)

    try {
      await api.post('/sync/lucidbot/sync-all')
      setSuccess('Sincronización iniciada. Esto puede tomar varios minutos...')
      
      // Recargar estado cada 5 segundos
      const interval = setInterval(async () => {
        try {
          const response = await api.get('/sync/lucidbot/sync-status')
          setSyncStatus(response.data)
        } catch (e) {}
      }, 5000)
      
      // Parar después de 5 minutos
      setTimeout(() => {
        clearInterval(interval)
        setSyncing(false)
      }, 300000)
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sincronización')
      setSyncing(false)
    }
  }

  const formatDate = (isoString) => {
    if (!isoString) return '-'
    return new Date(isoString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-2">
          Configuración
        </h1>
        <p className="text-dark-400">
          Administra tu cuenta y conexiones
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

      {/* LucidBot JWT Section - NUEVO */}
      <div className="glass rounded-2xl p-6 border border-green-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <MessageCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-white text-lg">
              LucidBot - Sincronización Avanzada
            </h2>
            <p className="text-sm text-dark-400">
              Conecta tu sesión de LucidBot para sincronizar TODOS los contactos
            </p>
          </div>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
            title="Ver instrucciones"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Instrucciones colapsables */}
        {showInstructions && (
          <div className="mb-6 p-4 bg-dark-800/50 rounded-xl border border-dark-700">
            <h3 className="font-semibold text-white mb-3">📋 Cómo obtener el JWT Token:</h3>
            <ol className="space-y-2 text-sm text-dark-300">
              <li className="flex gap-2">
                <span className="text-green-400 font-bold">1.</span>
                Abre <a href="https://panel.lucidbot.co" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">panel.lucidbot.co</a> e inicia sesión
              </li>
              <li className="flex gap-2">
                <span className="text-green-400 font-bold">2.</span>
                Presiona <kbd className="px-2 py-0.5 bg-dark-700 rounded text-xs">F12</kbd> para abrir DevTools
              </li>
              <li className="flex gap-2">
                <span className="text-green-400 font-bold">3.</span>
                Ve a la pestaña <span className="text-white font-medium">Application</span> → <span className="text-white font-medium">Cookies</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400 font-bold">4.</span>
                Busca la cookie llamada <code className="px-2 py-0.5 bg-dark-700 rounded text-xs text-green-400">token</code>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400 font-bold">5.</span>
                Copia el valor completo (empieza con <code className="text-green-400">eyJ...</code>)
              </li>
              <li className="flex gap-2">
                <span className="text-green-400 font-bold">6.</span>
                El Page ID está en la URL: <code className="text-xs text-dark-400">panel.lucidbot.co/en/inbox?acc=<span className="text-green-400">1167349</span></code>
              </li>
            </ol>
            <p className="mt-3 text-xs text-dark-500">
              ⚠️ El token expira cada ~2 meses. Recibirás aviso cuando necesites actualizarlo.
            </p>
          </div>
        )}

        {lucidStatus.has_jwt && lucidStatus.jwt_valid ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">JWT Token conectado</p>
                    <p className="text-sm text-dark-400">Page ID: {lucidStatus.page_id}</p>
                  </div>
                </div>
                <button
                  onClick={handleDeleteLucidJwt}
                  disabled={lucidLoading}
                  className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Eliminar JWT token"
                >
                  {lucidLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <Calendar className="w-4 h-4" />
                Expira: {formatDate(lucidStatus.jwt_expires)}
              </div>
            </div>

            {/* Sync Status */}
            {syncStatus && (
              <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-400" />
                    Estado de Sincronización
                  </h4>
                  <button
                    onClick={handleSyncContacts}
                    disabled={syncing}
                    className="btn-primary text-sm py-1.5 px-3 flex items-center gap-2"
                  >
                    {syncing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {syncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">{syncStatus.total_contacts || 0}</p>
                    <p className="text-xs text-dark-400">Contactos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">{syncStatus.total_ventas || 0}</p>
                    <p className="text-xs text-dark-400">Ventas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{syncStatus.total_ads || 0}</p>
                    <p className="text-xs text-dark-400">Anuncios</p>
                  </div>
                </div>
                
                {syncStatus.last_sync && (
                  <p className="text-xs text-dark-500 mt-3 text-center">
                    Última sync: {formatDate(syncStatus.last_sync)}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : lucidStatus.has_jwt && !lucidStatus.jwt_valid ? (
          // Token expirado
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-amber-400 font-medium">JWT Token expirado</p>
                  <p className="text-sm text-dark-400">Necesitas obtener un nuevo token de LucidBot</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSaveLucidJwt} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-300">
                    Page ID
                  </label>
                  <input
                    type="text"
                    value={lucidPageId}
                    onChange={(e) => setLucidPageId(e.target.value)}
                    className="input-dark text-sm"
                    placeholder="1167349"
                  />
                </div>
                <div></div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-300">
                  Nuevo JWT Token
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type={showLucidJwt ? 'text' : 'password'}
                    value={lucidJwt}
                    onChange={(e) => setLucidJwt(e.target.value)}
                    className="input-dark pl-12 pr-12 font-mono text-xs"
                    placeholder="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowLucidJwt(!showLucidJwt)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                  >
                    {showLucidJwt ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={lucidLoading || !lucidJwt.trim() || !lucidPageId.trim()}
                className="btn-primary flex items-center gap-2"
              >
                {lucidLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Actualizar Token
              </button>
            </form>
          </div>
        ) : (
          // Sin token
          <form onSubmit={handleSaveLucidJwt} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-300">
                  Page ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={lucidPageId}
                  onChange={(e) => setLucidPageId(e.target.value)}
                  className="input-dark text-sm"
                  placeholder="1167349"
                />
                <p className="text-xs text-dark-500">
                  Número en la URL de LucidBot
                </p>
              </div>
              <div></div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-300">
                JWT Token <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type={showLucidJwt ? 'text' : 'password'}
                  value={lucidJwt}
                  onChange={(e) => setLucidJwt(e.target.value)}
                  className="input-dark pl-12 pr-12 font-mono text-xs"
                  placeholder="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
                />
                <button
                  type="button"
                  onClick={() => setShowLucidJwt(!showLucidJwt)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                >
                  {showLucidJwt ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-dark-500">
                Copia el valor de la cookie "token" de LucidBot
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={lucidLoading || !lucidJwt.trim() || !lucidPageId.trim()}
                className="btn-primary flex items-center gap-2"
              >
                {lucidLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Guardar Token
              </button>
              
              <button
                type="button"
                onClick={() => setShowInstructions(true)}
                className="flex items-center gap-2 text-sm text-dark-400 hover:text-green-400 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Ver instrucciones
              </button>
            </div>
          </form>
        )}
      </div>

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
