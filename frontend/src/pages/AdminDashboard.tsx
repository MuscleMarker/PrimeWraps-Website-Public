import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import UserManagement from '../components/UserManagement';
import ExpenseManagement from '../components/ExpenseManagement';
import SettlementCalculator from '../components/SettlementCalculator';
import SettlementPayment from '../components/SettlementPayment';
import JobManagement from '../components/JobManagement';

// Enum for contact status
enum ContactStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  ARCHIVED = 'ARCHIVED',
}

// Interface for the Contact object
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  submissionTime: string;
  status: ContactStatus;
}

/**
 * Admin Dashboard component.
 * Displays contact submissions and allows administrators to manage them.
 * Also includes the UserManagement component for creating new users.
 */
const AdminDashboard: React.FC = () => {
  // State for contacts, loading status, and errors
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'contacts' | 'expenses' | 'settlements' | 'payments' | 'jobs' | 'users'>('contacts');
  const [settlementRefreshTrigger, setSettlementRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  /**
   * Fetches contact submissions from the backend.
   * Uses useCallback to prevent the function from being recreated on every render,
   * which would cause an infinite loop in the useEffect hook.
   */
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get JWT token from local storage
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        // Redirect to login page if token is not found
        navigate('/login');
        return;
      }
      // Fetch contacts from the API
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response:", response.data);
      setContacts(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response?.status === 403) {
          // Handle access denied error
          setError('Access Denied. You do not have permission to view this page.');
          localStorage.removeItem('jwtToken');
          navigate('/login');
        } else {
          // Handle other errors
          setError(err.response?.data?.message || 'Failed to fetch contacts.');
        }
      } else if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred. Failed to fetch contacts.');
      } else {
        setError('An unknown error occurred. Failed to fetch contacts.');
      }
    } finally {
      // Always set loading to false after fetching, either on success or error.
      // This prevents the component from being stuck in a loading state.
      setLoading(false);
    }
  }, [navigate]);

  // Fetch contacts when the component mounts.
  // The dependency array [fetchContacts] ensures this effect runs when fetchContacts changes.
  // Since fetchContacts is wrapped in useCallback, it only changes if its dependencies change (i.e., navigate).
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Listen for expense updates to trigger settlement refresh
  useEffect(() => {
    const handleExpenseUpdate = (e: CustomEvent) => {
      console.log('AdminDashboard received expenseUpdated event:', e.detail);
      if (e.detail === 'expenseUpdated') {
        console.log('Triggering settlement refresh from AdminDashboard...');
        setSettlementRefreshTrigger(prev => prev + 1);
      }
    };

    window.addEventListener('expenseUpdated', handleExpenseUpdate as EventListener);
    return () => window.removeEventListener('expenseUpdated', handleExpenseUpdate as EventListener);
  }, []);

  /**
   * Handles changing the status of a contact.
   * @param id - The ID of the contact to update.
   * @param newStatus - The new status of the contact.
   */
  const handleStatusChange = async (id: number, newStatus: ContactStatus) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }
      // Update the contact status via the API
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/contacts/${id}/status?status=${newStatus}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh contacts after update
      fetchContacts();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response?.data?.message || 'Failed to update contact status.');
      } else if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred. Failed to update contact status.');
      } else {
        setError('An unknown error occurred. Failed to update contact status.');
      }
    }
  };

  /**
   * Handles deleting a contact.
   * @param id - The ID of the contact to delete.
   */
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }
      // Delete the contact via the API
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh contacts after delete
      fetchContacts();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response?.data?.message || 'Failed to delete contact.');
      } else if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred. Failed to delete contact.');
      } else {
        setError('An unknown error occurred. Failed to delete contact.');
      }
    }
  };

  /**
   * Handles user logout.
   */
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  /**
   * Handles payment completion to refresh settlements.
   */
  const handlePaymentComplete = () => {
    setSettlementRefreshTrigger(prev => prev + 1);
  };

  // Display loading message while fetching data
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF2EB] text-gray-700">Loading contacts...</div>;
  }

  // Display error message if an error occurs
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF2EB] text-red-700">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF2EB] p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-7xl font-bold text-gray-800 font-gwendolyn">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'contacts'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Contact Submissions
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'expenses'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Expense Management
          </button>
          <button
            onClick={() => setActiveTab('settlements')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'settlements'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Settlements
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'payments'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'jobs'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Job Management
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            User Management
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'contacts' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Submissions</h2>
            {contacts.length === 0 ? (
              <p className="text-gray-600">No contact submissions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Phone</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Service</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Message</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Submitted</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700">{contact.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{contact.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{contact.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{contact.phone}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{contact.service}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{contact.message}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{new Date(contact.submissionTime).toLocaleDateString('en-US', {
                          timeZone: 'America/Los_Angeles',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          <select
                            value={contact.status}
                            onChange={(e) => handleStatusChange(contact.id, e.target.value as ContactStatus)}
                            className="p-2 border border-gray-300 rounded-md"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="REVIEWED">Reviewed</option>
                            <option value="ARCHIVED">Archived</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg text-xs transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'expenses' && (
          <ExpenseManagement />
        )}

        {activeTab === 'settlements' && (
          <SettlementCalculator refreshTrigger={settlementRefreshTrigger} />
        )}

        {activeTab === 'payments' && (
          <SettlementPayment 
            refreshTrigger={settlementRefreshTrigger} 
            onPaymentComplete={handlePaymentComplete} 
          />
        )}

        {activeTab === 'jobs' && (
          <JobManagement />
        )}

        {activeTab === 'users' && (
          <div className="mt-8">
            <UserManagement />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;