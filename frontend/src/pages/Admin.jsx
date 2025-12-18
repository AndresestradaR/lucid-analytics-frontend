import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Key, 
  RefreshCw, 
  Check, 
  X, 
  Clock,
  Database,
  ShoppingCart,
  Trash2,
  Play,
  AlertCircle
} from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState({});
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tokenForm, setTokenForm] = useState({ jwt_token: '', page_id: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Obtener token directamente de localStorage
  const getToken = () => localStorage.getItem('token');

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.lucidestrategasia.online';

  // Normalizar URL (quitar /api si ya está incluido)
  const getApiUrl = (endpoint) => {
    const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;
    return `${baseUrl}${endpoint}`;
  };

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/admin/users'), {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          navigate('/');
          return;
        }
        throw new Error('Error cargando usuarios');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openTokenModal = (userItem) => {
    setSelectedUser(userItem);
    setTokenForm({ jwt_token: '', page_id: userItem.page_id || '' });
    setShowTokenModal(true);
    setMessage(null);
  };

  const saveToken = async () => {
    if (!tokenForm.jwt_token || !tokenForm.page_id) {
      setMessage({ type: 'error', text: 'JWT Token y Page ID son requeridos' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(getApiUrl('/admin/set-token'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: selectedUser.user_id,
          jwt_token: tokenForm.jwt_token,
          page_id: tokenForm.page_id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error guardando token');
      }

      setMessage({ type: 'success', text: `Token guardado. ${data.total_contacts_in_lucidbot} contactos en LucidBot.` });
      fetchUsers();
      
      setTimeout(() => {
        setShowTokenModal(false);
      }, 2000);

    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const syncUser = async (userId) => {
    setSyncing(prev => ({ ...prev, [userId]: true }));
    
    try {
      const response = await fetch(getApiUrl('/admin/sync-user'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error iniciando sincronización');
      }

      // Mostrar mensaje de éxito
      alert(`Sincronización iniciada para el usuario`);
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSyncing(prev => ({ ...prev, [userId]: false }));
    }
  };

  const syncAllUsers = async () => {
    if (!confirm('¿Sincronizar TODOS los usuarios con token configurado?')) {
      return;
    }

    try {
      const response = await fetch(getApiUrl('/admin/sync-all'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error iniciando sincronización');
      }

      alert(`Sincronización iniciada para ${data.users.length} usuarios:\n${data.users.join('\n')}`);
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const clearContacts = async (userId, email) => {
    if (!confirm(`¿Eliminar TODOS los contactos de ${email}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/admin/clear-contacts/${userId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error eliminando contactos');
      }

      alert(data.message);
      fetchUsers();
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTokenExpired = (expiresDate) => {
    if (!expiresDate) return false;
    return new Date(expiresDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              Panel de Administración
            </h1>
            <p className="text-slate-400 mt-1">Gestiona tokens de LucidBot para todos los usuarios</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refrescar
            </button>
            <button
              onClick={syncAllUsers}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              Sincronizar Todos
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Usuario</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Token</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Page ID</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-300">Contactos</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-300">Ventas</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Última Sync</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((userItem) => (
                <tr key={userItem.user_id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-white font-medium">{userItem.email}</div>
                      {userItem.name && (
                        <div className="text-slate-400 text-sm">{userItem.name}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {userItem.has_jwt_token ? (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-400" />
                        {userItem.token_expires && (
                          <span className={`text-xs ${isTokenExpired(userItem.token_expires) ? 'text-red-400' : 'text-slate-400'}`}>
                            {isTokenExpired(userItem.token_expires) ? 'Expirado' : `Exp: ${formatDate(userItem.token_expires)}`}
                          </span>
                        )}
                      </div>
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                  </td>
                  <td className="px-4 py-4 text-slate-300 text-sm">
                    {userItem.page_id || '-'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-400">
                      <Database className="w-4 h-4" />
                      <span>{userItem.total_contacts.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-green-400">
                      <ShoppingCart className="w-4 h-4" />
                      <span>{userItem.total_ventas.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-sm">
                    {userItem.last_sync ? (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(userItem.last_sync)}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openTokenModal(userItem)}
                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                        title="Configurar Token"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => syncUser(userItem.user_id)}
                        disabled={!userItem.has_jwt_token || syncing[userItem.user_id]}
                        className={`p-2 rounded-lg transition-colors ${
                          userItem.has_jwt_token 
                            ? 'bg-green-600 hover:bg-green-500 text-white' 
                            : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        }`}
                        title="Sincronizar"
                      >
                        {syncing[userItem.user_id] ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => clearContacts(userItem.user_id, userItem.email)}
                        disabled={userItem.total_contacts === 0}
                        className={`p-2 rounded-lg transition-colors ${
                          userItem.total_contacts > 0
                            ? 'bg-red-600 hover:bg-red-500 text-white'
                            : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        }`}
                        title="Limpiar Contactos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instrucciones */}
        <div className="mt-8 bg-slate-800/30 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            Cómo obtener el JWT Token de LucidBot
          </h3>
          <ol className="text-slate-300 space-y-2 list-decimal list-inside">
            <li>Inicia sesión en <a href="https://panel.lucidbot.co" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">panel.lucidbot.co</a> con la cuenta del usuario</li>
            <li>Abre DevTools (F12) → Application → Cookies</li>
            <li>Busca la cookie llamada <code className="bg-slate-700 px-2 py-0.5 rounded">token</code> y copia su valor</li>
            <li>Busca la cookie llamada <code className="bg-slate-700 px-2 py-0.5 rounded">last_page_id</code> y copia su valor</li>
            <li>Pega ambos valores en el formulario</li>
          </ol>
        </div>
      </div>

      {/* Token Modal */}
      {showTokenModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-lg mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Configurar Token para {selectedUser.email}
            </h3>
            
            {message && (
              <div className={`mb-4 px-4 py-3 rounded-lg ${
                message.type === 'error' 
                  ? 'bg-red-500/20 border border-red-500 text-red-300'
                  : 'bg-green-500/20 border border-green-500 text-green-300'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  JWT Token (cookie "token")
                </label>
                <textarea
                  value={tokenForm.jwt_token}
                  onChange={(e) => setTokenForm(prev => ({ ...prev, jwt_token: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                  placeholder="eyJ0eXAiOiJKV1QiLCJhbGci..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Page ID (cookie "last_page_id")
                </label>
                <input
                  type="text"
                  value={tokenForm.page_id}
                  onChange={(e) => setTokenForm(prev => ({ ...prev, page_id: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="1167349"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTokenModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveToken}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
