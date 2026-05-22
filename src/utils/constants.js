let apiRoot = ''

// Vite uses import.meta.env instead of process.env
if (import.meta.env.MODE === 'development' || import.meta.env.VITE_BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
} else if (import.meta.env.VITE_API_ROOT) {
  // Production: Use VITE_API_ROOT from environment
  apiRoot = import.meta.env.VITE_API_ROOT
}

export const API_ROOT = apiRoot
export const DEFAULT_PAGE = 1
export const DEFAULT_ITEM_PER_PAGE = 10
