import apiClient from './apiClient';

/**
 * Prediction Service calling Spring Boot endpoints:
 * - POST /api/predictions/traditional?userId={id}
 * - POST /api/predictions/alternative?userId={id}
 */
export const predictionService = {
  /**
   * Run traditional credit prediction
   * @param {number|string} userId
   * @param {Object} payload TraditionalPredictionRequest
   */
  async predictTraditional(userId, payload) {
    const response = await apiClient.post('/api/predictions/traditional', payload, {
      params: { userId },
    });
    return response.data;
  },

  /**
   * Run alternative-data credit prediction
   * @param {number|string} userId
   * @param {Object} payload AlternativePredictionRequest
   */
  async predictAlternative(userId, payload) {
    const response = await apiClient.post('/api/predictions/alternative', payload, {
      params: { userId },
    });
    return response.data;
  },

  /**
   * Fetch authenticated user's credit application history
   * Calls GET /api/predictions/history (requires Bearer token)
   */
  async getHistory() {
    const response = await apiClient.get('/api/predictions/history');
    return response.data;
  },
};

export default predictionService;
