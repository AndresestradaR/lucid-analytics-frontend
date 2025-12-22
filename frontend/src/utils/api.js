const API_URL = import.meta.env.VITE_API_URL || 'https://api.lucidestrategasia.online/api'

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    }
    
    const token = localStorage.getItem('token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  async request(method, endpoint, data = null) {
    const url = `${this.baseURL}${endpoint}`
    const options = {
      method,
      headers: this.getHeaders(),
    }

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)
      
      if (response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        throw new Error('Sesión expirada')
      }

      let responseData
      try {
        responseData = await response.json()
      } catch (jsonError) {
        // Si no se puede parsear JSON, usar texto o mensaje genérico
        const text = await response.text().catch(() => '')
        throw new Error(text || `Error HTTP ${response.status}`)
      }

      if (!response.ok) {
        // Extraer mensaje de error del backend
        const errorMessage = responseData.detail || responseData.message || responseData.error || 'Error en la solicitud'
        throw new Error(errorMessage)
      }

      return { data: responseData, status: response.status }
    } catch (error) {
      // Re-lanzar el error para que el catch del componente lo maneje
      console.error(`[API] ${method} ${endpoint} failed:`, error.message)
      throw error
    }
  }

  get(endpoint) {
    return this.request('GET', endpoint)
  }

  post(endpoint, data) {
    return this.request('POST', endpoint, data)
  }

  put(endpoint, data) {
    return this.request('PUT', endpoint, data)
  }

  delete(endpoint) {
    return this.request('DELETE', endpoint)
  }
}

export const api = new ApiClient(API_URL)

// Helpers for formatting - con manejo de null/undefined
export function formatCurrency(value, currency = 'COP') {
  // Manejar null, undefined, NaN
  if (value == null || isNaN(value)) {
    value = 0
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value) {
  // Manejar null, undefined, NaN
  if (value == null || isNaN(value)) {
    value = 0
  }
  return new Intl.NumberFormat('es-CO').format(value)
}

export function formatPercent(value) {
  // Manejar null, undefined, NaN
  if (value == null || isNaN(value)) {
    value = 0
  }
  return `${value.toFixed(1)}%`
}

export function formatDate(date) {
  if (!date) return '-'
  try {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return '-'
  }
}
