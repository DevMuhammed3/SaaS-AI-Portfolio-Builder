"use client";

import { useCallback, useEffect, useRef } from "react";
import { devLog } from "@/lib/utils";

/**
 * Interface for keyboard navigation options
 */
interface KeyboardNavigationOptions {
  /** Enable arrow key navigation */
  enableArrowKeys?: boolean;
  /** Enable tab navigation */
  enableTabNavigation?: boolean;
  /** Enable escape key handling */
  enableEscapeKey?: boolean;
  /** Callback for escape key press */
  onEscape?: () => void;
  /** Callback for enter key press */
  onEnter?: () => void;
  /** Enable focus trapping within container */
  trapFocus?: boolean;
}

/**
 * Hook for enhanced keyboard navigation
 * Provides comprehensive keyboard accessibility support
 */
export function useKeyboardNavigation<T extends HTMLElement = HTMLDivElement>(
  options: KeyboardNavigationOptions = {}
) {
  const {
    enableArrowKeys = true,
    enableTabNavigation = true,
    enableEscapeKey = true,
    onEscape,
    onEnter,
    trapFocus = false,
  } = options;

  const containerRef = useRef<T>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  /**
   * Get all focusable elements within the container
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
    ].join(", ");

    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }, []);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      try {
        const focusableElements = getFocusableElements();
        focusableElementsRef.current = focusableElements;

        if (focusableElements.length === 0) return;

        const currentIndex = focusableElements.findIndex(
          (el) => el === document.activeElement
        );

        switch (event.key) {
          case "ArrowDown":
          case "ArrowRight":
            if (enableArrowKeys) {
              event.preventDefault();
              const nextIndex = (currentIndex + 1) % focusableElements.length;
              focusableElements[nextIndex]?.focus();
            }
            break;

          case "ArrowUp":
          case "ArrowLeft":
            if (enableArrowKeys) {
              event.preventDefault();
              const prevIndex =
                currentIndex <= 0
                  ? focusableElements.length - 1
                  : currentIndex - 1;
              focusableElements[prevIndex]?.focus();
            }
            break;

          case "Home":
            if (enableArrowKeys) {
              event.preventDefault();
              focusableElements[0]?.focus();
            }
            break;

          case "End":
            if (enableArrowKeys) {
              event.preventDefault();
              focusableElements[focusableElements.length - 1]?.focus();
            }
            break;

          case "Tab":
            if (trapFocus) {
              event.preventDefault();
              const nextIndex = event.shiftKey
                ? currentIndex <= 0
                  ? focusableElements.length - 1
                  : currentIndex - 1
                : (currentIndex + 1) % focusableElements.length;
              focusableElements[nextIndex]?.focus();
            }
            break;

          case "Escape":
            if (enableEscapeKey && onEscape) {
              event.preventDefault();
              onEscape();
            }
            break;

          case "Enter":
          case " ":
            if (
              onEnter &&
              document.activeElement?.getAttribute("role") === "button"
            ) {
              event.preventDefault();
              onEnter();
            }
            break;
        }
      } catch (error) {
        devLog.error(
          "[useKeyboardNavigation] Keyboard navigation error:",
          error
        );
      }
    },
    [
      enableArrowKeys,
      enableTabNavigation,
      enableEscapeKey,
      trapFocus,
      onEscape,
      onEnter,
      getFocusableElements,
    ]
  );

  /**
   * Set up keyboard event listeners
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * Focus first focusable element
   */
  const focusFirst = useCallback(() => {
    const focusableElements = getFocusableElements();
    focusableElements[0]?.focus();
  }, [getFocusableElements]);

  /**
   * Focus last focusable element
   */
  const focusLast = useCallback(() => {
    const focusableElements = getFocusableElements();
    focusableElements[focusableElements.length - 1]?.focus();
  }, [getFocusableElements]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    getFocusableElements,
  };
}
