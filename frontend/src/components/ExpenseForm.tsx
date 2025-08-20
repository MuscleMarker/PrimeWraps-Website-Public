import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
}

interface Job {
  id: number;
  title: string;
}

interface ExpenseFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  expense?: any;
  isEdit?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel, expense, isEdit = false }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'MATERIALS',
    date: new Date().toLocaleString('sv-SE', { timeZone: 'America/Los_Angeles' }).slice(0, 16),
    notes: '',
    isTaxDeductible: false,
    isRecurring: false,
    recurringFrequency: '',
    paidByUserId: '',
    jobId: '',
    isSharedExpense: false,
    splitUserIds: [] as number[]
  });

  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'MATERIALS', 'TOOLS', 'TRAVEL', 'MEALS', 'UTILITIES', 'INSURANCE',
    'SUBSCRIPTIONS', 'MARKETING', 'OFFICE_SUPPLIES', 'EQUIPMENT', 'MAINTENANCE', 'OTHER'
  ];

  const frequencies = ['monthly', 'quarterly', 'yearly'];

  useEffect(() => {
    fetchUsers();
    fetchJobs();
    if (expense && isEdit) {
      setFormData({
        description: expense.description || '',
        amount: expense.amount?.toString() || '',
        category: expense.category || 'MATERIALS',
        date: expense.date ? new Date(expense.date).toLocaleString('sv-SE', { timeZone: 'America/Los_Angeles' }).slice(0, 16) : new Date().toLocaleString('sv-SE', { timeZone: 'America/Los_Angeles' }).slice(0, 16),
        notes: expense.notes || '',
        isTaxDeductible: expense.isTaxDeductible || false,
        isRecurring: expense.isRecurring || false,
        recurringFrequency: expense.recurringFrequency || '',
        paidByUserId: expense.paidByUser?.id?.toString() || '',
        jobId: expense.job?.id?.toString() || '',
        isSharedExpense: expense.isSharedExpense || false,
        splitUserIds: expense.splitUsers?.map((u: any) => u.id) || []
      });
    }
  }, [expense, isEdit]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('jwtToken');
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        paidByUserId: parseInt(formData.paidByUserId),
        jobId: formData.jobId ? parseInt(formData.jobId) : null,
        splitCount: formData.isSharedExpense ? formData.splitUserIds.length + 1 : 1
      };
      
      console.log('Submitting expense payload:', payload);

      if (isEdit && expense) {
        await axios.put(`${import.meta.env.VITE_API_URL}/expenses/${expense.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/expenses`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      onSubmit();
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while saving the expense');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };
      
      // If the paid by user changed, remove them from split users if they were selected
      if (name === 'paidByUserId' && newData.isSharedExpense) {
        const paidByUserId = parseInt(value);
        newData.splitUserIds = newData.splitUserIds.filter(id => id !== paidByUserId);
      }
      
      return newData;
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSplitUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({
      ...prev,
      splitUserIds: selectedUserIds
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 font-gwendolyn">
        {isEdit ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter expense description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paid By *
            </label>
            <select
              name="paidByUserId"
              value={formData.paidByUserId}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job (Optional)
            </label>
            <select
              name="jobId"
              value={formData.jobId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select job</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isSharedExpense"
              checked={formData.isSharedExpense}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Shared Expense</span>
          </label>
        </div>

        {formData.isSharedExpense && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Split with (select other users to split with)
            </label>
            <select
              multiple
              name="splitUserIds"
              value={formData.splitUserIds.map(String)}
              onChange={handleSplitUserChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {users
                .filter(user => user.id.toString() !== formData.paidByUserId) // Exclude the person who paid
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Note: You are already included in the split as the person who paid.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isTaxDeductible"
              checked={formData.isTaxDeductible}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Tax Deductible</span>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Recurring</span>
          </div>
        </div>

        {formData.isRecurring && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recurring Frequency
            </label>
            <select
              name="recurringFrequency"
              value={formData.recurringFrequency}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select frequency</option>
              {frequencies.map(freq => (
                <option key={freq} value={freq}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes about the expense"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Expense' : 'Add Expense')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
