import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Settlement {
  id: number;
  fromUser: {
    id: number;
    username: string;
  };
  toUser: {
    id: number;
    username: string;
  };
  amount: number;
  status: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
}

interface SettlementPaymentProps {
  refreshTrigger: number;
  onPaymentComplete: () => void;
}

const SettlementPayment: React.FC<SettlementPaymentProps> = ({ refreshTrigger, onPaymentComplete }) => {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [paidSettlements, setPaidSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingSettlements, setCreatingSettlements] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [editingAmounts, setEditingAmounts] = useState<{[key: number]: boolean}>({});
  const [customAmounts, setCustomAmounts] = useState<{[key: number]: string}>({});
  const [confirmedAmounts, setConfirmedAmounts] = useState<{[key: number]: number}>({});
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  useEffect(() => {
    fetchSettlements();
    fetchPaidSettlements();
  }, [refreshTrigger]);

  const fetchSettlements = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log('Fetching pending settlements...');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/settlements/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Pending settlements response:', response.data);
      setSettlements(response.data);
    } catch (error) {
      console.error('Failed to fetch settlements:', error);
    }
  };

  const fetchPaidSettlements = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log('Fetching paid settlements...');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/settlements/status/PAID`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Paid settlements response:', response.data);
      setPaidSettlements(response.data);
    } catch (error) {
      console.error('Failed to fetch paid settlements:', error);
    }
  };

  const markAsPaid = async (settlementId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const settlement = settlements.find(s => s.id === settlementId);
      
      if (!settlement) {
        throw new Error('Settlement not found');
      }

      // Use confirmed amount if available, otherwise use original amount
      const amountToPay = confirmedAmounts[settlementId] || settlement.amount;
      
      if (amountToPay <= 0) {
        alert('Please enter a valid amount greater than 0');
        return;
      }

      console.log('Marking settlement as paid:', {
        settlementId,
        originalAmount: settlement.amount,
        amountToPay,
        paymentMethod: paymentMethod || 'Cash',
        notes: notes || 'Payment completed'
      });

      // If paying full amount, mark as PAID
      if (amountToPay >= settlement.amount) {
        // Update settlement status to PAID with payment details
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/settlements/${settlementId}/status-with-payment`,
          null,
          {
            params: {
              status: 'PAID',
              paymentMethod: paymentMethod || 'Cash',
              notes: notes || 'Payment completed'
            },
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log('Payment response:', response.data);
      } else {
        // Partial payment - update the settlement amount to remaining balance
        const remainingAmount = settlement.amount - amountToPay;
        
        // Update settlement amount to remaining balance
        await axios.put(
          `${import.meta.env.VITE_API_URL}/settlements/${settlementId}`,
          {
            ...settlement,
            amount: remainingAmount
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Create a new settlement record for the paid portion
        await axios.post(
          `${import.meta.env.VITE_API_URL}/settlements/partial-payment`,
          {
            originalSettlementId: settlementId,
            amountPaid: amountToPay,
            paymentMethod: paymentMethod || 'Cash',
            notes: notes || 'Partial payment completed'
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log('Partial payment processed:', {
          originalAmount: settlement.amount,
          amountPaid: amountToPay,
          remainingAmount: remainingAmount
        });
      }

      // Refresh settlements list
      await fetchSettlements();
      await fetchPaidSettlements();
      onPaymentComplete();
      
      // Clear form and editing state
      setPaymentMethod('');
      setNotes('');
      setEditingAmounts(prev => ({ ...prev, [settlementId]: false }));
      setCustomAmounts(prev => ({ ...prev, [settlementId]: '' }));
      setConfirmedAmounts(prev => ({ ...prev, [settlementId]: 0 }));
      
      alert('Payment processed successfully!');
    } catch (error: any) {
      console.error('Failed to process payment:', error);
      const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
      alert(`Failed to process payment: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const createSettlements = async () => {
    setCreatingSettlements(true);
    try {
      const token = localStorage.getItem('jwtToken');
      console.log('Creating settlements...');
      
      // First, let's check what shared expenses exist
      const expensesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('All expenses:', expensesResponse.data);
      
      const sharedExpenses = expensesResponse.data.filter((expense: any) => expense.sharedExpense);
      console.log('Shared expenses:', sharedExpenses);
      
      if (sharedExpenses.length === 0) {
        alert('No shared expenses found. Please create some shared expenses first.');
        return;
      }
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/settlements/create-settlements`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Settlement creation response:', response.data);
      
      // Wait a moment for the backend to process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await fetchSettlements();
      alert('Settlements created successfully! Check the list below.');
    } catch (error: any) {
      console.error('Failed to create settlements:', error);
      const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
      alert(`Failed to create settlements: ${errorMessage}`);
    } finally {
      setCreatingSettlements(false);
    }
  };

  const toggleAmountEditing = (settlementId: number) => {
    setEditingAmounts(prev => ({
      ...prev,
      [settlementId]: !prev[settlementId]
    }));
    
    // Initialize custom amount with current settlement amount
    if (!customAmounts[settlementId]) {
      const settlement = settlements.find(s => s.id === settlementId);
      if (settlement) {
        setCustomAmounts(prev => ({
          ...prev,
          [settlementId]: settlement.amount.toString()
        }));
      }
    }
  };

  const handleCustomAmountChange = (settlementId: number, value: string) => {
    setCustomAmounts(prev => ({
      ...prev,
      [settlementId]: value
    }));
  };

  const useFullAmount = (settlementId: number) => {
    const settlement = settlements.find(s => s.id === settlementId);
    if (settlement) {
      setCustomAmounts(prev => ({
        ...prev,
        [settlementId]: settlement.amount.toString()
      }));
    }
  };

  const confirmCustomAmount = (settlementId: number) => {
    const customAmount = customAmounts[settlementId];
    const amount = parseFloat(customAmount);
    
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    setConfirmedAmounts(prev => ({
      ...prev,
      [settlementId]: amount
    }));
    
    setEditingAmounts(prev => ({
      ...prev,
      [settlementId]: false
    }));
    
    alert(`Amount confirmed: ${formatCurrency(amount)}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Settlement Payments</h2>
        <button
          onClick={createSettlements}
          disabled={creatingSettlements}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          {creatingSettlements ? 'Creating...' : 'Create Settlements'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
            activeTab === 'pending'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending Payments ({settlements.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
            activeTab === 'history'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Payment History ({paidSettlements.length})
        </button>
      </div>

      {/* Pending Payments Tab */}
      {activeTab === 'pending' && (
        <>
          {settlements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No pending settlements to pay</p>
              <p className="text-gray-400 text-sm mt-2">Click "Create Settlements" to generate settlements from shared expenses</p>
            </div>
          ) : (
            <div className="space-y-4">
              {settlements.map((settlement) => (
                <div key={settlement.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {settlement.fromUser.username} → {settlement.toUser.username}
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(settlement.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due: {formatDate(settlement.dueDate)}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      {settlement.status}
                    </span>
                  </div>

                  {/* Amount Editing Section */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Payment Amount</label>
                      <button
                        onClick={() => toggleAmountEditing(settlement.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {editingAmounts[settlement.id] ? 'Cancel' : 'Edit Amount'}
                      </button>
                    </div>
                    
                    {editingAmounts[settlement.id] ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => useFullAmount(settlement.id)}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                          >
                            Full Amount ({formatCurrency(settlement.amount)})
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Custom Amount:</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={customAmounts[settlement.id] || ''}
                            onChange={(e) => handleCustomAmountChange(settlement.id, e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter custom amount"
                          />
                          <button
                            onClick={() => confirmCustomAmount(settlement.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Amount: {formatCurrency(confirmedAmounts[settlement.id] || settlement.amount)}
                        {confirmedAmounts[settlement.id] && confirmedAmounts[settlement.id] !== settlement.amount && (
                          <span className="text-blue-600 ml-2">(Custom amount set)</span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select payment method</option>
                        <option value="Cash">Cash</option>
                        <option value="Venmo">Venmo</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Zelle">Zelle</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Check">Check</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any notes about the payment..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>

                    <button
                      onClick={() => markAsPaid(settlement.id)}
                      disabled={loading || !paymentMethod}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                    >
                      {loading ? 'Processing...' : 'Mark as Paid'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Payment History Tab */}
      {activeTab === 'history' && (
        <>
          {paidSettlements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No payment history found</p>
              <p className="text-gray-400 text-sm mt-2">Payments will appear here once settlements are marked as paid</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paidSettlements.map((settlement) => (
                <div key={settlement.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {settlement.fromUser.username} → {settlement.toUser.username}
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(settlement.amount)}
                      </p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>Due: {formatDate(settlement.dueDate)}</p>
                        {settlement.paidDate && (
                          <p>Paid: {formatDate(settlement.paidDate)}</p>
                        )}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      PAID
                    </span>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-white rounded-md p-3 border border-green-200">
                    <h4 className="font-medium text-gray-800 mb-2">Payment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="ml-2 font-medium text-gray-800">
                          {settlement.paymentMethod || 'Not specified'}
                        </span>
                      </div>
                      {settlement.notes && (
                        <div className="md:col-span-2">
                          <span className="text-gray-600">Notes:</span>
                          <span className="ml-2 text-gray-800">{settlement.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SettlementPayment;
