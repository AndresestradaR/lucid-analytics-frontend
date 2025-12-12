import { useState, useEffect, useRef } from 'react'
import { api, formatCurrency, formatNumber, formatPercent } from '../utils/api'
import Chat, { ChatButton } from '../components/Chat'
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
  ArrowDownRight,
  Filter,
  X,
  Check,
  ChevronDown,
  Activity,
  Package,
  Truck,
  RotateCcw,
  Clock,
  Wallet
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

// Definición de estados CPA
const CPA_STATUSES = [
  { id: 'escala', label: '🚀 ESCALA', color: 'text-lime-400', bg: 'bg-lime-500/10', min: 0, max: 5000 },
  { id: 'vas_bien', label: '✅ Vas bien', color: 'text-cyan-400', bg: 'bg-cyan-500/10', min: 5001, max: 12000 },
  { id: 'optimizar', label: '⚠️ Optimizar', color: 'text-yellow-400', bg: 'bg-yellow-500/10', min: 12001, max: 18000 },
  { id: 'apagar', label: '🛑 APAGAR', color: 'text-red-500', bg: 'bg-red-500/10', min: 18001, max: Infinity },
  { id: 'sin_ventas', label: '⏳ Sin ventas', color: 'text-dark-400', bg: 'bg-dark-700', min: null, max: null }
]

