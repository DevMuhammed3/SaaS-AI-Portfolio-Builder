"use client"

/**
 * Accessibility utilities and hooks
 * Provides keyboard navigation, focus management, and screen reader support
 */

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Hook for managing keyboard navigation
 * @param onEscape - Callback when Escape key is pressed
 * @param onEnter - Callback when Enter key is pressed
 */
export function useKeyboardNavigation(onEscape?: () => void, onEnter?: () => void) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          onEscape?.()
          break
        case "Enter":
          onEnter?.()
          break
      }
    },
    [onEscape, onEnter],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}

/**
 * Hook for managing focus trap in modals/menus
 * @param isActive - Whether focus trap should be active
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    // Focus first element when trap activates
    firstElement?.focus()

    document.addEventListener("keydown", handleTabKey)
    return () => document.removeEventListener("keydown", handleTabKey)
  }, [isActive])

  return containerRef
}

/**
 * Hook for announcing content to screen readers
 */
export function useScreenReader() {
  const [announcement, setAnnouncement] = useState<string>("")

  const announce = useCallback((message: string) => {
    setAnnouncement(message)
    // Clear after announcement
    setTimeout(() => setAnnouncement(""), 1000)
  }, [])

  return { announcement, announce }
}

/**
 * Hook for managing reduced motion preferences
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}
