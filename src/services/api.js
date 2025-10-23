import { supabase } from '@config/supabase';
import { config } from '@config';

/**
 * API service for making HTTP requests
 */
class ApiService {
  constructor() {
    this.baseURL = config.api.url;
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} Response data
   */
  async get(endpoint, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseURL}${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise} Response data
   */
  async post(endpoint, data = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise} Response data
   */
  async put(endpoint, data = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} Response data
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get request headers
   * @returns {Object} Headers
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add authentication token if available
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch response
   * @returns {Promise} Parsed response data
   */
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  /**
   * Handle API error
   * @param {Error} error - Error object
   * @returns {Object} Error response
   */
  handleError(error) {
    console.error('API Error:', error);
    return {
      error: true,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Supabase database helpers
export const db = {
  /**
   * Get all records from a table
   * @param {string} table - Table name
   * @returns {Promise} Records
   */
  async getAll(table) {
    const { data, error } = await supabase.from(table).select('*');
    return { data, error };
  },

  /**
   * Get a single record by ID
   * @param {string} table - Table name
   * @param {string|number} id - Record ID
   * @returns {Promise} Record
   */
  async getById(table, id) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  /**
   * Create a new record
   * @param {string} table - Table name
   * @param {Object} data - Record data
   * @returns {Promise} Created record
   */
  async create(table, data) {
    const { data: newData, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single();
    return { data: newData, error };
  },

  /**
   * Update a record
   * @param {string} table - Table name
   * @param {string|number} id - Record ID
   * @param {Object} data - Updated data
   * @returns {Promise} Updated record
   */
  async update(table, id, data) {
    const { data: updatedData, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    return { data: updatedData, error };
  },

  /**
   * Delete a record
   * @param {string} table - Table name
   * @param {string|number} id - Record ID
   * @returns {Promise} Deletion result
   */
  async delete(table, id) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    return { error };
  },
};

export const api = new ApiService();

