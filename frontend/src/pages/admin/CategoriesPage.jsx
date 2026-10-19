import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import categoryService from '../../services/categoryService'
import branchService from '../../services/branchService'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'

const EMPTY = { name: '', branchId: '', order: '0', isActive: true }

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [branches, setBranches]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [errors, setErrors]         = useState({})
  const [saving, setSaving]         = useState(false)
  const [deleting, setDeleting]     = useState(null)
  const [confirmDelete, setConfirmDelete] = useState({ open: false, category: null })

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const [cats, brs] = await Promise.all([categoryService.getAll(), branchService.getAll()])
      setCategories(cats)
      setBranches(brs)
    } catch { toast.error('Failed to load categories') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { document.title = 'WOW Burger — Categories'; fetchAll() }, [fetchAll])

  function openCreate() { setForm(EMPTY); setErrors({}); setEditing(null); setModal('create') }
  function openEdit(cat) {
    setForm({ name: cat.name, branchId: String(cat.branchId), order: String(cat.order), isActive: cat.isActive })
    setErrors({}); setEditing(cat); setModal('edit')
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.branchId)    e.branchId = 'Branch is required'
    return e
  }

  async function handleSave(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const data = { name: form.name.trim(), branchId: Number(form.branchId), order: Number(form.order), isActive: form.isActive }
      if (editing) {
        await categoryService.update(editing.id, data)
        setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...data } : c))
        toast.success('Category updated')
      } else {
        const created = await categoryService.create(data)
        setCategories((prev) => [...prev, { ...data, id: created.id }])
        toast.success('Category created')
      }
      setModal(null)
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  function handleDelete(cat) {
    setConfirmDelete({ open: true, category: cat })
  }

  async function handleConfirmDelete() {
    const cat = confirmDelete.category
    setConfirmDelete({ open: false, category: null })
    if (!cat) return
    setDeleting(cat.id)
    try {
      await categoryService.remove(cat.id)
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
      toast.success('Category deleted')
    } catch { toast.error('Failed to delete') }
    finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Categories</h1>
        <Button size="sm" onClick={openCreate}><Plus size={15} /> Add Category</Button>
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
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Branch</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Order</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-500">No categories yet</td></tr>
                ) : categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-brand-border/50 hover:bg-brand-border/10 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-400">{branches.find((b) => b.id === cat.branchId)?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{cat.order}</td>
                    <td className="px-4 py-3"><Badge variant={cat.isActive ? 'success' : 'danger'}>{cat.isActive ? 'Active' : 'Hidden'}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(cat)}
                          aria-label={`Edit ${cat.name}`}
                          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-brand-border transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          aria-label={`Delete ${cat.name}`}
                          disabled={deleting === cat.id}
                          className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          {deleting === cat.id ? <Spinner size="sm" /> : <Trash2 size={14} />}
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

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'edit' ? 'Edit Category' : 'Add Category'} size="sm">
        <form onSubmit={handleSave} noValidate className="p-5 space-y-4">
          <Input id="cname" label="Category Name" required value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} />
          <div>
            <label htmlFor="cbranch" className="block text-sm font-medium text-surface-secondary mb-1.5">
              Branch <span className="text-primary-500" aria-hidden="true">*</span>
              <span className="sr-only"> (required)</span>
            </label>
            <select
              id="cbranch"
              value={form.branchId}
              onChange={(e) => setForm((f) => ({ ...f, branchId: e.target.value }))}
              required
              aria-required="true"
              aria-invalid={!!errors.branchId}
              aria-describedby={errors.branchId ? 'cbranch-error' : undefined}
              className={`input-field ${errors.branchId ? 'border-red-500' : ''}`}
            >
              <option value="">Select branch...</option>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            {errors.branchId && (
              <p id="cbranch-error" role="alert" className="mt-1 text-xs text-red-400">
                {errors.branchId}
              </p>
            )}
          </div>
          <Input id="corder" label="Display Order" type="number" min="0" value={form.order}
            onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} />
          <div className="flex items-center gap-3">
            <input id="cisActive" type="checkbox" checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 accent-primary-500" />
            <label htmlFor="cisActive" className="text-sm text-surface-secondary">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">{modal === 'edit' ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Category delete confirmation dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, category: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${confirmDelete.category?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
