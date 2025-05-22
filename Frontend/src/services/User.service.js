import axios from '../Config/Axios';

class UserService {
  // Register a new user
  async register(username, email, password) {
    try {
      const response = await axios.post('/api/users/register', {
        username,
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(email, password) {
    try {
      const response = await axios.post('/api/users/login', {
        email,
        password
      });
      
      // Store token in localStorage if login is successful
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const response = await axios.get('/api/users');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user by ID
  async getUserById(id) {
    try {
      const response = await axios.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  // Update user information
  async updateUser(id, userData) {
    try {
      // Ensure we have the token for this request
      const token = this.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.put(`/api/users/${id}`, userData);
      
      // Update stored user data if it's the current user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser._id === id) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete user account
  async deleteUser(id) {
    try {
      const response = await axios.delete(`/api/users/${id}`);
      
      // If deleting current user, log them out
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser._id === id) {
        this.logout();
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user's order history
  async getUserOrderHistory(id) {
    try {
      const response = await axios.get(`/api/users/${id}/orders`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get current user's order history (convenience method)
  async getMyOrderHistory() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('User not logged in');
    
    return this.getUserOrderHistory(currentUser._id);
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('userToken');
  }

  // Get current logged in user
  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Get authentication token
  getToken() {
    return localStorage.getItem('userToken');
  }

  // Logout user
  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      return { message: 'Server did not respond. Please try again later.' };
    } else {
      return { message: error.message || 'An unexpected error occurred' };
    }
  }
}

export default new UserService();