function StatCard({ title, value, change, icon: Icon, trend, prefix = '', suffix = '', iconColor = 'text-lucid-400', iconBg = 'bg-lucid-500/10' }) {
  const isPositive = trend === 'up' || (typeof change === 'number' && change > 0)
  
  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
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

// Componente MultiSelect para campañas
function CampaignFilter({ campaigns, selectedCampaigns, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleCampaign = (campaignName) => {
    if (selectedCampaigns.includes(campaignName)) {
      onChange(selectedCampaigns.filter(c => c !== campaignName))
    } else {
      onChange([...selectedCampaigns, campaignName])
    }
  }

  const selectAll = () => onChange(campaigns)
  const clearAll = () => onChange([])

  const selectedCount = selectedCampaigns.length
  const totalCount = campaigns.length

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm hover:border-dark-600 transition-colors"
      >
        <Filter className="w-4 h-4 text-dark-400" />
        <span>
          {selectedCount === 0 ? 'Filtrar campañas' : selectedCount === totalCount ? 'Todas las campañas' : `${selectedCount} campaña${selectedCount > 1 ? 's' : ''}`}
        </span>
        <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-80 bg-dark-800 border border-dark-700 rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-dark-700">
            <span className="text-sm font-medium text-white">Campañas</span>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-xs text-lucid-400 hover:text-lucid-300">Todas</button>
              <span className="text-dark-600">|</span>
              <button onClick={clearAll} className="text-xs text-dark-400 hover:text-white">Ninguna</button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {campaigns.length === 0 ? (
              <p className="p-4 text-center text-dark-400 text-sm">No hay campañas</p>
            ) : (
              campaigns.map((campaign) => (
                <div
                  key={campaign}
                  onClick={() => toggleCampaign(campaign)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-dark-700/50 cursor-pointer transition-colors"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedCampaigns.includes(campaign) ? 'bg-lucid-500 border-lucid-500' : 'border-dark-600'}`}>
                    {selectedCampaigns.includes(campaign) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-white truncate">{campaign}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Componente filtro por Estado CPA
function StatusFilter({ selectedStatuses, onChange, adCounts }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleStatus = (statusId) => {
    if (selectedStatuses.includes(statusId)) {
      onChange(selectedStatuses.filter(s => s !== statusId))
    } else {
      onChange([...selectedStatuses, statusId])
    }
  }

  const selectAll = () => onChange(CPA_STATUSES.map(s => s.id))
  const clearAll = () => onChange([])

  const selectedCount = selectedStatuses.length
  const totalCount = CPA_STATUSES.length

  const getButtonLabel = () => {
    if (selectedCount === 0) return 'Filtrar estado'
    if (selectedCount === totalCount) return 'Todos los estados'
    if (selectedCount === 1) {
      const status = CPA_STATUSES.find(s => s.id === selectedStatuses[0])
      return status?.label || 'Estado'
    }
    return `${selectedCount} estados`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm hover:border-dark-600 transition-colors"
      >
        <Activity className="w-4 h-4 text-dark-400" />
        <span>{getButtonLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-dark-800 border border-dark-700 rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-dark-700">
            <span className="text-sm font-medium text-white">Estado CPA</span>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-xs text-lucid-400 hover:text-lucid-300">Todos</button>
              <span className="text-dark-600">|</span>
              <button onClick={clearAll} className="text-xs text-dark-400 hover:text-white">Ninguno</button>
            </div>
          </div>
          <div className="py-1">
            {CPA_STATUSES.map((status) => (
              <div
                key={status.id}
                onClick={() => toggleStatus(status.id)}
                className="flex items-center justify-between px-4 py-2 hover:bg-dark-700/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedStatuses.includes(status.id) ? 'bg-lucid-500 border-lucid-500' : 'border-dark-600'}`}>
                    {selectedStatuses.includes(status.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                </div>
                <span className="text-xs text-dark-500">{adCounts[status.id] || 0}</span>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-dark-700 bg-dark-900/50">
            <p className="text-xs text-dark-500 mb-2">Rangos de CPA:</p>
            <div className="space-y-1 text-xs">
              <p className="text-lime-400">🚀 $0 - $5,000</p>
              <p className="text-cyan-400">✅ $5,001 - $12,000</p>
              <p className="text-yellow-400">⚠️ $12,001 - $18,000</p>
              <p className="text-red-500">🛑 $18,001+</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getCPAStatus(cpa) {
  if (!cpa || cpa <= 0) return { color: 'text-dark-400', bg: '', message: '', emoji: '', id: 'sin_ventas' }
  if (cpa <= 5000) return { color: 'text-lime-400', bg: 'bg-lime-500/10', message: '¡ESCALA!', emoji: '🚀', id: 'escala' }
  if (cpa <= 12000) return { color: 'text-cyan-400', bg: 'bg-cyan-500/10', message: 'Vas bien', emoji: '✅', id: 'vas_bien' }
  if (cpa <= 18000) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', message: 'Optimizar', emoji: '⚠️', id: 'optimizar' }
  return { color: 'text-red-500', bg: 'bg-red-500/10', message: 'APAGAR', emoji: '🛑', id: 'apagar' }
}

function getAdStatusId(ad) {
  if (!ad.cpa || ad.cpa <= 0) return 'sin_ventas'
  if (ad.cpa <= 5000) return 'escala'
  if (ad.cpa <= 12000) return 'vas_bien'
  if (ad.cpa <= 18000) return 'optimizar'
  return 'apagar'
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
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">Budget</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">Gasto</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">CTR</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">CPM</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">Msgs</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">$/Msg</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">Leads</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">Ventas</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">CPA</th>
            <th className="text-center py-3 px-4 text-dark-400 font-medium text-sm">Estado</th>
            <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">ROAS</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad, index) => {
            const cpaStatus = getCPAStatus(ad.cpa)
            return (
              <tr key={ad.ad_id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    {ad.campaign_name && <p className="text-amber-400 text-xs font-medium">📁 {ad.campaign_name}</p>}
                    {ad.adset_name && <p className="text-blue-400 text-xs">📋 {ad.adset_name}</p>}
                    <p className="text-white font-medium">{ad.ad_name || `Anuncio ${index + 1}`}</p>
                    <p className="text-dark-300 text-xs font-mono opacity-70">{ad.ad_id}</p>
                  </div>
                </td>
                <td className="text-right py-4 px-4 text-white text-sm">
                  {ad.daily_budget ? <span className="text-purple-400">${formatNumber(ad.daily_budget)}/día</span> : ad.lifetime_budget ? <span className="text-purple-400">${formatNumber(ad.lifetime_budget)} total</span> : '-'}
                </td>
                <td className="text-right py-4 px-4 text-white">{formatCurrency(ad.spend)}</td>
                <td className="text-right py-4 px-4 text-white">{ad.ctr ? `${ad.ctr.toFixed(2)}%` : '-'}</td>
                <td className="text-right py-4 px-4 text-white">{ad.cpm ? formatCurrency(ad.cpm) : '-'}</td>
                <td className="text-right py-4 px-4 text-white">{ad.messaging_conversations || '-'}</td>
                <td className="text-right py-4 px-4 text-white">{ad.cost_per_messaging > 0 ? formatCurrency(ad.cost_per_messaging) : '-'}</td>
                <td className="text-right py-4 px-4 text-white">{ad.leads}</td>
                <td className="text-right py-4 px-4"><span className={ad.sales > 0 ? 'text-lucid-400 font-medium' : 'text-dark-400'}>{ad.sales}</span></td>
                <td className="text-right py-4 px-4"><span className={`font-bold ${cpaStatus.color}`}>{ad.cpa > 0 ? formatCurrency(ad.cpa) : '-'}</span></td>
                <td className="text-center py-4 px-4">
                  {ad.cpa > 0 && <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${cpaStatus.bg} ${cpaStatus.color}`}>{cpaStatus.emoji} {cpaStatus.message}</span>}
                </td>
                <td className="text-right py-4 px-4"><span className={`font-medium ${ad.roas >= 2 ? 'text-lucid-400' : ad.roas > 0 ? 'text-yellow-400' : 'text-dark-400'}`}>{ad.roas > 0 ? `${ad.roas.toFixed(2)}x` : '-'}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [dropiData, setDropiData] = useState(null)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [selectedAccount, setSelectedAccount] = useState('')
  const [accounts, setAccounts] = useState([])
  const [selectedCampaigns, setSelectedCampaigns] = useState([])
  const [availableCampaigns, setAvailableCampaigns] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    loadAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      loadDashboard()
      loadDropiData()
    }
  }, [selectedAccount, dateRange])

  useEffect(() => {
    if (data?.ads) {
      const campaigns = [...new Set(data.ads.map(ad => ad.campaign_name).filter(Boolean))]
      setAvailableCampaigns(campaigns)
      if (selectedCampaigns.length === 0 && campaigns.length > 0) {
        setSelectedCampaigns(campaigns)
      }
      if (selectedStatuses.length === 0) {
        setSelectedStatuses(CPA_STATUSES.map(s => s.id))
      }
    }
  }, [data])

  const loadAccounts = async () => {
    try {
      const response = await api.get('/meta/accounts')
      const filteredAccounts = (response.data.accounts || []).filter(acc => !acc.account_name.includes('(Read-Only)'))
      setAccounts(filteredAccounts)
      if (filteredAccounts.length > 0) {
        setSelectedAccount(filteredAccounts[0].account_id)
      }
    } catch (err) {
      console.error('Error loading accounts:', err)
    }
  }

  const loadDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/analytics/dashboard?account_id=${selectedAccount}&start_date=${dateRange.start}&end_date=${dateRange.end}`)
      setData(response.data)
    } catch (err) {
      setError(err.message || 'Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  const loadDropiData = async () => {
    try {
      const response = await api.get(`/dropi/summary?start_date=${dateRange.start}&end_date=${dateRange.end}`)
      setDropiData(response.data)
    } catch (err) {
      console.log('Dropi not connected or error:', err)
      setDropiData(null)
    }
  }

  const getStatusCounts = () => {
    if (!data?.ads) return {}
    const counts = {}
    CPA_STATUSES.forEach(s => counts[s.id] = 0)
    let adsToCount = data.ads
    if (selectedCampaigns.length > 0) {
      adsToCount = data.ads.filter(ad => selectedCampaigns.includes(ad.campaign_name))
    }
    adsToCount.forEach(ad => {
      const statusId = getAdStatusId(ad)
      counts[statusId] = (counts[statusId] || 0) + 1
    })
    return counts
  }

  const getFilteredAds = () => {
    if (!data?.ads) return []
    let filtered = data.ads
    if (selectedCampaigns.length > 0) {
      filtered = filtered.filter(ad => selectedCampaigns.includes(ad.campaign_name))
    }
    if (selectedStatuses.length > 0 && selectedStatuses.length < CPA_STATUSES.length) {
      filtered = filtered.filter(ad => selectedStatuses.includes(getAdStatusId(ad)))
    }
    return filtered
  }

  const getFilteredSummary = () => {
    const filteredAds = getFilteredAds()
    if (filteredAds.length === 0) return data?.summary || {}
    const totalSpend = filteredAds.reduce((sum, ad) => sum + (ad.spend || 0), 0)
    const totalRevenue = filteredAds.reduce((sum, ad) => sum + (ad.revenue || 0), 0)
    const totalLeads = filteredAds.reduce((sum, ad) => sum + (ad.leads || 0), 0)
    const totalSales = filteredAds.reduce((sum, ad) => sum + (ad.sales || 0), 0)
    return {
      total_spend: totalSpend,
      total_revenue: totalRevenue,
      total_leads: totalLeads,
      total_sales: totalSales,
      average_cpa: totalSales > 0 ? totalSpend / totalSales : 0,
      average_roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
      profit: totalRevenue - totalSpend
    }
  }

  const prepareChartData = () => {
    const filteredAds = getFilteredAds()
    if (!filteredAds.length) return []
    return filteredAds.map(ad => ({
      name: ad.ad_name?.substring(0, 15) || 'Ad',
      gasto: ad.spend,
      revenue: ad.revenue,
      leads: ad.leads,
      ventas: ad.sales
    }))
  }

  const preparePieData = () => {
    const filteredAds = getFilteredAds()
    if (!filteredAds.length) return []
    return filteredAds.filter(ad => ad.spend > 0).map(ad => ({
      name: ad.ad_name?.substring(0, 15) || 'Ad',
      value: ad.spend
    }))
  }

  const prepareDropiPieData = () => {
    if (!dropiData?.orders) return []
    const { delivered, returned, pending } = dropiData.orders
    return [
      { name: 'Entregados', value: delivered || 0, color: '#22c55e' },
      { name: 'Devueltos', value: returned || 0, color: '#ef4444' },
      { name: 'Pendientes', value: pending || 0, color: '#f59e0b' }
    ].filter(d => d.value > 0)
  }

  const filteredSummary = getFilteredSummary()
  const filteredAds = getFilteredAds()
  const statusCounts = getStatusCounts()

  if (!selectedAccount && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-2xl bg-amber-500/10 mb-4">
          <AlertCircle className="w-12 h-12 text-amber-400" />
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-2">Conecta tu cuenta de Meta Ads</h2>
        <p className="text-dark-400 mb-6">Ve a Conexiones para vincular tu cuenta de Facebook Ads</p>
        <a href="/connect" className="btn-primary">Ir a Conexiones</a>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Dashboard</h1>
          <p className="text-dark-400">Métricas de tus campañas en tiempo real</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {accounts.length > 0 && (
            <select
              value={selectedAccount}
              onChange={(e) => {
                setSelectedAccount(e.target.value)
                setSelectedCampaigns([])
                setSelectedStatuses([])
              }}
              className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm focus:outline-none focus:border-lucid-500"
            >
              {accounts.map(acc => <option key={acc.account_id} value={acc.account_id}>{acc.account_name}</option>)}
            </select>
          )}

          {availableCampaigns.length > 0 && (
            <CampaignFilter campaigns={availableCampaigns} selectedCampaigns={selectedCampaigns} onChange={setSelectedCampaigns} />
          )}

          {data?.ads?.length > 0 && (
            <StatusFilter selectedStatuses={selectedStatuses} onChange={setSelectedStatuses} adCounts={statusCounts} />
          )}

          <div className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl">
            <Calendar className="w-4 h-4 text-dark-400" />
            <input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="bg-transparent text-white text-sm focus:outline-none" />
            <span className="text-dark-500">-</span>
            <input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="bg-transparent text-white text-sm focus:outline-none" />
          </div>

          <button onClick={() => { loadDashboard(); loadDropiData(); }} disabled={loading} className="btn-ghost flex items-center gap-2">
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
          {/* Meta Ads Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Gasto Total" value={filteredSummary.total_spend} icon={DollarSign} prefix="$" />
            <StatCard title="Revenue" value={filteredSummary.total_revenue} icon={TrendingUp} prefix="$" change={filteredSummary.total_revenue > filteredSummary.total_spend ? 'up' : 'down'} trend={filteredSummary.total_revenue > filteredSummary.total_spend ? 'up' : 'down'} />
            <StatCard title="Leads" value={filteredSummary.total_leads} icon={Users} />
            <StatCard title="Ventas" value={filteredSummary.total_sales} icon={ShoppingCart} />
          </div>

          {/* Dropi Stats (si está conectado) */}
          {dropiData?.connected && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard title="Entregados" value={dropiData.orders?.delivered || 0} icon={Truck} iconColor="text-green-400" iconBg="bg-green-500/10" />
              <StatCard title="Devueltos" value={dropiData.orders?.returned || 0} icon={RotateCcw} iconColor="text-red-400" iconBg="bg-red-500/10" />
              <StatCard title="Pendientes" value={dropiData.orders?.pending || 0} icon={Clock} iconColor="text-yellow-400" iconBg="bg-yellow-500/10" />
              <StatCard title="Tasa Entrega" value={dropiData.orders?.delivery_rate || 0} suffix="%" icon={Package} iconColor="text-blue-400" iconBg="bg-blue-500/10" />
              <StatCard title="Wallet" value={dropiData.wallet?.balance || 0} prefix="$" icon={Wallet} iconColor="text-purple-400" iconBg="bg-purple-500/10" />
            </div>
          )}

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-6">
              <p className="text-dark-400 text-sm mb-1">CPA Promedio</p>
              <p className="text-2xl font-display font-bold text-white">{formatCurrency(filteredSummary.average_cpa || 0)}</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="text-dark-400 text-sm mb-1">ROAS Promedio</p>
              <p className="text-2xl font-display font-bold text-lucid-400">{(filteredSummary.average_roas || 0).toFixed(2)}x</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="text-dark-400 text-sm mb-1">Profit {dropiData?.connected ? '(Dropi)' : ''}</p>
              <p className={`text-2xl font-display font-bold ${(dropiData?.orders?.net_profit || filteredSummary.profit) >= 0 ? 'text-lucid-400' : 'text-red-400'}`}>
                {formatCurrency(dropiData?.orders?.net_profit || filteredSummary.profit || 0)}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-white mb-6">Gasto vs Revenue por Anuncio</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepareChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} labelStyle={{ color: '#f1f5f9' }} />
                  <Bar dataKey="gasto" fill="#ef4444" name="Gasto" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenue" fill="#22c55e" name="Revenue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {dropiData?.connected ? (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display font-semibold text-white mb-6">Estado de Pedidos (Dropi)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={prepareDropiPieData()} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {prepareDropiPieData().map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {prepareDropiPieData().map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm text-dark-300">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display font-semibold text-white mb-6">Distribución de Gasto</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={preparePieData()} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {preparePieData().map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} formatter={(value) => formatCurrency(value)} />
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
            )}
          </div>

          {/* Ads Table */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-white">Rendimiento por Anuncio</h3>
              <span className="text-sm text-dark-400">Mostrando {filteredAds.length} de {data.ads?.length || 0} anuncios</span>
            </div>
            <AdTable ads={filteredAds} />
          </div>
        </>
      )}

      {/* Chat Button and Modal */}
      <ChatButton onClick={() => setChatOpen(true)} />
      <Chat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
