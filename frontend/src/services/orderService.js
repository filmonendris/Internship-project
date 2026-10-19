import api from './api'
import { mockOrders } from '../data/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// Local store for mock orders backed by localStorage (shares data across tabs and survives page reloads)
const STORAGE_KEY = 'wow_orders'

function getStoredOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      // First time initialization: populate seed orders
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrders))
      return [...mockOrders]
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed
    }
    console.error('Stored orders in localStorage is not an array; backing up and resetting to seed orders.')
    localStorage.setItem(`${STORAGE_KEY}_corrupted_backup_${Date.now()}`, raw)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrders))
    return [...mockOrders]
  } catch (err) {
    console.error('Malformed JSON in localStorage for wow_orders; backing up and resetting to seed orders:', err)
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      localStorage.setItem(`${STORAGE_KEY}_corrupted_backup_${Date.now()}`, raw)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrders))
    return [...mockOrders]
  }
}

function saveStoredOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch (err) {
    console.error('Failed to save orders to localStorage:', err)
  }
}

function generateNextId(orders) {
  const maxId = orders.reduce((max, o) => {
    const idNum = Number(o.id)
    return !isNaN(idNum) && idNum > max ? idNum : max
  }, 1000)
  return maxId + 1
}

const orderService = {
  placeOrder: async (orderData) => {
    if (USE_MOCK) {
      await delay(600)
      const currentOrders = getStoredOrders()
      const newId = generateNextId(currentOrders)
      const newOrder = {
        ...orderData,
        id: newId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      const updatedOrders = [newOrder, ...currentOrders]
      saveStoredOrders(updatedOrders)
      return newOrder
    }
    const res = await api.post('/orders', orderData)
    return res.data
  },

  getByBranch: async (branchId) => {
    if (USE_MOCK) {
      await delay()
      const orders = getStoredOrders()
      return orders.filter((o) => o.branchId === Number(branchId))
    }
    const res = await api.get(`/orders?branchId=${branchId}`)
    return res.data
  },

  getAll: async () => {
    if (USE_MOCK) {
      await delay()
      return getStoredOrders()
    }
    const res = await api.get('/orders')
    return res.data
  },

  updateStatus: async (id, status) => {
    if (USE_MOCK) {
      await delay()
      const currentOrders = getStoredOrders()
      const updatedOrders = currentOrders.map((o) =>
        o.id === id ? { ...o, status } : o
      )
      saveStoredOrders(updatedOrders)
      return updatedOrders.find((o) => o.id === id)
    }
    const res = await api.patch(`/orders/${id}/status`, { status })
    return res.data
  },
}

export default orderService
