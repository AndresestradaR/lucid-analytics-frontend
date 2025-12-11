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

    const response = await fetch(url, options)
    
    if (response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      throw new Error('Sesión expirada')
    }

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(responseData.detail || 'Error en la solicitud')
    }

    return { data: responseData, status: response.status }
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

// Helpers for formatting
export function formatCurrency(value, currency = 'COP') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value) {
  return new Intl.NumberFormat('es-CO').format(value)
}

export function formatPercent(value) {
  return `${value.toFixed(1)}%`
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
