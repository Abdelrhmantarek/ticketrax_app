import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * `cn` Utility Function:
 * A powerful class name combiner that merges Tailwind CSS classes intelligently
 * while handling all other class name formats (conditional, string, object).
 *
 * Combines the functionality of:
 * - clsx: Conditional class joining
 * - tailwind-merge: Tailwind-specific class merging
 *
 * @param {...ClassValue[]} inputs - Class names in any format (string, array, object)
 * @returns {string} - Optimized, deduplicated class string
 *
 * Usage Examples:
 * - Basic: cn('px-2', 'py-1') → 'px-2 py-1'
 * - Conditional: cn('text-red-500', isActive && 'bg-blue-100')
 * - Overrides: cn('px-4 px-2') → 'px-2'
 * - Responsive: cn('md:hover:bg-white hover:bg-black') → 'hover:bg-black md:hover:bg-white'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Why This Combination?
 * 1. clsx handles:
 *    - Conditional classes (false, null, undefined are filtered out)
 *    - Array/object class definitions
 *    - String concatenation with spaces
 *
 * 2. twMerge handles:
 *    - Tailwind class conflict resolution (e.g., 'px-4 px-2' → 'px-2')
 *    - Proper ordering of:
 *      - Variants (hover:, focus:)
 *      - Breakpoints (sm:, md:)
 *      - Important (!)
 *    - Deduplication of same utility classes
 *
 * Benefits:
 * - Prevents Tailwind class conflicts
 * - Reduces final CSS bundle size by eliminating duplicate classes
 * - Maintains proper CSS specificity order
 * - Cleaner component code with conditional classes
 */