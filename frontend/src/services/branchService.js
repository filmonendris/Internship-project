import api from './api'
import { mockBranches } from '../data/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

const branchService = {
 getAll: async () => {
  const res = await api.get('/branches')
  return res.data
},

  getById: async (id) => {
    if (USE_MOCK) {
      await delay()
      return mockBranches.find((b) => b.id === Number(id)) || null
    }
    const res = await api.get(`/branches/${id}`)
    return res.data
  },

  create: async (data) => {
    if (USE_MOCK) { await delay(); return { ...data, id: Date.now() } }
    const res = await api.post('/branches', data)
    return res.data
  },

  update: async (id, data) => {
    if (USE_MOCK) { await delay(); return { ...data, id } }
    const res = await api.put(`/branches/${id}`, data)
    return res.data
  },

  remove: async (id) => {
    if (USE_MOCK) { await delay(); return true }
    await api.delete(`/branches/${id}`)
    return true
  },
}

export default branchService
