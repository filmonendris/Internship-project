import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, RefreshCw, Shield, Clock, Monitor } from 'lucide-react'
import authService from '../../services/authService'
import Spinner from '../../components/ui/Spinner'

const PAGE_SIZE = 50

function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('en-ET', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

export default function LoginLogsPage() {
  const [logs, setLogs]       = useState([])
  const [total, setTotal]     = useState(0)
  const [offset, setOffset]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchLogs = useCallback(async (off = 0) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.getLoginLogs({ limit: PAGE_SIZE, offset: off })
      setLogs(data.logs)
      setTotal(data.total)
      setOffset(off)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load login history.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    document.title = 'Login History — WOW Burger Admin'
    fetchLogs(0)
  }, [fetchLogs])

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-surface-primary flex items-center gap-2">
            <Shield size={24} className="text-primary-500" />
            Login History
          </h1>
          <p className="text-surface-muted text-sm mt-1">
            Every admin sign-in attempt — successful or failed.
          </p>
        </div>
        <button
          onClick={() => fetchLogs(offset)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-brand-card border border-brand-border text-surface-primary hover:border-primary-500/50 transition-colors"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Attempts', value: total, color: 'text-surface-primary' },
          { label: 'Successful', value: logs.filter(l => l.success).length + (offset > 0 ? '…' : ''), color: 'text-green-400' },
          { label: 'Failed', value: logs.filter(l => !l.success).length + (offset > 0 ? '…' : ''), color: 'text-red-400' },
          { label: 'This Page', value: `${logs.length} / ${PAGE_SIZE}`, color: 'text-surface-muted' },
        ].map(stat => (
          <div key={stat.label} className="card p-4">
            <p className="text-xs text-surface-muted uppercase tracking-wide mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400">
            <XCircle size={40} className="mx-auto mb-3 opacity-60" />
            <p className="font-semibold">{error}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-surface-muted">
            <Clock size={40} className="mx-auto mb-3 opacity-40" />
            <p>No login attempts recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-darker/50">
                  {['Result', 'User', 'Email', 'Role', 'Reason', 'IP Address', 'Time'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-muted uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-brand-card/50 transition-colors">
                    <td className="px-4 py-3">
                      {log.success ? (
                        <span className="inline-flex items-center gap-1.5 text-green-400 font-semibold">
                          <CheckCircle size={14} /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-400 font-semibold">
                          <XCircle size={14} /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-surface-primary font-medium whitespace-nowrap">
                      {log.full_name || <span className="text-surface-muted italic">Unknown</span>}
                    </td>
                    <td className="px-4 py-3 text-surface-muted">{log.email}</td>
                    <td className="px-4 py-3">
                      {log.role ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          log.role === 'super_admin' ? 'bg-primary-500/20 text-primary-400' :
                          log.role === 'manager'     ? 'bg-blue-500/20 text-blue-400' :
                                                       'bg-gray-500/20 text-gray-400'
                        }`}>
                          {log.role === 'super_admin' ? 'Superadmin' : log.role === 'manager' ? 'Manager' : 'Staff'}
                        </span>
                      ) : (
                        <span className="text-surface-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-surface-muted italic text-xs">
                      {log.fail_reason || '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-surface-muted">
                      {log.ip_address || '—'}
                    </td>
                    <td className="px-4 py-3 text-surface-muted text-xs whitespace-nowrap">
                      {formatDate(log.logged_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-surface-muted">
            Page {currentPage} of {totalPages} — {total} total records
          </p>
          <div className="flex gap-2">
            <button
              disabled={offset === 0}
              onClick={() => fetchLogs(Math.max(0, offset - PAGE_SIZE))}
              className="px-4 py-2 rounded-lg border border-brand-border text-surface-primary disabled:opacity-40 hover:border-primary-500/50 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={offset + PAGE_SIZE >= total}
              onClick={() => fetchLogs(offset + PAGE_SIZE)}
              className="px-4 py-2 rounded-lg border border-brand-border text-surface-primary disabled:opacity-40 hover:border-primary-500/50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
