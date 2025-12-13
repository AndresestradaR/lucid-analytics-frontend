import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function MetaCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [message, setMessage] = useState('Conectando con Meta Ads...')

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error) {
      setStatus('error')
      setMessage(errorDescription || 'Error al autorizar con Facebook')
      
      // Notificar a la ventana padre si existe
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'META_AUTH_ERROR', 
          message: errorDescription || 'Error al autorizar' 
        }, window.location.origin)
        setTimeout(() => window.close(), 3000)
      }
      return
    }

    if (code) {
      exchangeCode(code)
    } else {
      setStatus('error')
      setMessage('No se recibió código de autorización')
    }
  }, [searchParams])

  const exchangeCode = async (code) => {
    try {
      setMessage('Obteniendo acceso a tus cuentas publicitarias...')
      
      // IMPORTANTE: El endpoint correcto es /meta/oauth/callback
      const response = await api.post('/meta/oauth/callback', { 
        code
      })

      setStatus('success')
      setMessage(`¡Conectado! ${response.data.accounts?.length || ''} cuenta(s) encontrada(s)`)

      // Notificar a la ventana padre si es un popup
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'META_AUTH_SUCCESS',
          accounts: response.data.accounts?.length
        }, window.location.origin)
        
        // Cerrar popup después de mostrar éxito
        setTimeout(() => window.close(), 2000)
      } else {
        // Si no es popup, redirigir a conexiones
        setTimeout(() => navigate('/connect'), 2000)
      }

    } catch (err) {
      console.error('Error exchanging code:', err)
      setStatus('error')
      setMessage(err.response?.data?.detail || err.message || 'Error al conectar con Meta Ads')

      if (window.opener) {
        window.opener.postMessage({ 
          type: 'META_AUTH_ERROR', 
          message: err.response?.data?.detail || err.message 
        }, window.location.origin)
        setTimeout(() => window.close(), 3000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-16 h-16 text-lucid-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-display font-bold text-white mb-2">
              Conectando...
            </h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-lucid-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-lucid-400" />
            </div>
            <h2 className="text-xl font-display font-bold text-white mb-2">
              ¡Conectado!
            </h2>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-xl font-display font-bold text-white mb-2">
              Error
            </h2>
          </>
        )}

        <p className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-dark-400'}`}>
          {message}
        </p>

        {status !== 'processing' && !window.opener && (
          <button
            onClick={() => navigate('/connect')}
            className="btn-primary mt-6"
          >
            Volver a Conexiones
          </button>
        )}

        {window.opener && status !== 'processing' && (
          <p className="text-xs text-dark-500 mt-4">
            Esta ventana se cerrará automáticamente...
          </p>
        )}
      </div>
    </div>
  )
}
