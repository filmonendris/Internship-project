import { useState, useEffect } from 'react'
import branchService from '../services/branchService'

export function useBranch(branchId) {
  const [branch, setBranch]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!branchId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    branchService
      .getById(branchId)
      .then((data) => { if (!cancelled) setBranch(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [branchId])

  return { branch, loading, error }
}
