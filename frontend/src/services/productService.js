import api from './api'
import { mockProducts } from '../data/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

const productService = {
  getByBranch: async (branchId) => {
    if (USE_MOCK) {
      await delay()
      const bid = Number(branchId)
      const branchProds = mockProducts.filter((p) => p.branchId === bid)
      // BUG-03: Branches 2 & 3 have no separate mock products (same franchise chain).
      // Fall back to branch 1's verified menu so the public menu page is never blank.
      // The real API will serve branch-specific data once the backend is connected.
      return branchProds.length > 0 ? branchProds : mockProducts.filter((p) => p.branchId === 1)
    }
    const res = await api.get(`/products?branchId=${branchId}`)
    return res.data
  },

  getByCategory: async (branchId, categoryId) => {
    if (USE_MOCK) {
      await delay()
      return mockProducts.filter(
        (p) => p.branchId === Number(branchId) && p.categoryId === Number(categoryId)
      )
    }
    const res = await api.get(`/products?branchId=${branchId}&categoryId=${categoryId}`)
    return res.data
  },

  getById: async (id) => {
    if (USE_MOCK) {
      await delay()
      return mockProducts.find((p) => p.id === Number(id)) || null
    }
    const res = await api.get(`/products/${id}`)
    return res.data
  },

  getAll: async () => {
    if (USE_MOCK) { await delay(); return mockProducts }
    const res = await api.get('/products')
    return res.data
  },

  create: async (data) => {
    if (USE_MOCK) { await delay(); return { id: Date.now() } }
    const config = typeof FormData !== 'undefined' && data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {}
    const res = await api.post('/products', data, config)
    return res.data
  },

  update: async (id, data) => {
    if (USE_MOCK) { await delay(); return { id } }
    const config = typeof FormData !== 'undefined' && data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {}
    const res = await api.put(`/products/${id}`, data, config)
    return res.data
  },

  toggleAvailability: async (id, isAvailable) => {
    if (USE_MOCK) { await delay(); return { id, isAvailable } }
    const res = await api.patch(`/products/${id}/availability`, { isAvailable })
    return res.data
  },

  remove: async (id) => {
    if (USE_MOCK) { await delay(); return true }
    await api.delete(`/products/${id}`)
    return true
  },
}

export default productService
