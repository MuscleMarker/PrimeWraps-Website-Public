import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import ExpenseForm from './ExpenseForm';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
  isTaxDeductible: boolean;
  isRecurring: boolean;
  recurringFrequency: string;
  paidByUsername: string;
  createdByUsername: string;
  jobTitle: string | null;
  isSharedExpense: boolean;
  splitCount: number;
  status: string;
  createdAt: string;
}

const ExpenseManagement: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const categories = [
    'ALL', 'MATERIALS', 'TOOLS', 'TRAVEL', 'MEALS', 'UTILITIES', 'INSURANCE',
    'SUBSCRIPTIONS', 'MARKETING', 'OFFICE_SUPPLIES', 'EQUIPMENT', 'MAINTENANCE', 'OTHER'
  ];

  const statuses = ['ALL', 'PENDING', 'APPROVED', 'REIMBURSED', 'REJECTED'];

  useEffect(() => {
    fetchExpenses();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('ExpenseManagement: Current user:', response.data);
      setCurrentUser(response.data.username);
    } catch (err: any) {
      console.error('Failed to get current user:', err);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('ExpenseManagement: Received expenses:', response.data);
      setExpenses(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`${import.meta.env.VITE_API_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
      // Trigger settlement calculator refresh
      localStorage.setItem('expenseUpdated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('expenseUpdated', { detail: 'expenseUpdated' }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`${import.meta.env.VITE_API_URL}/expenses/${id}/status?status=${newStatus}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
      // Trigger settlement calculator refresh
      localStorage.setItem('expenseUpdated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('expenseUpdated', { detail: 'expenseUpdated' }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update expense status');
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingExpense(null);
    fetchExpenses();
    // Trigger settlement calculator refresh
    localStorage.setItem('expenseUpdated', Date.now().toString());
    // Dispatch custom event for immediate refresh
    console.log('ExpenseManagement dispatching expenseUpdated event...');
    window.dispatchEvent(new CustomEvent('expenseUpdated', { detail: 'expenseUpdated' }));
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesStatus = filterStatus === 'ALL' || expense.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || expense.category === filterCategory;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.paidByUsername.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingAmount = filteredExpenses
    .filter(expense => expense.status === 'PENDING')
    .reduce((sum, expense) => sum + expense.amount, 0);

  if (showForm) {
    return (
      <ExpenseForm
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        expense={editingExpense}
        isEdit={!!editingExpense}
      />
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading expenses...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 font-gwendolyn">Expense Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Add Expense
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Expenses</h3>
          <p className="text-2xl font-bold text-blue-800">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">Pending Approval</h3>
          <p className="text-2xl font-bold text-yellow-800">${pendingAmount.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">Total Count</h3>
          <p className="text-2xl font-bold text-green-800">{filteredExpenses.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search expenses..."
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'ALL' ? 'All Categories' : category.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setFilterStatus('ALL');
              setFilterCategory('ALL');
              setSearchTerm('');
            }}
            className="w-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Description</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Paid By</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No expenses found matching the current filters.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      {expense.notes && (
                        <div className="text-xs text-gray-500 mt-1">{expense.notes}</div>
                      )}
                      {expense.jobTitle && (
                        <div className="text-xs text-blue-600 mt-1">Job: {expense.jobTitle}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="font-semibold">${expense.amount.toFixed(2)}</div>
                    {expense.isSharedExpense && (
                      <div className="text-xs text-gray-500">Split: {expense.splitCount}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {expense.category.replace('_', ' ')}
                    </span>
                    {expense.isTaxDeductible && (
                      <div className="text-xs text-green-600 mt-1">Tax Deductible</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{expense.paidByUsername}</td>
                                          <td className="py-3 px-4 text-sm text-gray-700">
                          {new Date(expense.date).toLocaleDateString('en-US', {
                            timeZone: 'America/Los_Angeles',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <select
                      value={expense.status}
                      onChange={(e) => handleStatusChange(expense.id, e.target.value)}
                      className="p-1 border border-gray-300 rounded text-xs"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REIMBURSED">Reimbursed</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {(() => {
                      console.log('Checking expense:', expense.id, 'currentUser:', currentUser, 'createdByUsername:', expense.createdByUsername);
                      return currentUser === expense.createdByUsername ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Created by {expense.createdByUsername || 'Unknown'}</span>
                      );
                    })()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseManagement;
