import apiClient from './apiClient';

/**
 * Authentication Service matching Spring Boot AuthController DTOs
 */
export const authService = {
  /**
   * Register a new user
   * @param {Object} data - { fullName, email, password }
   * @returns {Promise<Object>} - { id, fullName, email, role, token: null }
   */
  async register({ fullName, email, password }) {
    const response = await apiClient.post('/api/auth/register', {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    return response.data;
  },

  /**
   * Log in an existing user
   * @param {Object} data - { email, password }
   * @returns {Promise<Object>} - { id, fullName, email, role, token }
   */
  async login({ email, password }) {
    const response = await apiClient.post('/api/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    return response.data;
  },
};

export default authService;
