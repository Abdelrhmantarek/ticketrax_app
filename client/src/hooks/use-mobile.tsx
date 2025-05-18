import * as React from "react"

/**
 * Breakpoint constant defining what we consider "mobile" width
 * 768px is a common breakpoint (matches Tailwind's 'md' breakpoint)
 */
const MOBILE_BREAKPOINT = 768

/**
 * useIsMobile Custom Hook:
 * Detects whether the current viewport matches mobile dimensions
 * Returns a boolean state that updates responsively when the window is resized
 * 
 * @returns boolean - true if viewport is mobile-sized, false otherwise
 * 
 * Features:
 * - Initial undefined state prevents SSR hydration mismatches
 * - Uses matchMedia API for efficient event listening
 * - Cleanup removes event listener on unmount
 */
export function useIsMobile() {
  // State tracks mobile status (undefined initially for SSR compatibility)
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create media query list listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handler for viewport changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set up event listener
    mql.addEventListener("change", onChange)
    
    // Initialize with current viewport state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup: remove listener when component unmounts
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array ensures effect runs only once

  // Double negation converts undefined to false after initial render
  return !!isMobile
}