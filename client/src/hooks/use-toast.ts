import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

/**
 * Configuration Constants:
 * - TOAST_LIMIT: Maximum number of toasts to display simultaneously
 * - TOAST_REMOVE_DELAY: Delay before removing a dismissed toast (in ms)
 *   Note: 1,000,000ms = ~16 minutes - consider reducing this for most use cases
 */
const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

/**
 * Extended Toast Type:
 * Combines base ToastProps with custom fields for richer toast functionality
 */
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

/**
 * Action Types:
 * Defines all possible state mutations for the toast system
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

// Counter for generating unique toast IDs
let count = 0

/**
 * ID Generator:
 * Creates sequential IDs within safe integer range
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

/**
 * Action Union Type:
 * All possible actions that can be dispatched to the reducer
 */
type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] }

interface State {
  toasts: ToasterToast[]
}

/**
 * Timeout Management:
 * Tracks scheduled toast removals to prevent memory leaks
 */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Queues a toast for removal after delay
 * Ensures each toast only has one pending removal timeout
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * Reducer Function:
 * Pure function that handles state transitions
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        // Add new toast and enforce limit
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        // Merge updates with existing toast
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Queue removal for specific toast or all toasts
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id))
      }

      return {
        ...state,
        // Mark toast(s) as closed
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      return {
        ...state,
        // Remove specific toast or clear all
        toasts: action.toastId === undefined
          ? []
          : state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

/**
 * State Management:
 * - listeners: Components subscribed to state changes
 * - memoryState: Single source of truth for toast state
 */
const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

/**
 * Dispatches actions and notifies listeners
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

type Toast = Omit<ToasterToast, "id">

/**
 * Toast API:
 * - toast(): Creates and displays a new toast
 * - Returns methods to update/dismiss the toast
 */
function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } })

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      // Auto-dismiss when closed via UI interaction
      onOpenChange: (open) => { if (!open) dismiss() },
    },
  })

  return { id, dismiss, update }
}

/**
 * useToast Hook:
 * Provides toast state and methods to components
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    // Subscribe to state changes
    listeners.push(setState)
    return () => {
      // Cleanup subscription
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => 
      dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }