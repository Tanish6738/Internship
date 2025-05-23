import React, { useState, useEffect } from 'react'
import TransactionService from '../services/Transaction.service'
import { toast } from 'react-hot-toast'

const Transaction = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const data = await TransactionService.getUserTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const viewTransactionDetails = async (transactionId) => {
    try {
      const data = await TransactionService.getTransactionById(transactionId)
      setSelectedTransaction(data)
    } catch (error) {
      console.error('Error fetching transaction details:', error)
      toast.error('Failed to load transaction details')
    }
  }

  const closeTransactionDetails = () => {
    setSelectedTransaction(null)
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    const colorClass = TransactionService.getStatusColor(status)
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="container min-h-screen w-full px-4 sm:px-6 md:px-12 lg:px-20 mx-auto bg-gradient-to-br from-white via-orange-50 to-white pt-[4.5em] sm:pt-[5em] pb-10 sm:pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container min-h-screen w-full px-4 sm:px-6 md:px-12 lg:px-20 mx-auto bg-gradient-to-br from-white via-orange-50 to-white pt-[4.5em] sm:pt-[5em] pb-10 sm:pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">My Orders</h1>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <a href="/" className="text-blue-600 hover:underline">Start shopping</a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Desktop view */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction._id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {TransactionService.formatDate(transaction.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {TransactionService.formatRupees(transaction.totalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={transaction.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

          {/* Mobile view */}
          <div className="md:hidden">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-medium">Order #{transaction._id.substring(0, 8)}...</div>
                    <div className="text-xs text-gray-500">
                      {TransactionService.formatDate(transaction.createdAt)}
                    </div>
                  </div>
                  <StatusBadge status={transaction.status} />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="font-medium">
                    {TransactionService.formatRupees(transaction.totalAmount)}
                  </div>
                  <button
                    onClick={() => viewTransactionDetails(transaction._id)}
                    className="text-blue-600 text-sm hover:text-blue-900"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
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
          </div>
        </div>
      )}
    </div>
  )
}

export default Transaction