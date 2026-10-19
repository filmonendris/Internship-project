import { useState, useEffect } from 'react'
import productService from '../services/productService'

export function useProducts(branchId) {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  function refetch() {
    if (!branchId) return
    setLoading(true)
    setError(null)
    productService
      .getByBranch(branchId)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refetch()
  }, [branchId])

  return { products, loading, error, refetch }
}
