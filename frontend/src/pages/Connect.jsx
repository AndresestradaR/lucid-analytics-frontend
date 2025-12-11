import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { 
  Link2, 
  Facebook, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react'

function ConnectionCard({ 
  title, 
  description, 
  icon: Icon, 
  connected, 
  accountInfo,
  onConnect, 
  onDisconnect,
  loading,
  children 
}) {
  return (
    <div className={`glass rounded-2xl p-6 transition-all duration-300 ${connected ? 'ring-2 ring-lucid-500/30' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${connected ? 'bg-lucid-500/10' : 'bg-dark-700'}`}>
            <Icon className={`w-6 h-6 ${connected ? 'text-lucid-400' : 'text-dark-400'}`} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-lg">{title}</h3>
            <p className="text-dark-400 text-sm">{description}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          connected 
            ? 'bg-lucid-500/10 text-lucid-400' 
            : 'bg-dark-700 text-dark-400'
        }`}>
          {connected ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Conectado
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4" />
              Desconectado
            </>
          )}
        </div>
      </div>

      {connected && accountInfo && (
        <div className="mb-4 p-4 bg-dark-800/50 rounded-xl">
          <p className="text-sm text-dark-400 mb-1">Cuenta conectada:</p>
          <p className="text-white font-medium">{accountInfo}</p>
        </div>
      )}

      {children}

      <div className="mt-4 pt-4 border-t border-dark-700 flex gap-3">
        {connected ? (
          <button
            onClick={onDisconnect}
            disabled={loading}
            className="btn-ghost text-red-400 hover:bg-red-500/10"
          >
            Desconectar
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                Conectar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Connect() {
  const [metaConnected, setMetaConnected] = useState(false)
  const [lucidConnected, setLucidConnected] = useState(false)
  const [metaAccounts, setMetaAccounts] = useState([])
  const [lucidAccount, setLucidAccount] = useState(null)
  const [lucidToken, setLucidToken] = useState('')
  const [loading, setLoading] = useState({ meta: false, lucid: false })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkConnections()
  }, [])

  const checkConnections = async () => {
    try {
      // Check Meta connection
      const metaResponse = await api.get('/meta/accounts')
      if (metaResponse.data.accounts?.length > 0) {
        setMetaConnected(true)
        setMetaAccounts(metaResponse.data.accounts)
      }
    } catch (err) {
      console.log('Meta not connected')
    }

    try {
      // Check LucidBot connection
      const lucidResponse = await api.get('/lucidbot/status')
      if (lucidResponse.data.connected) {
        setLucidConnected(true)
        setLucidAccount(lucidResponse.data)
      }
    } catch (err) {
      console.log('LucidBot not connected')
    }
  }

  const connectMeta = () => {
    // Redirect to Meta OAuth
    const clientId = import.meta.env.VITE_META_APP_ID
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/meta/callback`)
    const scope = encodeURIComponent('ads_read,ads_management,business_management')
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`
    
    window.location.href = authUrl
  }

  const connectLucid = async () => {
    if (!lucidToken.trim()) {
      setError('Ingresa tu token de LucidBot')
      return
    }

    setLoading(prev => ({ ...prev, lucid: true }))
    setError(null)

    try {
      await api.post('/lucidbot/connect', { api_token: lucidToken.trim() })
      setSuccess('¡LucidBot conectado exitosamente!')
      setLucidConnected(true)
      setLucidToken('')
      checkConnections()
    } catch (err) {
      setError(err.message || 'Error al conectar LucidBot. Verifica tu token.')
    } finally {
      setLoading(prev => ({ ...prev, lucid: false }))
    }
  }

  const disconnectLucid = async () => {
    setLoading(prev => ({ ...prev, lucid: true }))
    try {
      await api.delete('/lucidbot/disconnect')
      setLucidConnected(false)
      setLucidAccount(null)
      setSuccess('LucidBot desconectado')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(prev => ({ ...prev, lucid: false }))
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-2">
          Conexiones
        </h1>
        <p className="text-dark-400">
          Conecta tus cuentas para sincronizar datos automáticamente
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 animate-slide-down">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
          <button onClick={() => setError(null)} className="ml-auto">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-lucid-500/10 border border-lucid-500/20 rounded-xl text-lucid-400 animate-slide-down">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p>{success}</p>
          <button onClick={() => setSuccess(null)} className="ml-auto">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Meta Ads Connection */}
      <ConnectionCard
        title="Meta Ads"
        description="Conecta tu cuenta de Facebook/Instagram Ads"
        icon={Facebook}
        connected={metaConnected}
        accountInfo={metaAccounts.length > 0 ? `${metaAccounts.length} cuenta(s) conectada(s)` : null}
        onConnect={connectMeta}
        onDisconnect={() => {}}
        loading={loading.meta}
      >
        {metaConnected && metaAccounts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-dark-400 mb-2">Cuentas publicitarias:</p>
            {metaAccounts.map(account => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{account.name}</p>
                  <p className="text-dark-500 text-xs font-mono">{account.id}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-lucid-500" />
              </div>
            ))}
          </div>
        )}
      </ConnectionCard>

      {/* LucidBot Connection */}
      <ConnectionCard
        title="LucidBot"
        description="Conecta tu cuenta de LucidBot para tracking de leads"
        icon={MessageCircle}
        connected={lucidConnected}
        accountInfo={lucidAccount?.account_id ? `Account ID: ${lucidAccount.account_id}` : null}
        onConnect={connectLucid}
        onDisconnect={disconnectLucid}
        loading={loading.lucid}
      >
        {!lucidConnected && (
          <div className="space-y-4">
            <div className="p-4 bg-dark-800/50 rounded-xl">
              <p className="text-sm text-dark-300 mb-3">
                <strong>¿Cómo obtener tu token?</strong>
              </p>
              <ol className="text-sm text-dark-400 space-y-2 list-decimal list-inside">
                <li>Ingresa a <a href="https://panel.lucidbot.co" target="_blank" rel="noopener noreferrer" className="text-lucid-400 hover:underline">panel.lucidbot.co</a></li>
                <li>Ve a Configuración → API</li>
                <li>Copia tu Access Token</li>
              </ol>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-300">
                Access Token
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={lucidToken}
                  onChange={(e) => setLucidToken(e.target.value)}
                  className="input-dark pr-12 font-mono text-sm"
                  placeholder="1234567.ABC123..."
                />
                {lucidToken && (
                  <button
                    onClick={() => copyToClipboard(lucidToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-dark-400 hover:text-white rounded transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-lucid-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </ConnectionCard>

      {/* Help section */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-semibold text-white mb-4">
          ¿Necesitas ayuda?
        </h3>
        <div className="space-y-3 text-sm text-dark-400">
          <p>
            Una vez conectadas ambas cuentas, podrás ver en tu Dashboard:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>CPA real calculado automáticamente</li>
            <li>Leads y ventas por cada anuncio</li>
            <li>ROAS real de tus campañas</li>
            <li>Métricas de conversión</li>
          </ul>
          <p className="pt-2">
            Los datos se actualizan cada vez que abres el Dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
