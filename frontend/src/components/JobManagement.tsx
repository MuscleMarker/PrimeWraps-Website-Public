import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface User {
  id: number;
  username: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
  totalRevenue: number | null;
  totalExpenses: number | null;
  profitMargin: number | null;
  clientName: string | null;
  location: string | null;
  teamMembers: User[];
  createdAt: string;
}

const JobForm: React.FC<{ 
    onSubmit: () => void, 
    onCancel: () => void, 
    job: Job | null, 
    isEdit: boolean, 
    users: User[] 
}> = ({ onSubmit, onCancel, job, isEdit, users }) => {
    const [formData, setFormData] = useState({
        title: job?.title || '',
        description: job?.description || '',
        clientName: job?.clientName || '',
        location: job?.location || '',
        startDate: job?.startDate ? format(new Date(job.startDate), 'yyyy-MM-dd' + 'T' + 'HH:mm') : '',
        endDate: job?.endDate ? format(new Date(job.endDate), 'yyyy-MM-dd' + 'T' + 'HH:mm') : '',
        teamMemberIds: job?.teamMembers.map(m => m.id) || []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData(prev => ({ ...prev, teamMemberIds: selectedIds }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const url = isEdit ? `${import.meta.env.VITE_API_URL}/jobs/${job?.id}` : `${import.meta.env.VITE_API_URL}/jobs`;
        const method = isEdit ? 'put' : 'post';

        try {
            await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSubmit();
        } catch (error) {
            console.error('Failed to save job', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {isEdit ? 'Edit Job' : 'Add New Job'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
                    <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Client Name" className="w-full p-2 border rounded" />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" />
                    <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 border rounded" />
                    <select multiple name="teamMemberIds" value={formData.teamMemberIds.map(String)} onChange={handleMultiSelectChange} className="w-full p-2 border rounded">
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Save Job</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const JobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = ['ALL', 'PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      
      // Fetch jobs
      const jobsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobsResponse.data);

      // Fetch users
      const usersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersResponse.data);

      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`${import.meta.env.VITE_API_URL}/jobs/${id}/status?status=${newStatus}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update job status');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingJob(null);
    fetchData();
  };

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filterStatus === 'ALL' || job.status === filterStatus;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.clientName && job.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const totalRevenue = filteredJobs.reduce((sum, job) => sum + (job.totalRevenue || 0), 0);
  const totalExpenses = filteredJobs.reduce((sum, job) => sum + (job.totalExpenses || 0), 0);
  const totalProfit = filteredJobs.reduce((sum, job) => sum + (job.profitMargin || 0), 0);
  const activeJobs = filteredJobs.filter(job => job.status === 'IN_PROGRESS').length;

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 font-gwendolyn">Job Management</h2>
        <button
          onClick={() => {
            setEditingJob(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Add Job
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-800">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-600">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-800">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">Total Profit</h3>
          <p className="text-2xl font-bold text-green-800">${totalProfit.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">Active Jobs</h3>
          <p className="text-2xl font-bold text-yellow-800">{activeJobs}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
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
                {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setFilterStatus('ALL');
              setSearchTerm('');
            }}
            className="w-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Job</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Client</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Dates</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Team</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Financial</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No jobs found matching the current filters.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div>
                      <div className="font-medium">{job.title}</div>
                      {job.description && (
                        <div className="text-xs text-gray-500 mt-1">{job.description}</div>
                      )}
                      {job.location && (
                        <div className="text-xs text-blue-600 mt-1">📍 {job.location}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {job.clientName || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div>
                      <div>Start: {new Date(job.startDate).toLocaleDateString('en-US', {
                        timeZone: 'America/Los_Angeles',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</div>
                      {job.endDate && (
                        <div>End: {new Date(job.endDate).toLocaleDateString('en-US', {
                          timeZone: 'America/Los_Angeles',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {job.teamMembers.length > 0 ? (
                      <div className="space-y-1">
                        {job.teamMembers.slice(0, 3).map(member => (
                          <div key={member.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {member.username}
                          </div>
                        ))}
                        {job.teamMembers.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{job.teamMembers.length - 3} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">No team assigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="space-y-1">
                      {job.totalRevenue && (
                        <div className="text-green-600">Revenue: ${job.totalRevenue.toFixed(2)}</div>
                      )}
                      {job.totalExpenses && (
                        <div className="text-red-600">Expenses: ${job.totalExpenses.toFixed(2)}</div>
                      )}
                      {job.profitMargin && (
                        <div className={`font-semibold ${job.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Profit: ${job.profitMargin.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      className="p-1 border border-gray-300 rounded text-xs"
                    >
                      <option value="PLANNING">Planning</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingJob(job);
                          setShowForm(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
          <JobForm 
            onSubmit={handleFormSubmit} 
            onCancel={() => {
                setShowForm(false);
                setEditingJob(null);
            }} 
            job={editingJob} 
            isEdit={!!editingJob} 
            users={users} 
          />
      )}
    </div>
  );
};

export default JobManagement;
