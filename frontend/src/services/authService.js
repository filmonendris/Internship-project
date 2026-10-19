import api from './api'
import { mockUsers } from '../data/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

// Mock credentials: email / password (all use 'password123' for dev)
const MOCK_PASSWORD = 'password123'

const authService = {
  login: async (email, password) => {
    if (USE_MOCK) {
      await delay()
      const user = mockUsers.find((u) => u.email === email)
      if (!user || password !== MOCK_PASSWORD) {
        throw new Error('Invalid email or password')
      }
      const token = `mock_token_${user.id}_${Date.now()}`
      return { user, token }
    }
    const res = await api.post('/auth/login', { email, password })
    return res.data
  },

  logout: () => {
    localStorage.removeItem('wow_token')
    localStorage.removeItem('wow_user')
  },

  getUsers: async () => {
    if (USE_MOCK) { await delay(); return mockUsers }
    const res = await api.get('/users')
    return res.data
  },

  createUser: async (data) => {
    if (USE_MOCK) { await delay(); return { ...data, id: Date.now() } }
    const res = await api.post('/users', data)
    return res.data
  },

  updateUser: async (id, data) => {
    if (USE_MOCK) { await delay(); return { ...data, id } }
    const res = await api.put(`/users/${id}`, data)
    return res.data
  },

  deleteUser: async (id) => {
    if (USE_MOCK) { await delay(); return true }
    await api.delete(`/users/${id}`)
    return true
  },
  getLoginLogs: async ({ limit = 50, offset = 0 } = {}) => {
    const res = await api.get(`/auth/login-logs?limit=${limit}&offset=${offset}`)
    return res.data
  },
}

export default authService
