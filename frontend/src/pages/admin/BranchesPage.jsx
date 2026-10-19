import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import branchService from '../../services/branchService'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'

const EMPTY = { name: '', address: '', phone: '', isActive: true }

export default function BranchesPage() {
  const [branches, setBranches] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(null)
  // BUG-01: replaces window.confirm
  const [confirmDelete, setConfirmDelete] = useState({ open: false, branch: null })

  const fetchAll = useCallback(async () => {
    try { setLoading(true); setBranches(await branchService.getAll()) }
    catch { toast.error('Failed to load branches') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { document.title = 'WOW Burger — Branches'; fetchAll() }, [fetchAll])

  function openCreate() { setForm(EMPTY); setErrors({}); setEditing(null); setModal('create') }
  function openEdit(b) { setForm({ name: b.name, address: b.address, phone: b.phone, isActive: b.isActive }); setErrors({}); setEditing(b); setModal('edit') }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Branch name is required'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    return e
  }

  async function handleSave(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const data = { name: form.name.trim(), address: form.address.trim(), phone: form.phone.trim(), isActive: form.isActive }
      if (editing) {
        await branchService.update(editing.id, data)
        setBranches((prev) => prev.map((b) => b.id === editing.id ? { ...b, ...data } : b))
        toast.success('Branch updated')
      } else {
        const created = await branchService.create(data)
        setBranches((prev) => [...prev, { ...data, id: created.id }])
        toast.success('Branch created')
      }
      setModal(null)
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  // BUG-01: opens ConfirmDialog instead of window.confirm
  function handleDelete(b) {
    setConfirmDelete({ open: true, branch: b })
  }

  async function handleConfirmDelete() {
    const b = confirmDelete.branch
    setConfirmDelete({ open: false, branch: null })
    setDeleting(b.id)
    try { await branchService.remove(b.id); setBranches((prev) => prev.filter((x) => x.id !== b.id)); toast.success('Branch deleted') }
    catch { toast.error('Failed to delete') }
    finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Branches</h1>
        <Button size="sm" onClick={openCreate}><Plus size={15} /> Add Branch</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.length === 0 ? (
            <p className="text-gray-500 col-span-3 text-center py-12">No branches yet</p>
          ) : branches.map((b) => (
            <div key={b.id} className="bg-brand-card border border-brand-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-white">{b.name}</h3>
                  <p className="text-gray-400 text-sm mt-0.5">{b.address}</p>
                  <p className="text-gray-500 text-sm">{b.phone}</p>
                </div>
                <Badge variant={b.isActive ? 'success' : 'danger'}>{b.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-brand-border">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => openEdit(b)}>
                  <Pencil size={13} /> Edit
                </Button>
                <button
                  onClick={() => handleDelete(b)}
                  disabled={deleting === b.id}
                  aria-label={`Delete ${b.name}`}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  {deleting === b.id ? <Spinner size="sm" /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'edit' ? 'Edit Branch' : 'Add Branch'} size="sm">
        <form onSubmit={handleSave} noValidate className="p-5 space-y-4">
          <Input id="bname" label="Branch Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} />
          <Input id="baddress" label="Address" value={form.address} placeholder="e.g. Bole Road, Addis Ababa" onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          <Input id="bphone" label="Phone" required value={form.phone} placeholder="+251..." onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} error={errors.phone} />
          <div className="flex items-center gap-3">
            <input id="bisActive" type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-primary-500" />
            <label htmlFor="bisActive" className="text-sm text-surface-secondary">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">{modal === 'edit' ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* BUG-01: delete confirmation — replaces window.confirm */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, branch: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Branch"
        message={`Are you sure you want to delete "${confirmDelete.branch?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
