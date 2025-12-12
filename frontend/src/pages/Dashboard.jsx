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
  Wallet,
  ArrowDownLeft,
  CircleDollarSign,
  Receipt
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
  Cell,
  LineChart,
  Line,
  Legend
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
  const [walletHistory, setWalletHistory] = useState(null)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [selectedAccount, setSelectedAccount] = useState('')
  const [accounts, setAccounts] = useState([])
  const [selectedCampaigns, setSelectedCampaigns] = useState([])
  const [selectedProjectionCampaigns, setSelectedProjectionCampaigns] = useState([])
  const [projectionPending, setProjectionPending] = useState(0)
  const [projectionDeliveryRate, setProjectionDeliveryRate] = useState(70)
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
      loadWalletHistory()
    }
  }, [selectedAccount, dateRange])

  // Auto-llenar calculadora de proyección con datos de Dropi
  useEffect(() => {
    if (dropiData?.orders) {
      // Auto-llenar pedidos pendientes con los que están "en ruta"
      setProjectionPending(dropiData.orders.en_ruta || 0)
      // Auto-posicionar slider en la tasa de entrega efectiva actual
      setProjectionDeliveryRate(dropiData.orders.effective_delivery_rate || 70)
    }
  }, [dropiData])

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
      // Normalizar campos: backend usa 'id' y 'name', frontend espera 'account_id' y 'account_name'
      const rawAccounts = response.data.accounts || []
      const normalizedAccounts = rawAccounts.map(acc => ({
        account_id: acc.account_id || acc.id,
        account_name: acc.account_name || acc.name,
        connected_at: acc.connected_at
      }))
      const filteredAccounts = normalizedAccounts.filter(acc => !acc.account_name?.includes('(Read-Only)'))
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

  const loadWalletHistory = async () => {
    try {
      const response = await api.get(`/dropi/wallet/history?start_date=${dateRange.start}&end_date=${dateRange.end}`)
      setWalletHistory(response.data)
    } catch (err) {
      console.log('Wallet history error:', err)
      setWalletHistory(null)
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
    const { delivered, returned, en_ruta, cancelled, pending_confirmation } = dropiData.orders
    return [
      { name: 'Entregados', value: delivered || 0, color: '#22c55e' },
      { name: 'Devueltos', value: returned || 0, color: '#ef4444' },
      { name: 'En Ruta', value: en_ruta || 0, color: '#f59e0b' },
      { name: 'Cancelados', value: cancelled || 0, color: '#6b7280' },
      { name: 'Pend. Confirm.', value: pending_confirmation || 0, color: '#8b5cf6' }
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

          <button onClick={() => { loadDashboard(); loadDropiData(); loadWalletHistory(); }} disabled={loading} className="btn-ghost flex items-center gap-2">
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
          {/* Dropi Section PRIMERO (si está conectado) */}
          {dropiData?.connected && (
            <div className="space-y-4">
              {/* Header de Dropi con línea divisoria */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/10">
                    <Package className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-white">Métricas Dropi</h3>
                    <p className="text-xs text-dark-400">Pedidos y fulfillment</p>
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-500/20 to-transparent" />
              </div>
              
              {/* Stats de Dropi - Fila Principal */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard title="Total Pedidos" value={dropiData.orders?.total || 0} icon={ShoppingCart} iconColor="text-orange-400" iconBg="bg-orange-500/10" />
                <StatCard title="Entregados" value={dropiData.orders?.delivered || 0} icon={Truck} iconColor="text-green-400" iconBg="bg-green-500/10" />
                <StatCard title="Devueltos" value={dropiData.orders?.returned || 0} icon={RotateCcw} iconColor="text-red-400" iconBg="bg-red-500/10" />
                <StatCard title="En Ruta" value={dropiData.orders?.en_ruta || 0} icon={Clock} iconColor="text-yellow-400" iconBg="bg-yellow-500/10" />
                <StatCard title="Cancelados" value={dropiData.orders?.cancelled || 0} icon={X} iconColor="text-gray-400" iconBg="bg-gray-500/10" />
                <StatCard title="Wallet" value={dropiData.wallet?.balance || 0} prefix="$" icon={Wallet} iconColor="text-purple-400" iconBg="bg-purple-500/10" />
              </div>

              {/* Stats de Dropi - Fila de Tasas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-2xl p-4 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-dark-400">Tasa Entrega</p>
                      <p className="text-2xl font-bold text-green-400">{dropiData.orders?.effective_delivery_rate || 0}%</p>
                    </div>
                    <div className="p-2 rounded-xl bg-green-500/10">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <p className="text-[10px] text-dark-500 mt-1">{dropiData.orders?.delivered || 0} de {(dropiData.orders?.delivered || 0) + (dropiData.orders?.returned || 0)} completados</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-red-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-dark-400">Tasa Devolución</p>
                      <p className="text-2xl font-bold text-red-400">{dropiData.orders?.effective_return_rate || 0}%</p>
                    </div>
                    <div className="p-2 rounded-xl bg-red-500/10">
                      <RotateCcw className="w-5 h-5 text-red-400" />
                    </div>
                  </div>
                  <p className="text-[10px] text-dark-500 mt-1">{dropiData.orders?.returned || 0} de {(dropiData.orders?.delivered || 0) + (dropiData.orders?.returned || 0)} completados</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-gray-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-dark-400">Tasa Cancelación</p>
                      <p className="text-2xl font-bold text-gray-400">{dropiData.orders?.cancellation_rate || 0}%</p>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-500/10">
                      <X className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-[10px] text-dark-500 mt-1">{dropiData.orders?.cancelled || 0} de {dropiData.orders?.total || 0} pedidos</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-dark-400">Operación Completada</p>
                      <p className="text-2xl font-bold text-cyan-400">{dropiData.orders?.completion_rate || 0}%</p>
                    </div>
                    <div className="p-2 rounded-xl bg-cyan-500/10">
                      <Check className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <p className="text-[10px] text-dark-500 mt-1">{(dropiData.orders?.delivered || 0) + (dropiData.orders?.returned || 0)} de {dropiData.orders?.total_operativo || 0} operativos</p>
                </div>
              </div>

              {/* Gráfico de Tendencias por Día */}
              {dropiData.daily && dropiData.daily.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-white mb-4">Tendencia de Pedidos por Día</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={dropiData.daily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={11}
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getDate()}/${date.getMonth() + 1}`
                        }}
                      />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} 
                        labelStyle={{ color: '#f1f5f9' }}
                        labelFormatter={(value) => {
                          const date = new Date(value)
                          return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="delivered" stroke="#22c55e" strokeWidth={2} name="Entregados" dot={{ fill: '#22c55e', r: 3 }} />
                      <Line type="monotone" dataKey="returned" stroke="#ef4444" strokeWidth={2} name="Devueltos" dot={{ fill: '#ef4444', r: 3 }} />
                      <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pendientes" dot={{ fill: '#f59e0b', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Consolidado de Cartera (Ingresos y Egresos del período) */}
          {walletHistory?.summary && dropiData?.connected && (
            <div className="space-y-4">
              {/* Header de Cartera */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10">
                    <Receipt className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-white">Movimientos de Cartera</h3>
                    <p className="text-xs text-dark-400">Ingresos y egresos del período</p>
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
              </div>

              {/* Tarjetas de Consolidado */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass rounded-2xl p-5 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownLeft className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Total Ingresos</span>
                  </div>
                  <p className="text-2xl font-display font-bold text-green-400">
                    {formatCurrency(walletHistory.summary.total_in)}
                  </p>
                </div>
                <div className="glass rounded-2xl p-5 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Total Egresos</span>
                  </div>
                  <p className="text-2xl font-display font-bold text-red-400">
                    {formatCurrency(walletHistory.summary.total_out)}
                  </p>
                </div>
                <div className={`glass rounded-2xl p-5 border ${walletHistory.summary.net >= 0 ? 'border-lucid-500/20' : 'border-orange-500/20'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CircleDollarSign className={`w-5 h-5 ${walletHistory.summary.net >= 0 ? 'text-lucid-400' : 'text-orange-400'}`} />
                    <span className={`text-sm font-medium ${walletHistory.summary.net >= 0 ? 'text-lucid-400' : 'text-orange-400'}`}>Balance Neto</span>
                  </div>
                  <p className={`text-2xl font-display font-bold ${walletHistory.summary.net >= 0 ? 'text-lucid-400' : 'text-orange-400'}`}>
                    {formatCurrency(walletHistory.summary.net)}
                  </p>
                </div>
                <div className="glass rounded-2xl p-5 border border-dark-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-dark-400" />
                    <span className="text-dark-400 text-sm font-medium">Transacciones</span>
                  </div>
                  <p className="text-2xl font-display font-bold text-white">
                    {walletHistory.summary.count}
                  </p>
                </div>
              </div>

              {/* Gráfica de Ingresos vs Egresos por Día */}
              {walletHistory.daily && walletHistory.daily.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-white">Ingresos vs Egresos por Día</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-xs text-dark-300">Ingresos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-xs text-dark-300">Egresos</span>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={walletHistory.daily}>
                      <defs>
                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis 
                        dataKey="display_date" 
                        stroke="#64748b" 
                        fontSize={11}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(value) => value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value >= 1000 ? `${(value/1000).toFixed(0)}K` : value}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} 
                        labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
                        formatter={(value, name) => [formatCurrency(value), name === 'ingresos' ? '💰 Ingresos' : '💸 Egresos']}
                        labelFormatter={(label) => `📅 ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="ingresos" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorIngresos)" 
                        dot={{ r: 3, fill: '#22c55e' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="egresos" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorEgresos)" 
                        dot={{ r: 3, fill: '#ef4444' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* NUEVO: Gráfica de Ganancias Dropshipping vs Devoluciones */}
              {walletHistory.dropshipping?.daily && walletHistory.dropshipping.daily.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-white">Ganancias vs Devoluciones</h3>
                      <p className="text-xs text-dark-400">Basado en fecha de creación del pedido</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-xs text-dark-300">Ganancias</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-xs text-dark-300">Devoluciones</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Resumen Dropshipping - Basado en ÓRDENES (fecha creación) */}
                  {(() => {
                    // Usar datos de órdenes (por fecha de creación del pedido)
                    const ordersDeliveredProfit = dropiData?.orders?.delivered_profit || 0
                    const ordersReturned = dropiData?.orders?.returned || 0
                    const ordersDelivered = dropiData?.orders?.delivered || 0
                    const ordersEnRuta = dropiData?.orders?.en_ruta || 0
                    const ordersPendingProfit = dropiData?.orders?.pending_profit || 0
                    
                    // Usar promedio de devolución del wallet history (costo real) o default
                    const promDevolucion = walletHistory?.dropshipping?.promedio_devolucion || 15265
                    const promGanancia = ordersDelivered > 0 ? Math.round(ordersDeliveredProfit / ordersDelivered) : 0
                    
                    // Calcular costo de devoluciones basado en órdenes devueltas × promedio real
                    const costoDevolucionesReal = ordersReturned * promDevolucion
                    
                    // Utilidad neta del período
                    const utilidadNeta = ordersDeliveredProfit - costoDevolucionesReal
                    
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                        <div className="bg-emerald-500/10 rounded-xl p-3 text-center">
                          <p className="text-xs text-emerald-400 mb-1">Ganancias</p>
                          <p className="text-lg font-bold text-emerald-400">{formatCurrency(ordersDeliveredProfit)}</p>
                          <p className="text-[10px] text-emerald-400/60">{ordersDelivered} entregas</p>
                        </div>
                        <div className="bg-orange-500/10 rounded-xl p-3 text-center">
                          <p className="text-xs text-orange-400 mb-1">Devoluciones</p>
                          <p className="text-lg font-bold text-orange-400">{formatCurrency(costoDevolucionesReal)}</p>
                          <p className="text-[10px] text-orange-400/60">{ordersReturned} devs</p>
                        </div>
                        <div className="bg-blue-500/10 rounded-xl p-3 text-center">
                          <p className="text-xs text-blue-400 mb-1">Prom. Entrega</p>
                          <p className="text-lg font-bold text-blue-400">{formatCurrency(promGanancia)}</p>
                        </div>
                        <div className="bg-purple-500/10 rounded-xl p-3 text-center">
                          <p className="text-xs text-purple-400 mb-1">Prom. Devolución</p>
                          <p className="text-lg font-bold text-purple-400">{formatCurrency(promDevolucion)}</p>
                        </div>
                        <div className={`${utilidadNeta >= 0 ? 'bg-cyan-500/10' : 'bg-red-500/10'} rounded-xl p-3 text-center`}>
                          <p className={`text-xs ${utilidadNeta >= 0 ? 'text-cyan-400' : 'text-red-400'} mb-1`}>Utilidad Neta</p>
                          <p className={`text-lg font-bold ${utilidadNeta >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>{formatCurrency(utilidadNeta)}</p>
                        </div>
                      </div>
                    )
                  })()}
                  
                  {/* Info sobre pendientes en ruta */}
                  {dropiData?.orders?.en_ruta > 0 && (
                    <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-sm text-yellow-400">
                        🚚 <strong>{dropiData.orders.en_ruta}</strong> pedidos en ruta por valor potencial de <strong>{formatCurrency(dropiData.orders.pending_profit || 0)}</strong>
                      </p>
                    </div>
                  )}

                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={walletHistory.dropshipping.daily}>
                      <defs>
                        <linearGradient id="colorGanancias" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDevoluciones" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis 
                        dataKey="display_date" 
                        stroke="#64748b" 
                        fontSize={11}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(value) => value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value >= 1000 ? `${(value/1000).toFixed(0)}K` : value}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} 
                        labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
                        formatter={(value, name) => [formatCurrency(value), name === 'ganancias' ? '✅ Ganancia Entrega' : '↩️ Devolución']}
                        labelFormatter={(label) => `📅 ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="ganancias" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorGanancias)" 
                        dot={{ r: 3, fill: '#10b981' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="devoluciones" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorDevoluciones)" 
                        dot={{ r: 3, fill: '#f97316' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* SECCIÓN DE CONCILIACIÓN */}
              {walletHistory.dropshipping && dropiData?.orders && (
                <div className="glass rounded-2xl p-6 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-amber-500/10">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white">Conciliación Dropi</h3>
                      <p className="text-xs text-dark-400">Órdenes del período vs pagos/cobros procesados en wallet</p>
                    </div>
                  </div>

                  {(() => {
                    const ordersDelivered = dropiData.orders?.delivered || 0
                    const ordersReturned = dropiData.orders?.returned || 0
                    const walletGanancias = walletHistory.dropshipping?.count_ganancias || 0
                    const walletDevoluciones = walletHistory.dropshipping?.count_devoluciones || 0
                    
                    // Usar promedio de órdenes si está disponible, sino del wallet
                    const ordersDeliveredProfit = dropiData?.orders?.delivered_profit || 0
                    const avgGanancia = ordersDelivered > 0 ? ordersDeliveredProfit / ordersDelivered : (walletHistory.dropshipping?.promedio_ganancia || 0)
                    const avgDevolucion = walletHistory.dropshipping?.promedio_devolucion || 15265
                    
                    // Pendientes pueden ser negativos si hay pagos de períodos anteriores
                    const entregasPendientesPago = Math.max(0, ordersDelivered - walletGanancias)
                    const devolucionesPendientesCobro = Math.max(0, ordersReturned - walletDevoluciones)
                    
                    const dineroporRecibir = entregasPendientesPago * avgGanancia
                    const dineroPorDescontar = devolucionesPendientesCobro * avgDevolucion
                    const impactoNeto = dineroporRecibir - dineroPorDescontar

                    const todoOk = entregasPendientesPago === 0 && devolucionesPendientesCobro === 0

                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Entregas */}
                          <div className={`rounded-xl p-4 ${entregasPendientesPago === 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">Entregas</span>
                              {entregasPendientesPago === 0 ? (
                                <span className="text-xs text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Conciliado</span>
                              ) : (
                                <span className="text-xs text-amber-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Pendiente</span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center">
                              <div>
                                <p className="text-[10px] text-dark-400">Órdenes</p>
                                <p className="text-lg font-bold text-green-400">{ordersDelivered}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-dark-400">Pagadas</p>
                                <p className="text-lg font-bold text-emerald-400">{walletGanancias}</p>
                              </div>
                            </div>
                            {entregasPendientesPago > 0 && (
                              <div className="mt-2 pt-2 border-t border-amber-500/20">
                                <p className="text-xs text-amber-400 text-center">
                                  💰 {entregasPendientesPago} pendiente(s) de pago ≈ {formatCurrency(dineroporRecibir)}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Devoluciones */}
                          <div className={`rounded-xl p-4 ${devolucionesPendientesCobro === 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">Devoluciones</span>
                              {devolucionesPendientesCobro === 0 ? (
                                <span className="text-xs text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Conciliado</span>
                              ) : (
                                <span className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Pendiente</span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center">
                              <div>
                                <p className="text-[10px] text-dark-400">Órdenes</p>
                                <p className="text-lg font-bold text-red-400">{ordersReturned}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-dark-400">Cobradas</p>
                                <p className="text-lg font-bold text-orange-400">{walletDevoluciones}</p>
                              </div>
                            </div>
                            {devolucionesPendientesCobro > 0 && (
                              <div className="mt-2 pt-2 border-t border-red-500/20">
                                <p className="text-xs text-red-400 text-center">
                                  ⚠️ {devolucionesPendientesCobro} pendiente(s) de cobro ≈ {formatCurrency(dineroPorDescontar)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Resumen de Impacto */}
                        {!todoOk && (
                          <div className={`rounded-xl p-4 text-center ${impactoNeto >= 0 ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20' : 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20'}`}>
                            <p className="text-xs text-dark-400 mb-1">Impacto Pendiente en tu Utilidad</p>
                            <p className={`text-xl font-bold ${impactoNeto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {impactoNeto >= 0 ? '+' : ''}{formatCurrency(impactoNeto)}
                            </p>
                            <p className="text-[10px] text-dark-500 mt-1">
                              {dineroporRecibir > 0 && `+${formatCurrency(dineroporRecibir)} por recibir`}
                              {dineroporRecibir > 0 && dineroPorDescontar > 0 && ' | '}
                              {dineroPorDescontar > 0 && `-${formatCurrency(dineroPorDescontar)} por descontar`}
                            </p>
                          </div>
                        )}

                        {todoOk && (
                          <div className="rounded-xl p-4 text-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                            <p className="text-sm text-green-400 flex items-center justify-center gap-2">
                              <Check className="w-4 h-4" /> Todas las órdenes están conciliadas con la wallet
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* CALCULADORA DE PROYECCIÓN */}
              {walletHistory.dropshipping && data?.summary && (
                <div className="glass rounded-2xl p-6 border border-lucid-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-lucid-500/10">
                      <Target className="w-5 h-5 text-lucid-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white">Calculadora de Proyección</h3>
                      <p className="text-xs text-dark-400">Estima tu ganancia/pérdida según % de entrega</p>
                    </div>
                  </div>

                  {/* Selector de Campañas para Gasto Ads */}
                  <div className="mb-4">
                    <label className="text-xs text-dark-400 mb-2 block">Campañas a incluir en gasto publicitario:</label>
                    <div className="flex flex-wrap gap-2">
                      {availableCampaigns.map(campaign => (
                        <button
                          key={campaign}
                          onClick={() => {
                            if (selectedProjectionCampaigns.includes(campaign)) {
                              setSelectedProjectionCampaigns(prev => prev.filter(c => c !== campaign))
                            } else {
                              setSelectedProjectionCampaigns(prev => [...prev, campaign])
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedProjectionCampaigns.includes(campaign)
                              ? 'bg-lucid-500 text-white'
                              : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                          }`}
                        >
                          {campaign}
                        </button>
                      ))}
                    </div>
                    {selectedProjectionCampaigns.length > 0 && (
                      <p className="text-xs text-lucid-400 mt-2">
                        Gasto seleccionado: {formatCurrency(
                          data.ads
                            ?.filter(ad => selectedProjectionCampaigns.includes(ad.campaign_name))
                            .reduce((sum, ad) => sum + (ad.spend || 0), 0) || 0
                        )}
                      </p>
                    )}
                  </div>

                  {/* Mensaje de operación casi completada */}
                  {dropiData?.orders?.completion_rate >= 95 && (
                    <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <p className="text-sm text-cyan-400 text-center">
                        ✅ Operación {dropiData.orders.completion_rate}% completada — Solo quedan <span className="font-bold">{dropiData.orders.en_ruta}</span> pedido(s) por definir
                      </p>
                    </div>
                  )}

                  {/* Inputs de Proyección */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-dark-400 mb-1 block">
                        Pedidos En Ruta 🚚
                        <span className="text-[10px] text-dark-500 ml-1">(auto)</span>
                      </label>
                      <input
                        type="number"
                        value={projectionPending}
                        onChange={(e) => setProjectionPending(parseInt(e.target.value) || 0)}
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:border-lucid-500 focus:outline-none"
                        min="0"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-dark-400 mb-1 block">
                        % Entrega Proyectado: <span className="text-lucid-400 font-bold">{projectionDeliveryRate}%</span>
                        <span className="text-[10px] text-dark-500 ml-1">(actual: {dropiData?.orders?.effective_delivery_rate || 0}%)</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={projectionDeliveryRate}
                        onChange={(e) => setProjectionDeliveryRate(parseInt(e.target.value))}
                        className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-lucid-500"
                      />
                      <div className="flex justify-between text-[10px] text-dark-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-dark-400 mb-1 block">Entregarán</label>
                      <div className="bg-emerald-500/10 rounded-lg px-3 py-2 text-emerald-400 font-bold text-center">
                        {Math.round(projectionPending * projectionDeliveryRate / 100)}
                      </div>
                    </div>
                  </div>

                  {/* Resultado de Proyección */}
                  {(() => {
                    const pendingToDeliver = Math.round(projectionPending * projectionDeliveryRate / 100)
                    const pendingToReturn = projectionPending - pendingToDeliver
                    
                    // Calcular promedio de ganancia desde órdenes (más preciso)
                    const ordersDeliveredProfit = dropiData?.orders?.delivered_profit || 0
                    const ordersDelivered = dropiData?.orders?.delivered || 0
                    const avgGain = ordersDelivered > 0 ? ordersDeliveredProfit / ordersDelivered : (walletHistory?.dropshipping?.promedio_ganancia || 0)
                    
                    // Usar promedio de devolución del wallet history (costo real)
                    const avgReturn = walletHistory?.dropshipping?.promedio_devolucion || 15265
                    
                    const projectedGains = pendingToDeliver * avgGain
                    const projectedReturns = pendingToReturn * avgReturn
                    const adSpend = data.ads
                      ?.filter(ad => selectedProjectionCampaigns.includes(ad.campaign_name))
                      .reduce((sum, ad) => sum + (ad.spend || 0), 0) || 0
                    
                    // Utilidad actual basada en órdenes (fecha de creación)
                    const ordersReturned = dropiData?.orders?.returned || 0
                    const costoDevolucionesReal = ordersReturned * avgReturn
                    const currentUtility = ordersDeliveredProfit - costoDevolucionesReal
                    
                    const projectedTotal = currentUtility + projectedGains - projectedReturns - adSpend
                    
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="bg-dark-700/50 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-dark-400 mb-1">Utilidad Actual</p>
                          <p className="text-sm font-bold text-cyan-400">{formatCurrency(currentUtility)}</p>
                        </div>
                        <div className="bg-emerald-500/10 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-emerald-400 mb-1">+ Proyección Entregas</p>
                          <p className="text-sm font-bold text-emerald-400">{formatCurrency(projectedGains)}</p>
                          <p className="text-[9px] text-emerald-400/60">{pendingToDeliver} × {formatCurrency(avgGain)}</p>
                        </div>
                        <div className="bg-orange-500/10 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-orange-400 mb-1">- Proyección Devs</p>
                          <p className="text-sm font-bold text-orange-400">{formatCurrency(projectedReturns)}</p>
                          <p className="text-[9px] text-orange-400/60">{pendingToReturn} × {formatCurrency(avgReturn)}</p>
                        </div>
                        <div className="bg-red-500/10 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-red-400 mb-1">- Gasto Ads</p>
                          <p className="text-sm font-bold text-red-400">{formatCurrency(adSpend)}</p>
                          <p className="text-[9px] text-red-400/60">{selectedProjectionCampaigns.length} campaña(s)</p>
                        </div>
                        <div className={`${projectedTotal >= 0 ? 'bg-gradient-to-br from-lucid-500/20 to-cyan-500/20 border-lucid-500/30' : 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30'} border rounded-xl p-3 text-center`}>
                          <p className={`text-[10px] ${projectedTotal >= 0 ? 'text-lucid-400' : 'text-red-400'} mb-1`}>
                            {projectedTotal >= 0 ? '🎯 GANANCIA' : '⚠️ PÉRDIDA'}
                          </p>
                          <p className={`text-lg font-bold ${projectedTotal >= 0 ? 'text-lucid-400' : 'text-red-400'}`}>
                            {formatCurrency(Math.abs(projectedTotal))}
                          </p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Header de Meta Ads */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">Métricas Meta</h3>
                <p className="text-xs text-dark-400">Facebook & Instagram Ads</p>
              </div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-500/20 to-transparent" />
          </div>

          {/* Meta Ads Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Gasto Total" value={filteredSummary.total_spend} icon={DollarSign} prefix="$" iconColor="text-blue-400" iconBg="bg-blue-500/10" />
            <StatCard title="Revenue" value={filteredSummary.total_revenue} icon={TrendingUp} prefix="$" change={filteredSummary.total_revenue > filteredSummary.total_spend ? 'up' : 'down'} trend={filteredSummary.total_revenue > filteredSummary.total_spend ? 'up' : 'down'} iconColor="text-green-400" iconBg="bg-green-500/10" />
            <StatCard title="Leads" value={filteredSummary.total_leads} icon={Users} iconColor="text-cyan-400" iconBg="bg-cyan-500/10" />
            <StatCard title="Ventas" value={filteredSummary.total_sales} icon={ShoppingCart} iconColor="text-purple-400" iconBg="bg-purple-500/10" />
          </div>

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
