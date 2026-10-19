import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'
import branchService from '../../services/branchService'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import { formatPrice } from '../../utils/formatPrice'
import toast from 'react-hot-toast'

const EMPTY_FORM = { name: '', description: '', price: '', categoryId: '', branchId: '', image: '' }

const AVAILABLE_IMAGES = [
  // Burgers
  { label: 'Double Burger (/images/burger_double.jpg)', value: '/images/burger_double.jpg' },
  { label: 'Cheese Burger (/images/burger_cheese.jpg)', value: '/images/burger_cheese.jpg' },
  { label: 'Beef Burger (/images/burger_beef.jpg)', value: '/images/burger_beef.jpg' },
  { label: 'Chicken Burger (/images/burger_chicken.jpg)', value: '/images/burger_chicken.jpg' },
  { label: 'Mini Burger / Slider (/images/burger_mini.jpg)', value: '/images/burger_mini.jpg' },
  { label: 'Vegan Burger (/images/burger_vegan.jpg)', value: '/images/burger_vegan.jpg' },
  { label: 'Classic Burger (/images/burger1.jpg)', value: '/images/burger1.jpg' },

  // Pizzas
  { label: 'Meat Lovers Pizza (/images/pizza_meat.jpg)', value: '/images/pizza_meat.jpg' },
  { label: 'Margherita Pizza (/images/pizza_margherita.jpg)', value: '/images/pizza_margherita.jpg' },
  { label: 'Hawaiian Pizza (/images/pizza_hawaiian.jpg)', value: '/images/pizza_hawaiian.jpg' },
  { label: 'Vegetable Pizza (/images/pizza_veggie.jpg)', value: '/images/pizza_veggie.jpg' },
  { label: 'Chicken Pizza (/images/pizza2.jpg)', value: '/images/pizza2.jpg' },
  { label: 'Special Pizza (/images/pizza1.jpg)', value: '/images/pizza1.jpg' },

  // Wraps & Sandwiches
  { label: 'Chicken Wrap (/images/wrap1.jpg)', value: '/images/wrap1.jpg' },
  { label: 'Vegetable Wrap (/images/wrap_veggie.jpg)', value: '/images/wrap_veggie.jpg' },
  { label: 'Shawarma (/images/shawarma.jpg)', value: '/images/shawarma.jpg' },
  { label: 'Ham & Cheese Sandwich (/images/sandwich_ham.jpg)', value: '/images/sandwich_ham.jpg' },
  { label: 'Egg Sandwich (/images/sandwich_egg.jpg)', value: '/images/sandwich_egg.jpg' },
  { label: 'Grilled Cheese Sandwich (/images/sandwich_grilled_cheese.jpg)', value: '/images/sandwich_grilled_cheese.jpg' },
  { label: 'Classic Sandwich (/images/sandwich.jpg)', value: '/images/sandwich.jpg' },

  // Crispy & Chicken
  { label: 'Chicken Tenders (/images/chicken_tenders.jpg)', value: '/images/chicken_tenders.jpg' },
  { label: 'Chicken Wings (/images/chicken_wings.jpg)', value: '/images/chicken_wings.jpg' },
  { label: 'Fried Chicken Broast (/images/chicken1.jpg)', value: '/images/chicken1.jpg' },

  // Fries
  { label: 'French Fries (/images/fries_plain.jpg)', value: '/images/fries_plain.jpg' },
  { label: 'Cheese / Loaded Fries (/images/fries_loaded.jpg)', value: '/images/fries_loaded.jpg' },
  { label: 'Chili Fries (/images/fries_chili.jpg)', value: '/images/fries_chili.jpg' },

  // Salads
  { label: 'Chicken Keto Salad (/images/salad_chicken.jpg)', value: '/images/salad_chicken.jpg' },
  { label: 'Tuna Salad (/images/salad_tuna.jpg)', value: '/images/salad_tuna.jpg' },
  { label: 'Mediterranean Salad (/images/salad_mediterranean.jpg)', value: '/images/salad_mediterranean.jpg' },
  { label: 'Grilled Veg Salad (/images/salad_grilled_veg.jpg)', value: '/images/salad_grilled_veg.jpg' },
  { label: 'Mixed Salad (/images/salad.jpg)', value: '/images/salad.jpg' },

  // Smoothies & Juices
  { label: 'Creamy Avocado Smoothie (/images/smoothie_avocado.jpg)', value: '/images/smoothie_avocado.jpg' },
  { label: 'Creamy Mango Smoothie (/images/smoothie_mango.jpg)', value: '/images/smoothie_mango.jpg' },
  { label: 'Creamy Papaya Smoothie (/images/smoothie_papaya.jpg)', value: '/images/smoothie_papaya.jpg' },
  { label: 'Green Detox Smoothie (/images/smoothie_green.jpg)', value: '/images/smoothie_green.jpg' },
  { label: 'Orange / Citrus Juice (/images/juice_orange.jpg)', value: '/images/juice_orange.jpg' },
  { label: 'Milkshake (/images/milkshake.jpg)', value: '/images/milkshake.jpg' },
  { label: 'Mocha / Coffee Blend (/images/mocha.jpg)', value: '/images/mocha.jpg' },
  { label: 'Gym Protein Shake (/images/protein_shake.jpg)', value: '/images/protein_shake.jpg' },
  { label: 'Special Fruit Smoothie (/images/smoothie.jpg)', value: '/images/smoothie.jpg' },
  { label: 'Soft Drink / Cola (/images/soft_drink.jpg)', value: '/images/soft_drink.jpg' },
  { label: 'Bottled Water (/images/water_bottle.jpg)', value: '/images/water_bottle.jpg' },

  // Hot Drinks
  { label: 'Brewed Coffee / Macchiato (/images/coffee.jpg)', value: '/images/coffee.jpg' },
  { label: 'Café Latte (/images/latte.jpg)', value: '/images/latte.jpg' },
  { label: 'Cappuccino (/images/cappuccino.jpg)', value: '/images/cappuccino.jpg' },
  { label: 'Hot Tea (/images/tea.jpg)', value: '/images/tea.jpg' },

  // Extras & Non-Food
  { label: 'Ketchup (/images/ketchup.jpg)', value: '/images/ketchup.jpg' },
  { label: 'Mayonnaise / Sauce (/images/sauce.jpg)', value: '/images/sauce.jpg' },
  { label: 'Cheese Slice (/images/cheese_slice.jpg)', value: '/images/cheese_slice.jpg' },
  { label: 'Takeaway Box (/images/takeaway_box.jpg)', value: '/images/takeaway_box.jpg' },
  { label: 'Takeaway Cup (/images/takeaway_cup.jpg)', value: '/images/takeaway_cup.jpg' },
]

