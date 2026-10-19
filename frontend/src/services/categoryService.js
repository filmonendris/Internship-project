
import api from './api'
import { mockCategories } from '../data/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

const categoryService = {
  getByBranch: async (branchId) => {
    if (USE_MOCK) {
      await delay()
      const bid = Number(branchId)
      const branchCats = mockCategories.filter(
        (c) => c.branchId === bid && c.isActive
      )

      // Fallback to branch 1 categories when no branch-specific mock data exists
      return branchCats.length > 0
        ? branchCats
        : mockCategories.filter((c) => c.branchId === 1 && c.isActive)
    }

    const res = await api.get(`/categories?branchId=${branchId}`)
    return res.data
  },

  // Always load all categories from the real backend
  getAll: async () => {
    const res = await api.get('/categories')
    return res.data
  },

  create: async (data) => {
    if (USE_MOCK) {
      await delay()
      return { ...data, id: Date.now() }
    }

    const res = await api.post('/categories', data)
    return res.data
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      await delay()
      return { ...data, id }
    }

    const res = await api.put(`/categories/${id}`, data)
    return res.data
  },

  remove: async (id) => {
    if (USE_MOCK) {
      await delay()
      return true
    }

    await api.delete(`/categories/${id}`)
    return true
  },
}

export default categoryService
