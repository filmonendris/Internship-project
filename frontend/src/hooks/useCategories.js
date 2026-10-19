import { useState, useEffect } from 'react'
import categoryService from '../services/categoryService'

export function useCategories(branchId) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    if (!branchId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    categoryService
      .getByBranch(branchId)
      .then((data) => { if (!cancelled) setCategories(data.filter((c) => c.name !== 'All')) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [branchId])

  return { categories, loading, error }
}
