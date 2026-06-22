/// <reference types="vite/client" />

type MarkedParser = (source: string, options?: { breaks?: boolean }) => string

type MathJaxInstance = {
  typesetPromise: (elements?: Element[]) => Promise<void>
  typesetClear?: (elements?: Element[]) => void
}

type ViewTransitionInstance = {
  ready: Promise<void>
  finished: Promise<void>
}

declare global {
  interface Document {
    startViewTransition?: (callback: () => void | Promise<void>) => ViewTransitionInstance
  }

  interface Window {
    marked?: {
      parse?: MarkedParser
    }
    MathJax?: MathJaxInstance | null
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'home' | 'auth' | 'app'
    requiresAuth?: boolean
    order?: number
  }
}

export {}
