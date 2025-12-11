import { useState, useEffect } from 'react'
import { api, formatCurrency, formatNumber, formatPercent } from '../utils/api'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Target,
  Calendar,
  RefreshCw,
  AlertCircle,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

function StatCard({ title, value, change, icon: Icon, trend, prefix = '', suffix = '' }) {
  const isPositive = trend === 'up' || (typeof change === 'number' && change > 0)
  
  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-lucid-500/10">
          <Icon className="w-6 h-6 text-lucid-400" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-lucid-400' : 'text-red-400'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {typeof change === 'number' ? `${Math.abs(change).toFixed(1)}%` : change}
          </div>
        )}
      </div>
      <p className="text-dark-400 text-sm font-medium mb-1">{title}</p>
      <p className="text-2xl font-display font-bold text-white">
        {prefix}{typeof value === 'number' ? formatNumber(value) : value}{suffix}
      </p>
    </div>
  )
}

function AdTable({ ads }) {
  if (!ads || ads.length === 0) {
    return (
      <div className="text-center py-12 text-dark-400">
        <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No hay datos de anuncios</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-700">
            <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Campaña / Conjunto / Anuncio</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">Gasto</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">Leads</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">Ventas</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">CPA</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">ROAS</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad, index) => (
            <tr key={ad.ad_id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
              <td className="py-4 px-4">
                <div className="space-y-1">
                  {ad.campaign_name && (
                    <p className="text-amber-400 text-xs font-medium">📁 {ad.campaign_name}</p>
                  )}
                  {ad.adset_name && (
                    <p className="text-blue-400 text-xs">📋 {ad.adset_name}</p>
                  )}
                  <p className="text-white font-medium">{ad.ad_name || `Anuncio ${index + 1}`}</p>
                  <p className="text-dark-300 text-xs font-mono opacity-70">{ad.ad_id}</p>
                </div>
              </td>
              <td className="text-right py-4 px-4 text-white">{formatCurrency(ad.spend)}</td>
              <td className="text-right py-4 px-4 text-white">{ad.leads}</td>
              <td className="text-right py-4 px-4">
                <span className={ad.sales > 0 ? 'text-lucid-400 font-medium' : 'text-dark-400'}>
                  {ad.sales}
                </span>
              </td>
              <td className="text-right py-4 px-4 text-white">
                {ad.cpa > 0 ? formatCurrency(ad.cpa) : '-'}
              </td>
              <td className="text-right py-4 px-4">
                <span className={`font-medium ${ad.roas >= 2 ? 'text-lucid-400' : ad.roas > 0 ? 'text-yellow-400' : 'text-dark-400'}`}>
                  {ad.roas > 0 ? `${ad.roas.toFixed(2)}x` : '-'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [selectedAccount, setSelectedAccount] = useState('')
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    loadAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      loadDashboard()
    }
  }, [selectedAccount, dateRange])

  const loadAccounts = async () => {
    try {
      const response = await api.get('/meta/accounts')
      setAccounts(response.data.accounts || [])
      if (response.data.accounts?.length > 0) {
        setSelectedAccount(response.data.accounts[0].account_id)
      }
    } catch (err) {
      console.error('Error loading accounts:', err)
    }
  }

  const loadDashboard = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.get(
        `/analytics/dashboard?account_id=${selectedAccount}&start_date=${dateRange.start}&end_date=${dateRange.end}`
      )
      setData(response.data)
    } catch (err) {
      setError(err.message || 'Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const prepareChartData = () => {
    if (!data?.ads) return []
    return data.ads.map(ad => ({
      name: ad.ad_name?.substring(0, 15) || 'Ad',
      gasto: ad.spend,
      revenue: ad.revenue,
      leads: ad.leads,
      ventas: ad.sales
    }))
  }

  const preparePieData = () => {
    if (!data?.ads) return []
    return data.ads
      .filter(ad => ad.spend > 0)
      .map(ad => ({
        name: ad.ad_name?.substring(0, 15) || 'Ad',
        value: ad.spend
      }))
  }

  if (!selectedAccount && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-2xl bg-amber-500/10 mb-4">
          <AlertCircle className="w-12 h-12 text-amber-400" />
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-2">
          Conecta tu cuenta de Meta Ads
        </h2>
        <p className="text-dark-400 mb-6">
          Ve a Conexiones para vincular tu cuenta de Facebook Ads
        </p>
        <a href="/connect" className="btn-primary">
          Ir a Conexiones
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            Dashboard
          </h1>
          <p className="text-dark-400">
            Métricas de tus campañas en tiempo real
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Account selector */}
          {accounts.length > 0 && (
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm focus:outline-none focus:border-lucid-500"
            >
              {accounts.map(acc => (
                <option key={acc.account_id} value={acc.account_id}>
                  {acc.account_name}
                </option>
              ))}
            </select>
          )}

          {/* Date range */}
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl">
            <Calendar className="w-4 h-4 text-dark-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-transparent text-white text-sm focus:outline-none"
            />
            <span className="text-dark-500">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-transparent text-white text-sm focus:outline-none"
            />
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="btn-ghost flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="w-12 h-12 bg-dark-700 rounded-xl mb-4" />
              <div className="h-4 bg-dark-700 rounded w-24 mb-2" />
              <div className="h-8 bg-dark-700 rounded w-32" />
            </div>
          ))}
        </div>
      ) : data?.summary && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Gasto Total"
              value={data.summary.total_spend}
              icon={DollarSign}
              prefix="$"
            />
            <StatCard
              title="Revenue"
              value={data.summary.total_revenue}
              icon={TrendingUp}
              prefix="$"
              change={data.summary.total_revenue > data.summary.total_spend ? 'up' : 'down'}
              trend={data.summary.total_revenue > data.summary.total_spend ? 'up' : 'down'}
            />
            <StatCard
              title="Leads"
              value={data.summary.total_leads}
              icon={Users}
            />
            <StatCard
              title="Ventas"
              value={data.summary.total_sales}
              icon={ShoppingCart}
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-6">
              <p className="text-dark-400 text-sm mb-1">CPA Promedio</p>
              <p className="text-2xl font-display font-bold text-white">
                {formatCurrency(data.summary.average_cpa || 0)}
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="text-dark-400 text-sm mb-1">ROAS Promedio</p>
              <p className="text-2xl font-display font-bold text-lucid-400">
                {(data.summary.average_roas || 0).toFixed(2)}x
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="text-dark-400 text-sm mb-1">Profit</p>
              <p className={`text-2xl font-display font-bold ${data.summary.profit >= 0 ? 'text-lucid-400' : 'text-red-400'}`}>
                {formatCurrency(data.summary.profit || 0)}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Gasto vs Revenue */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-white mb-6">
                Gasto vs Revenue por Anuncio
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepareChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '12px'
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="gasto" fill="#ef4444" name="Gasto" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenue" fill="#22c55e" name="Revenue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Distribución de gasto */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-white mb-6">
                Distribución de Gasto
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={preparePieData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {preparePieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '12px'
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {preparePieData().map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm text-dark-300">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ads Table */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-semibold text-white mb-6">
              Rendimiento por Anuncio
            </h3>
            <AdTable ads={data.ads} />
          </div>
        </>
      )}
    </div>
  )
}
