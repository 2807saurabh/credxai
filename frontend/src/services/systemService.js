import apiClient from './apiClient';

/**
 * Service to check system health of Spring Boot and ML Services
 */
export const systemService = {
  /**
   * Check Spring Boot Backend health or status
   */
  async checkBackend() {
  try {
    const start = Date.now();

    // Use an existing, lightweight endpoint here.
    const res = await apiClient.get('/api/auth/health', {
      timeout: 3000,
    });

    return {
      status: 'ONLINE',
      latency: Date.now() - start,
    };
  } catch (err) {
    if (
      err.response &&
      [401, 403].includes(err.response.status)
    ) {
      return { status: 'ONLINE', port: 8080 };
    }

    return {
      status: 'OFFLINE',
      error: err.message,
    };
  }
},

  /**
   * Check Traditional ML Service (Port 8002)
   * Uses same-origin Vite proxy (/ml-trad/health) first to avoid CORS in browser,
   * falls back to direct URL if outside proxy context.
   * Handles:
   * 1. Boolean `true` or `"true"`
   * 2. Object with `{ status: "healthy", model_loaded: true }`
   */
  async checkTraditionalMl() {
    try {
      let res;
      try {
        res = await fetch('/ml-trad/health', { signal: AbortSignal.timeout(3000) });
      } catch {
        // Fallback to direct URL if proxy path fails
        res = await fetch('http://127.0.0.1:8002/health', { signal: AbortSignal.timeout(3000) });
      }

      if (res && res.ok) {
        const text = await res.text();
        let isHealthy = false;
        let data = null;

        try {
          data = JSON.parse(text);
          if (
            data === true ||
            data === 'true' ||
            data?.model_loaded === true ||
            data?.status === 'healthy' ||
            data?.status === 'ok'
          ) {
            isHealthy = true;
          }
        } catch {
          // Plain text response check
          if (text.trim().toLowerCase() === 'true' || text.trim().toLowerCase() === 'ok') {
            isHealthy = true;
          }
        }

        if (isHealthy) {
          return { status: 'ONLINE', details: data || text };
        }
        return { status: 'OFFLINE', details: data || text };
      }
      return { status: 'OFFLINE' };
    } catch {
      return { status: 'UNREACHABLE' };
    }
  },

  /**
   * Check Alternative ML Service (Port 8001)
   * Uses same-origin Vite proxy (/ml-alt/health) first to avoid CORS in browser,
   * falls back to direct URL if outside proxy context.
   * Handles:
   * 1. Boolean `true` or `"true"`
   * 2. Object with `{ status: "healthy", model_loaded: true }`
   */
  async checkAlternativeMl() {
    try {
      let res;
      try {
        res = await fetch('/ml-alt/health', { signal: AbortSignal.timeout(3000) });
      } catch {
        // Fallback to direct URL if proxy path fails
        res = await fetch('http://127.0.0.1:8001/health', { signal: AbortSignal.timeout(3000) });
      }

      if (res && res.ok) {
        const text = await res.text();
        let isHealthy = false;
        let data = null;

        try {
          data = JSON.parse(text);
          if (
            data === true ||
            data === 'true' ||
            data?.model_loaded === true ||
            data?.status === 'healthy' ||
            data?.status === 'ok'
          ) {
            isHealthy = true;
          }
        } catch {
          // Plain text response check
          if (text.trim().toLowerCase() === 'true' || text.trim().toLowerCase() === 'ok') {
            isHealthy = true;
          }
        }

        if (isHealthy) {
          return { status: 'ONLINE', details: data || text };
        }
        return { status: 'OFFLINE', details: data || text };
      }
      return { status: 'OFFLINE' };
    } catch {
      return { status: 'UNREACHABLE' };
    }
  }
};

export default systemService;
