import api from '../Config/Axios';
import ProductService from './Product.service';

class TransactionService {  async createTransaction(shippingAddress, paymentMethod) {
    try {
      // Get cart items
      const cartItems = ProductService.getCartItems();
      
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Your cart is empty');
      }
        // Format items for API - ensure the product IDs are valid
      const formattedItems = cartItems.map(item => {
        // Log each cart item for debugging
        console.log('Processing cart item:', item);
        
        return {
          productId: item.id, // This should be the MongoDB _id
          quantity: item.quantity,
          priceAtPurchase: item.price
        };
      });
      
      // Calculate total
      const total = ProductService.calculateCartTotal(cartItems);
      
      // Create payload
      const payload = {
        items: formattedItems,
        totalAmount: total, // We're not doubling the total anymore
        paymentMethod,
        shippingAddress
      };
        // Debug the API request
      console.log('Sending transaction with payload:', JSON.stringify(payload, null, 2));
      
      // Send API request
      const response = await api.post('/api/transactions', payload);
      
      console.log('Transaction created successfully:', response.data);
      
      // Clear cart on success
      ProductService.clearCart();
      
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      
      // Enhance error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Request URL:', error.config.url);
        console.error('Request method:', error.config.method);
      }
      
      throw error;
    }
  }
  async getUserTransactions() {
    try {
      const response = await api.get('/api/transactions/my-orders');
      return response.data;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  async getTransactionById(id) {
    try {
      const response = await api.get(`/api/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw error;
    }
  }

  formatRupees(amount) {
    return `₹${parseFloat(amount).toFixed(2)}`;
  }
  
  formatDate(dateString) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  }
  
  getStatusColor(status) {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export default new TransactionService();