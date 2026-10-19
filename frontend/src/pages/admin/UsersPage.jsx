import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import branchService from '../../services/branchService'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'

const EMPTY = { name: '', email: '', password: '', role: 'admin', branchId: '', isActive: true }

export default function UsersPage() {
  const { user: currentUser }   = useAuth()
  const [users, setUsers]       = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(null)
  // BUG-01: replaces window.confirm
  const [confirmDelete, setConfirmDelete] = useState({ open: false, user: null })

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const [us, brs] = await Promise.all([authService.getUsers(), branchService.getAll()])
      setUsers(us); setBranches(brs)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { document.title = 'WOW Burger — Users'; fetchAll() }, [fetchAll])

  function openCreate() { setForm(EMPTY); setErrors({}); setEditing(null); setModal('create') }
  function openEdit(u) {
    setForm({ name: u.name, email: u.email, password: '', role: u.role, branchId: u.branchId ? String(u.branchId) : '', isActive: u.isActive })
    setErrors({}); setEditing(u); setModal('edit')
  }

  function validate() {
    const e = {}
    if (!form.name.trim())  e.name  = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!editing && !form.password) e.password = 'Password is required'
    // Stage 1 fix: validate password length whenever a password is provided (both create and edit)
    if (form.password && form.password.length < 6) e.password = 'Min 6 characters'
    if (form.role === 'admin' && !form.branchId) e.branchId = 'Branch is required for admins'
    if (editing && editing.id === currentUser?.id && !form.isActive) {
      e.isActive = 'You cannot deactivate your own account'
    }
    if (editing && editing.id === currentUser?.id && form.role !== currentUser?.role) {
      e.role = 'You cannot change your own role'
    }
    return e
  }

  async function handleSave(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const data = { name: form.name.trim(), email: form.email.trim(), role: form.role, branchId: form.role === 'admin' ? Number(form.branchId) : null, isActive: form.isActive }
      if (form.password) data.password = form.password
      if (editing) {
        await authService.updateUser(editing.id, data)
        setUsers((prev) => prev.map((u) => u.id === editing.id ? { ...u, ...data } : u))
        toast.success('User updated')
      } else {
        const created = await authService.createUser(data)
        setUsers((prev) => [...prev, { ...data, id: created.id }])
        toast.success('User created')
      }
      setModal(null)
    } catch { toast.error('Failed to save user') }
    finally { setSaving(false) }
  }

  // BUG-01: opens ConfirmDialog instead of window.confirm
  function handleDelete(u) {
    if (u.id === currentUser?.id) {
      toast.error('You cannot delete your own account')
      return
    }
    setConfirmDelete({ open: true, user: u })
  }

  async function handleConfirmDelete() {
    const u = confirmDelete.user
    if (!u || u.id === currentUser?.id) {
      setConfirmDelete({ open: false, user: null })
      toast.error('You cannot delete your own account')
      return
    }
    setConfirmDelete({ open: false, user: null })
    setDeleting(u.id)
    try {
      await authService.deleteUser(u.id)
      setUsers((prev) => prev.filter((x) => x.id !== u.id))
      toast.success('User deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  const ROLE_COLOR = { superadmin: 'primary', admin: 'info' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Users</h1>
        <Button size="sm" onClick={openCreate}><Plus size={15} /> Add User</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-darker/50">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Role</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Branch</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-500">No users found</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="border-b border-brand-border/50 hover:bg-brand-border/10 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">
                      {u.name}
                      {u.id === currentUser?.id && (
                        <span className="text-xs text-primary-400 font-normal ml-1.5">(You)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                    <td className="px-4 py-3"><Badge variant={ROLE_COLOR[u.role] || 'default'} className="capitalize">{u.role}</Badge></td>
                    <td className="px-4 py-3 text-gray-400">{u.branchId ? (branches.find((b) => b.id === u.branchId)?.name || '—') : <span className="text-gray-600">All branches</span>}</td>
                    <td className="px-4 py-3"><Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          aria-label={`Edit ${u.name}`}
                          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-brand-border transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={deleting === u.id || u.id === currentUser?.id}
                          title={u.id === currentUser?.id ? 'Cannot delete your own account' : 'Delete user'}
                          aria-label={u.id === currentUser?.id ? 'Cannot delete your own account' : `Delete ${u.name}`}
                          className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {deleting === u.id ? <Spinner size="sm" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'edit' ? 'Edit User' : 'Add User'} size="md">
        <form onSubmit={handleSave} noValidate className="p-5 space-y-4">
          <Input id="uname" label="Full Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} />
          <Input id="uemail" label="Email" required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} error={errors.email} />
          <Input id="upwd" label={editing ? 'New Password (leave blank to keep)' : 'Password'} required={!editing} type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} error={errors.password} placeholder="••••••••" />
          <div>
            <label htmlFor="urole" className="block text-sm font-medium text-surface-secondary mb-1.5">
              Role <span className="text-primary-500" aria-hidden="true">*</span>
              <span className="sr-only"> (required)</span>
              {editing?.id === currentUser?.id && (
                <span className="text-xs text-gray-500 ml-2 font-normal">(Cannot change own role)</span>
              )}
            </label>
            <select
              id="urole"
              value={form.role}
              disabled={editing?.id === currentUser?.id}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value, branchId: '' }))}
              required
              aria-required="true"
              aria-invalid={!!errors.role}
              aria-describedby={errors.role ? 'urole-error' : undefined}
              className={`input-field ${editing?.id === currentUser?.id ? 'opacity-60 cursor-not-allowed' : ''} ${errors.role ? 'border-red-500' : ''}`}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            {errors.role && (
              <p id="urole-error" role="alert" className="mt-1 text-xs text-red-400">
                {errors.role}
              </p>
            )}
          </div>
          {form.role === 'admin' && (
            <div>
              <label htmlFor="ubranch" className="block text-sm font-medium text-surface-secondary mb-1.5">
                Branch <span className="text-primary-500" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <select
                id="ubranch"
                value={form.branchId}
                onChange={(e) => setForm((f) => ({ ...f, branchId: e.target.value }))}
                required
                aria-required="true"
                aria-invalid={!!errors.branchId}
                aria-describedby={errors.branchId ? 'ubranch-error' : undefined}
                className={`input-field ${errors.branchId ? 'border-red-500' : ''}`}
              >
                <option value="">Select branch...</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              {errors.branchId && (
                <p id="ubranch-error" role="alert" className="mt-1 text-xs text-red-400">
                  {errors.branchId}
                </p>
              )}
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <input
                id="uisActive"
                type="checkbox"
                checked={form.isActive}
                disabled={editing?.id === currentUser?.id}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 accent-primary-500 disabled:opacity-50"
              />
              <label htmlFor="uisActive" className="text-sm text-surface-secondary">
                Active
                {editing?.id === currentUser?.id && (
                  <span className="text-xs text-gray-500 ml-2 font-normal">(Cannot deactivate own account)</span>
                )}
              </label>
            </div>
            {errors.isActive && <p className="mt-1 text-xs text-red-400">{errors.isActive}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">{modal === 'edit' ? 'Save Changes' : 'Create User'}</Button>
          </div>
        </form>
      </Modal>

      {/* BUG-01: delete confirmation — replaces window.confirm */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, user: null })}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${confirmDelete.user?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
