/**
 * Official WOW Burger Logo Component
 *
 * Uses the official WOW Burger brand identity image.
 * Preserves the original 1:1 aspect ratio, colors, and proportions with object-contain.
 */
export default function WowLogo({
  size = 'md',
  className = '',
  alt = 'WOW Burger Logo',
  ...props
}) {
  const sizeMap = {
    xs:    'w-7 h-7',       // 28px
    sm:    'w-9 h-9',       // 36px
    md:    'w-11 h-11',     // 44px
    lg:    'w-16 h-16',     // 64px
    xl:    'w-24 h-24',     // 96px
    '2xl': 'w-32 h-32',     // 128px
    '3xl': 'w-48 h-48',     // 192px
  }

  const dimMap = {
    xs:    28,
    sm:    36,
    md:    44,
    lg:    64,
    xl:    96,
    '2xl': 128,
    '3xl': 192,
  }

  const sizeClass = sizeMap[size] || sizeMap.md
  const dim = dimMap[size] || dimMap.md

  return (
    <img
      src="/images/wow-burger-logo.jpg"
      alt={alt}
      width={dim}
      height={dim}
      loading="eager"
      decoding="async"
      className={`object-contain rounded-xl select-none flex-shrink-0 aspect-square ${sizeClass} ${className}`}
      {...props}
    />
  )
}
