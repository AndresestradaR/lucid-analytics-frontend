import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Mail, Lock, User, Ticket, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (!inviteCode.trim()) {
      setError('Necesitas un código de invitación para registrarte')
      return
    }

    setLoading(true)

    try {
      await register(name, email, password, inviteCode.trim())
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Error al registrar. Verifica el código de invitación.')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = () => {
    if (password.length === 0) return null
    if (password.length < 8) return { text: 'Muy corta', color: 'text-red-400', bg: 'bg-red-500' }
    if (password.length < 12) return { text: 'Aceptable', color: 'text-yellow-400', bg: 'bg-yellow-500' }
    return { text: 'Fuerte', color: 'text-lucid-400', bg: 'bg-lucid-500' }
  }

  const strength = passwordStrength()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-lucid-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-lucid-600/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-lucid-500 to-lucid-600 shadow-xl shadow-lucid-500/30 mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Crear Cuenta
          </h1>
          <p className="text-dark-400">
            Necesitas un código de invitación
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5 animate-slide-up">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Invite Code - Destacado */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-lucid-400">
              Código de Invitación *
            </label>
            <div className="relative">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lucid-500" />
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="input-dark pl-12 border-lucid-500/30 focus:border-lucid-500 uppercase tracking-wider"
                placeholder="XXXXXX"
                required
              />
            </div>
            <p className="text-xs text-dark-500">
              Solicítalo al administrador de tu comunidad
            </p>
          </div>

          <div className="border-t border-dark-700 pt-5">
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
                  required
                />
              </div>
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
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark pl-12"
                placeholder="••••••••"
                required
              />
            </div>
            {strength && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-dark-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strength.bg} transition-all duration-300`}
                    style={{ width: password.length < 8 ? '33%' : password.length < 12 ? '66%' : '100%' }}
                  />
                </div>
                <span className={`text-xs ${strength.color}`}>{strength.text}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-dark pl-12"
                placeholder="••••••••"
                required
              />
              {confirmPassword && password === confirmPassword && (
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lucid-500" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Crear Cuenta
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center mt-6 text-dark-400 animate-fade-in delay-300">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-lucid-400 hover:text-lucid-300 font-medium transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
