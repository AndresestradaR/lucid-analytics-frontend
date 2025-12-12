import { useState, useEffect, useRef } from 'react'
import { api } from '../utils/api'
import { 
  Brain, 
  X, 
  Send, 
  Loader2, 
  Trash2,
  MessageCircle,
  Sparkles
} from 'lucide-react'

export default function Chat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      loadHistory()
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadHistory = async () => {
    setLoadingHistory(true)
    try {
      const response = await api.get('/chat/history?limit=50')
      setMessages(response.data.messages || [])
    } catch (err) {
      console.error('Error loading history:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // Agregar mensaje del usuario inmediatamente
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await api.post('/chat/message', { message: userMessage })
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }])
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error al procesar tu mensaje. Intenta de nuevo.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = async () => {
    if (!confirm('¿Limpiar todo el historial de chat?')) return
    
    try {
      await api.delete('/chat/history')
      setMessages([])
    } catch (err) {
      console.error('Error clearing history:', err)
    }
  }

  // Sugerencias rápidas
  const suggestions = [
    "¿Cómo me fue ayer?",
    "¿Estoy ganando esta semana?",
    "Análisis de los últimos 7 días",
    "¿Cuál es mi ROAS?"
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl h-[80vh] bg-dark-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-dark-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700 bg-gradient-to-r from-purple-500/10 to-lucid-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-lucid-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white">El Cerebro</h2>
              <p className="text-xs text-dark-400">Tu asistente de rentabilidad</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearHistory}
              className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Limpiar historial"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-lucid-500 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-lucid-500/20 mb-4">
                <Sparkles className="w-12 h-12 text-lucid-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">
                ¡Hola! Soy El Cerebro 🧠
              </h3>
              <p className="text-dark-400 mb-6 max-w-sm">
                Pregúntame sobre tu rentabilidad. Analizo tus datos de Meta Ads, Dropi y LucidBot.
              </p>
              
              {/* Sugerencias */}
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-full text-sm text-dark-300 hover:text-white hover:border-lucid-500 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-lucid-500 text-white'
                        : 'bg-dark-800 text-white border border-dark-700'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-dark-700">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-purple-400 font-medium">El Cerebro</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-dark-800 border border-dark-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-lucid-500 animate-spin" />
                      <span className="text-sm text-dark-400">Analizando datos...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-dark-700 bg-dark-900">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre tu rentabilidad..."
              disabled={loading}
              className="flex-1 px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-lucid-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-lucid-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Botón flotante para abrir el chat
export function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-purple-500 to-lucid-500 text-white rounded-full shadow-lg shadow-lucid-500/30 hover:shadow-lucid-500/50 hover:scale-105 transition-all group"
    >
      <Brain className="w-6 h-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-dark-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-dark-700">
        Pregúntale al Cerebro
      </span>
    </button>
  )
}
