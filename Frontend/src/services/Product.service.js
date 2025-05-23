import api from '../Config/Axios';

class ProductService {
  async getAllProducts(page = 1, limit = 10, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await api.get(`/api/products?${queryParams}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductById(id) {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchProducts(query) {
    try {
      const response = await api.get(`/api/products/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductsByCategory(category) {
    try {
      const response = await api.get(`/api/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addNewProduct(productData) {
    try {
      const response = await api.post('/api/products', productData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/api/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(id) {
    try {
      const response = await api.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  addToCart(product, quantity = 1) {
    try {
      console.log('Adding product to cart:', product);
      
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      
      if (!product || !product.id) {
        console.error('Invalid product data:', product);
        throw new Error('Invalid product data');
      }
      
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
        console.log('Updated existing cart item:', cartItems[existingItemIndex]);
      } else {
        // Ensure _id is used as product id if available
        const productId = product._id || product.id;
        
        cartItems.push({
          id: productId,
          name: product.name,
          price: product.price,
          image: product.image || (product.images && product.images[0]),
          quantity: quantity
        });
        console.log('Added new cart item with ID:', productId);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      window.dispatchEvent(new CustomEvent('cart-updated'));
      
      return cartItems;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  getCartItems() {
    try {
      return JSON.parse(localStorage.getItem('cartItems')) || [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  updateCartItemQuantity(productId, quantity) {
    try {
      const cartItems = this.getCartItems();
      const itemIndex = cartItems.findIndex(item => item.id === productId);
      
      if (itemIndex === -1) {
        throw new Error('Product not found in cart');
      }
      
      if (quantity <= 0) {
        cartItems.splice(itemIndex, 1);
      } else {
        cartItems[itemIndex].quantity = quantity;
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      window.dispatchEvent(new CustomEvent('cart-updated'));
      
      return cartItems;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  }

  removeFromCart(productId) {
    try {
      const cartItems = this.getCartItems();
      const updatedCart = cartItems.filter(item => item.id !== productId);
      
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent('cart-updated'));
      
      return updatedCart;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }

  clearCart() {
    try {
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  calculateCartTotal(cartItems = null) {
    try {
      const items = cartItems || this.getCartItems();
      return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return 0;
    }
  }

  handleError(error) {
    console.error('Product service error:', error);
    
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || 'An error occurred with the product operation',
        error: error.response.data
      };
    } else if (error.request) {
      return {
        status: 503,
        message: 'No response from server. Please check your connection.',
        error: error
      };
    } else {
      return {
        status: 500,
        message: 'Error setting up request',
        error: error.message
      };
    }
  }
}

export default new ProductService();