export default function ProductsPage() {
  const { isSuperAdmin, user }  = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]                     = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBranch, setSelectedBranch]     = useState('all')
  const [currentPage, setCurrentPage]           = useState(1)
  const PAGE_SIZE = 12
  const [modal, setModal]       = useState(null) // null | 'create' | 'edit'
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(null)
  // BUG-01: replaces window.confirm — tracks which product is pending deletion
  const [confirmDelete, setConfirmDelete] = useState({ open: false, product: null })

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const [prods, cats, brs] = await Promise.all([
        isSuperAdmin ? productService.getAll() : productService.getByBranch(user?.branchId),
        categoryService.getAll(),
        branchService.getAll(),
      ])
      setProducts(prods)
      setCategories(cats)
      setBranches(brs)
    } catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }, [isSuperAdmin, user])

  useEffect(() => { document.title = 'WOW Burger — Products'; fetchAll() }, [fetchAll])

  function openCreate() {
    setForm({ ...EMPTY_FORM, branchId: isSuperAdmin ? '' : String(user?.branchId), image: '' })
    setErrors({})
    setEditing(null)
    setModal('create')
  }

  function openEdit(product) {
    setForm({
      name:        product.name,
      description: product.description || '',
      price:       String(product.price),
      categoryId:  String(product.categoryId),
      branchId:    String(product.branchId),
      image:       product.image || '',
    })
    setErrors({})
    setEditing(product)
    setModal('edit')
  }

  function validate() {
    const e = {}
    if (!form.name.trim())       e.name = 'Name is required'
    if (!form.price)             e.price = 'Price is required'
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price'
    if (!form.categoryId)        e.categoryId = 'Category is required'
    if (isSuperAdmin && !form.branchId) e.branchId = 'Branch is required'
    return e
  }

  async function handleSave(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const data = {
        name:        form.name.trim(),
        description: form.description.trim(),
        price:       Number(form.price),
        categoryId:  Number(form.categoryId),
        branchId:    Number(form.branchId || user?.branchId),
        image:       form.image || null,
        isAvailable: editing ? editing.isAvailable : true,
      }
      if (editing) {
        await productService.update(editing.id, data)
        setProducts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...data } : p))
        toast.success('Product updated')
      } else {
        const created = await productService.create(data)
        setProducts((prev) => [...prev, { ...data, id: created.id }])
        toast.success('Product created')
      }
      setModal(null)
    } catch { toast.error('Failed to save product') }
    finally { setSaving(false) }
  }

  async function handleToggle(product) {
    try {
      await productService.toggleAvailability(product.id, !product.isAvailable)
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, isAvailable: !p.isAvailable } : p))
      toast.success(`${product.name} ${!product.isAvailable ? 'activated' : 'hidden'}`)
    } catch { toast.error('Failed to update') }
  }

  // BUG-01: opens ConfirmDialog instead of calling window.confirm
  function handleDelete(product) {
    setConfirmDelete({ open: true, product })
  }

  async function handleConfirmDelete() {
    const product = confirmDelete.product
    setConfirmDelete({ open: false, product: null })
    setDeleting(product.id)
    try {
      await productService.remove(product.id)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      toast.success('Product deleted')
    } catch { toast.error('Failed to delete') }
    finally { setDeleting(null) }
  }

  const filterCategoryOptions = Array.from(
    new Map(categories.map((c) => [c.name, c])).values()
  )

  const filtered = products.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const pCategoryName = categories.find((c) => c.id === p.categoryId)?.name
    const matchesCategory =
      selectedCategory === 'all' ||
      String(p.categoryId) === selectedCategory ||
      pCategoryName === selectedCategory
    const matchesBranch =
      !isSuperAdmin || selectedBranch === 'all' || p.branchId === Number(selectedBranch)
    return matchesSearch && matchesCategory && matchesBranch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentSafePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((currentSafePage - 1) * PAGE_SIZE, currentSafePage * PAGE_SIZE)

  const branchCats = (() => {
    if (!form.branchId) return categories
    const bid = Number(form.branchId)
    const filtered = categories.filter((c) => c.branchId === bid)
    // BUG-03 fallback: branches 2 & 3 share branch 1 categories when no branch-specific categories exist
    return filtered.length > 0 ? filtered : categories.filter((c) => c.branchId === 1)
  })()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Products</h1>
        {(isSuperAdmin || true) && (
          <Button size="sm" onClick={openCreate}>
            <Plus size={15} /> Add Product
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Search products..."
            className="input-field pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setCurrentPage(1) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1) }}
          className="input-field py-2 text-sm w-auto min-w-[160px]"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {filterCategoryOptions.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        {/* Branch Filter (Super Admin only) */}
        {isSuperAdmin && (
          <select
            value={selectedBranch}
            onChange={(e) => { setSelectedBranch(e.target.value); setCurrentPage(1) }}
            className="input-field py-2 text-sm w-auto min-w-[150px]"
            aria-label="Filter by branch"
          >
            <option value="all">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-darker/50">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Product</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
                  {isSuperAdmin && <th className="text-left px-4 py-3 text-gray-500 font-medium">Branch</th>}
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 6 : 5} className="text-center py-12 text-surface-muted">
                      <p className="font-semibold text-surface-primary text-base mb-1">No products found</p>
                      <p className="text-sm">
                        {search ? `No products matching "${search}".` : 'No products found for the selected filters.'}
                      </p>
                      {(search || selectedCategory !== 'all' || selectedBranch !== 'all') && (
                        <button
                          onClick={() => {
                            setSearch('')
                            setSelectedCategory('all')
                            setSelectedBranch('all')
                            setCurrentPage(1)
                          }}
                          className="mt-3 text-xs font-semibold text-primary-400 hover:underline inline-block"
                        >
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : paginated.map((p) => (
                  <tr key={p.id} className="border-b border-brand-border/50 hover:bg-brand-border/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-darker border border-brand-border/60 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                          ) : (
                            <span className="text-[10px] text-surface-muted font-medium">No Img</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-white font-medium">{p.name}</span>
                          {p.description && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{p.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {categories.find((c) => c.id === p.categoryId)?.name || '—'}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-4 py-3 text-gray-400">
                        {branches.find((b) => b.id === p.branchId)?.name || '—'}
                      </td>
                    )}
                    <td className="px-4 py-3 text-primary-400 font-semibold">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.isAvailable ? 'success' : 'danger'}>
                        {p.isAvailable ? 'Active' : 'Hidden'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggle(p)}
                          title={p.isAvailable ? 'Hide' : 'Show'}
                          aria-label={p.isAvailable ? `Hide ${p.name}` : `Show ${p.name}`}
                          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-brand-border transition-colors"
                        >
                          {p.isAvailable ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        {isSuperAdmin && (
                          <>
                            <button
                              onClick={() => openEdit(p)}
                              title="Edit"
                              aria-label={`Edit ${p.name}`}
                              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-brand-border transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(p)}
                              title="Delete"
                              aria-label={`Delete ${p.name}`}
                              disabled={deleting === p.id}
                              className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            >
                              {deleting === p.id ? <Spinner size="sm" /> : <Trash2 size={14} />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-brand-border bg-brand-darker/30">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-white">{(currentSafePage - 1) * PAGE_SIZE + 1}</span> to{' '}
                <span className="font-medium text-white">
                  {Math.min(currentSafePage * PAGE_SIZE, filtered.length)}
                </span>{' '}
                of <span className="font-medium text-white">{filtered.length}</span> products
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentSafePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="!p-1.5"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </Button>

                  <span className="text-xs text-gray-400 px-2">
                    Page <span className="font-semibold text-white">{currentSafePage}</span> of{' '}
                    <span className="font-semibold text-white">{totalPages}</span>
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentSafePage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="!p-1.5"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Edit Product' : 'Add Product'}
        size="md"
      >
        <form onSubmit={handleSave} noValidate className="p-5 space-y-4">
          <Input id="pname" label="Product Name" required value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} />
          <div>
            <label htmlFor="pdesc" className="block text-sm font-medium text-surface-secondary mb-1.5">Description</label>
            <textarea
              id="pdesc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Optional description..."
              className="input-field resize-none"
            />
          </div>
          <Input id="pprice" label="Price (Birr)" required type="number" step="0.01" min="0"
            value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} error={errors.price} />

          {/* Product image selector & preview */}
          <div>
            <label htmlFor="pimage" className="block text-sm font-medium text-surface-secondary mb-1.5">Product Image</label>
            <div className="flex items-center gap-3 p-3 bg-brand-darker/60 border border-brand-border rounded-xl">
              <div className="w-16 h-16 rounded-lg bg-brand-card border border-brand-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <span className="text-[11px] text-surface-muted text-center px-1">No Image</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <select
                  id="pimage"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="input-field text-sm"
                >
                  <option value="">No image (Use default placeholder)</option>
                  {AVAILABLE_IMAGES.map((img) => (
                    <option key={img.value} value={img.value}>
                      {img.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-surface-muted mt-1">
                  Assign a verified photo from the project image library.
                </p>
              </div>
            </div>
          </div>

          {isSuperAdmin && (
            <div>
              <label htmlFor="pbranch" className="block text-sm font-medium text-surface-secondary mb-1.5">
                Branch <span className="text-primary-500" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <select
                id="pbranch"
                value={form.branchId}
                onChange={(e) => setForm((f) => ({ ...f, branchId: e.target.value, categoryId: '' }))}
                required
                aria-required="true"
                aria-invalid={!!errors.branchId}
                aria-describedby={errors.branchId ? 'pbranch-error' : undefined}
                className={`input-field ${errors.branchId ? 'border-red-500' : ''}`}
              >
                <option value="">Select branch...</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              {errors.branchId && (
                <p id="pbranch-error" role="alert" className="mt-1 text-xs text-red-400">
                  {errors.branchId}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="pcategory" className="block text-sm font-medium text-surface-secondary mb-1.5">
              Category <span className="text-primary-500" aria-hidden="true">*</span>
              <span className="sr-only"> (required)</span>
            </label>
            <select
              id="pcategory"
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              required
              aria-required="true"
              aria-invalid={!!errors.categoryId}
              aria-describedby={errors.categoryId ? 'pcategory-error' : undefined}
              className={`input-field ${errors.categoryId ? 'border-red-500' : ''}`}
            >
              <option value="">Select category...</option>
              {branchCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && (
              <p id="pcategory-error" role="alert" className="mt-1 text-xs text-red-400">
                {errors.categoryId}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">
              {modal === 'edit' ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* BUG-01: delete confirmation — replaces window.confirm */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, product: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${confirmDelete.product?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
