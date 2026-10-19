import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CategoryTabs({ categories, activeId, onSelect }) {
  const scrollRef = useRef(null)

  function scroll(dir) {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  return (
    <div className="relative flex items-center gap-1">
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="hidden sm:flex flex-shrink-0 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-brand-card transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Scroll menu categories left"
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      <div
        ref={scrollRef}
        role="tablist"
        aria-label="Menu categories"
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 py-1"
      >
        {/* All tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeId === null}
          onClick={() => onSelect(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            activeId === null
              ? 'bg-primary-500 text-white shadow-glow-red'
              : 'bg-brand-card border border-brand-border text-gray-400 hover:text-white hover:border-gray-500'
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeId === cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              activeId === cat.id
                ? 'bg-primary-500 text-white shadow-glow-red'
                : 'bg-brand-card border border-brand-border text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        className="hidden sm:flex flex-shrink-0 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-brand-card transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Scroll menu categories right"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
