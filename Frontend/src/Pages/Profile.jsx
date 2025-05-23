import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/User.service';
import TransactionService from '../services/Transaction.service';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Transaction state
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalMode, setModalMode] = useState('view');

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      if (!UserService.isLoggedIn()) {
        navigate('/auth');
        return;
      }
      try {
        const currentUser = UserService.getCurrentUser();
        setUser(currentUser);
        setFormData({
          username: currentUser.username || '',
          email: currentUser.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        setError('Error loading profile data');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // Fetch user transactions
    const fetchTransactions = async () => {
      try {
        setTransactionsLoading(true);
        const data = await TransactionService.getUserTransactions();
        setTransactions(data);
      } catch (error) {
        toast.error('Failed to load transactions');
      } finally {
        setTransactionsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    const updateData = {
      username: formData.username,
      email: formData.email
    };
    if (formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.password = formData.newPassword;
    }
    try {
      const response = await UserService.updateUser(user._id, updateData);
      setUser(response.user);
      setSuccessMessage('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    UserService.logout();
    navigate('/auth');
  };

  // Transaction modal logic
  const viewTransactionDetails = async (transactionId) => {
    try {
      const data = await TransactionService.getTransactionById(transactionId);
      setSelectedTransaction(data);
      setModalMode('view');
    } catch (error) {
      toast.error('Failed to load transaction details');
    }
  };
  const closeTransactionDetails = () => {
    setSelectedTransaction(null);
  };

  // Print/Download receipt
  const printReceipt = () => {
    if (!selectedTransaction) return;
    const printContent = document.getElementById('transaction-receipt');
    if (!printContent) return;
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write('<html><head><title>Order Receipt</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Status badge
  const StatusBadge = ({ status }) => {
    const colorClass = TransactionService.getStatusColor(status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-8 pt-16 px-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
        {/* Profile Section */}
        <div className="md:w-1/3">
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="w-32 h-32 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-5xl font-bold text-orange-500">{user?.username?.charAt(0).toUpperCase()}</span>
            </div>
            <h2 className="mt-4 font-bold text-xl">{user?.username}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <div className="mt-6">
              <button
                onClick={() => setEditMode(!editMode)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition duration-300 mb-2"
              >
                {editMode ? 'Cancel Edit' : 'Edit Profile'}
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
          {editMode && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-bold text-lg mb-2">Change Password (Optional)</h3>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
        </div>
        {/* Transaction Section */}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">Order History</h2>
          {transactionsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-10 h-10 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-gray-50 rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <a href="/" className="text-blue-600 hover:underline">Start shopping</a>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{transaction._id.substring(0, 8)}...</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{TransactionService.formatDate(transaction.createdAt)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{TransactionService.formatRupees(transaction.totalAmount)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm"><StatusBadge status={transaction.status} /></td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => viewTransactionDetails(transaction._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6" id="transaction-receipt">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button 
                  onClick={closeTransactionDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <div className="flex flex-wrap justify-between items-center mb-2">
                  <div>
                    <span className="text-gray-600">Order ID: </span>
                    <span className="font-medium">{selectedTransaction._id}</span>
                  </div>
                  <StatusBadge status={selectedTransaction.status} />
                </div>
                <div className="text-sm text-gray-600">
                  {TransactionService.formatDate(selectedTransaction.createdAt)}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  {selectedTransaction.items.map((item, index) => (
                    <div key={index} className={`flex justify-between p-3 ${index !== selectedTransaction.items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                      <div className="flex items-center">
                        {item.productId.images && item.productId.images[0] ? (
                          <img 
                            src={item.productId.images[0]} 
                            alt={item.productId.name} 
                            className="w-12 h-12 object-cover rounded mr-3"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48?text=No+Image";
                              e.target.onerror = null;
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{item.productId.name}</div>
                          <div className="text-sm text-gray-600">
                            {TransactionService.formatRupees(item.priceAtPurchase)} × {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">
                        {TransactionService.formatRupees(item.priceAtPurchase * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <div className="bg-gray-50 rounded-md p-3">
                  <p>{selectedTransaction.shippingAddress.street}</p>
                  <p>
                    {selectedTransaction.shippingAddress.city},{' '}
                    {selectedTransaction.shippingAddress.state},{' '}
                    {selectedTransaction.shippingAddress.zipCode}
                  </p>
                  <p>{selectedTransaction.shippingAddress.country}</p>
                  <p>Phone: {selectedTransaction.shippingAddress.phone}</p>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Payment Information</h3>
                <div className="bg-gray-50 rounded-md p-3">
                  <p><span className="text-gray-600">Method: </span>{selectedTransaction.paymentMethod}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{TransactionService.formatRupees(selectedTransaction.totalAmount * 0.9)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span>{TransactionService.formatRupees(selectedTransaction.totalAmount * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{TransactionService.formatRupees(selectedTransaction.totalAmount)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 px-6 pb-4">
              <button
                onClick={printReceipt}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Print / Download Receipt
              </button>
              <button
                onClick={closeTransactionDetails}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
