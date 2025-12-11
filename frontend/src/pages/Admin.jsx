import { useState, useEffect } from 'react'
import { api, formatDate } from '../utils/api'
import { 
  Shield, 
  Users, 
  Ticket, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Hash
} from 'lucide-react'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 text-dark-400 hover:text-white rounded transition-colors"
      title="Copiar"
    >
      {copied ? <Check className="w-4 h-4 text-lucid-400" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('codes')
  const [inviteCodes, setInviteCodes] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  // New code form
  const [maxUses, setMaxUses] = useState(1)
  const [expiresInDays, setExpiresInDays] = useState(7)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      if (activeTab === 'codes') {
        const response = await api.get('/admin/invite-codes')
        setInviteCodes(response.data.codes || [])
      } else {
        const response = await api.get('/admin/users')
        setUsers(response.data.users || [])
      }
    } catch (err) {
      setError(err.message || 'Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  const createCode = async () => {
    setCreating(true)
    setError(null)

    try {
      const response = await api.post('/admin/invite-codes', {
        max_uses: maxUses,
        expires_in_days: expiresInDays
      })
      setSuccess(`Código creado: ${response.data.code}`)
      loadData()
    } catch (err) {
      setError(err.message || 'Error creando código')
    } finally {
      setCreating(false)
    }
  }

  const deleteCode = async (codeId) => {
    if (!confirm('¿Eliminar este código?')) return

    try {
      await api.delete(`/admin/invite-codes/${codeId}`)
      setSuccess('Código eliminado')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}`, {
        is_active: !currentStatus
      })
      setSuccess(`Usuario ${currentStatus ? 'desactivado' : 'activado'}`)
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-amber-500/10">
          <Shield className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-white">
            Panel de Administración
          </h1>
          <p className="text-dark-400">
            Gestiona usuarios y códigos de invitación
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
          <button onClick={() => setError(null)} className="ml-auto">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-lucid-500/10 border border-lucid-500/20 rounded-xl text-lucid-400">
          <CheckCircle className="w-5 h-5" />
          <p>{success}</p>
          <button onClick={() => setSuccess(null)} className="ml-auto">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-dark-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('codes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'codes'
              ? 'bg-lucid-500 text-white'
              : 'text-dark-400 hover:text-white'
          }`}
        >
          <Ticket className="w-4 h-4" />
          Códigos de Invitación
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'users'
              ? 'bg-lucid-500 text-white'
              : 'text-dark-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Usuarios
        </button>
      </div>

      {/* Content */}
      {activeTab === 'codes' ? (
        <div className="space-y-6">
          {/* Create Code Form */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-semibold text-white mb-4">
              Crear Nuevo Código
            </h3>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <label className="block text-sm text-dark-400">Usos máximos</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={maxUses}
                  onChange={(e) => setMaxUses(parseInt(e.target.value))}
                  className="w-24 px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-center focus:outline-none focus:border-lucid-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-dark-400">Expira en (días)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(parseInt(e.target.value))}
                  className="w-24 px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-center focus:outline-none focus:border-lucid-500"
                />
              </div>
              <button
                onClick={createCode}
                disabled={creating}
                className="btn-primary flex items-center gap-2"
              >
                {creating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Generar Código
              </button>
            </div>
          </div>

          {/* Codes List */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white">
                Códigos Existentes
              </h3>
              <button
                onClick={loadData}
                disabled={loading}
                className="btn-ghost flex items-center gap-2 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 text-dark-400 animate-spin mx-auto" />
              </div>
            ) : inviteCodes.length === 0 ? (
              <div className="text-center py-8 text-dark-400">
                <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay códigos creados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inviteCodes.map((code) => (
                  <div 
                    key={code.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      code.is_active && code.uses < code.max_uses
                        ? 'bg-dark-800/50 border-dark-700'
                        : 'bg-dark-800/30 border-dark-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-lg text-lucid-400 font-bold tracking-wider">
                        {code.code}
                      </div>
                      <CopyButton text={code.code} />
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-sm text-dark-400">
                        <span className="text-white font-medium">{code.uses}</span>/{code.max_uses} usos
                      </div>
                      <div className="text-sm text-dark-400 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {code.expires_at ? new Date(code.expires_at).toLocaleDateString() : 'Sin expiración'}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        code.is_active && code.uses < code.max_uses
                          ? 'bg-lucid-500/10 text-lucid-400'
                          : 'bg-dark-700 text-dark-400'
                      }`}>
                        {code.uses >= code.max_uses ? 'Agotado' : code.is_active ? 'Activo' : 'Inactivo'}
                      </div>
                      <button
                        onClick={() => deleteCode(code.id)}
                        className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Users Tab */
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-white">
              Usuarios Registrados ({users.length})
            </h3>
            <button
              onClick={loadData}
              disabled={loading}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 text-dark-400 animate-spin mx-auto" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-dark-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Usuario</th>
                    <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Email</th>
                    <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Registro</th>
                    <th className="text-center py-3 px-4 text-dark-400 font-medium text-sm">Estado</th>
                    <th className="text-center py-3 px-4 text-dark-400 font-medium text-sm">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lucid-400 to-lucid-600 flex items-center justify-center text-white font-semibold text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            {user.is_admin && (
                              <span className="text-xs text-amber-400 font-medium">Admin</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-dark-300">{user.email}</td>
                      <td className="py-4 px-4 text-dark-400 text-sm">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.is_active
                            ? 'bg-lucid-500/10 text-lucid-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {!user.is_admin && (
                          <button
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              user.is_active
                                ? 'text-red-400 hover:bg-red-500/10'
                                : 'text-lucid-400 hover:bg-lucid-500/10'
                            }`}
                          >
                            {user.is_active ? 'Desactivar' : 'Activar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
