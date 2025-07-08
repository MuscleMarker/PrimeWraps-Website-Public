import React, { useState } from 'react';
import axios from 'axios';

/**
 * UserManagement component for creating new users.
 * This component provides a form for administrators to create new users with specific roles.
 */
const UserManagement: React.FC = () => {
  // State for username, password, roles, and form messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState<string[]>(['USER']); // Default role is USER
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles changes to the user's roles.
   * Adds or removes a role from the roles array.
   * @param role - The role to add or remove.
   */
  const handleRoleChange = (role: string) => {
    setRoles(prevRoles => 
      prevRoles.includes(role) 
        ? prevRoles.filter(r => r !== role) // Remove role if it already exists
        : [...prevRoles, role] // Add role if it doesn't exist
    );
  };

  /**
   * Handles the form submission to create a new user.
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      // Get the JWT token from local storage
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        return;
      }

      // Send a POST request to the backend to create the user
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/users`,
        { username, password, roles },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Set success message and reset form fields
      setMessage(response.data.message || 'User created successfully!');
      setUsername('');
      setPassword('');
      setRoles(['USER']); // Reset roles to default
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response?.data?.message || 'Failed to create user.');
      } else if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred. Failed to create user.');
      } else {
        setError('An unknown error occurred. Failed to create user.');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 font-gwendolyn">Create New User</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Roles</span>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                value="USER"
                checked={roles.includes('USER')}
                onChange={() => handleRoleChange('USER')}
              />
              <span className="ml-2 text-gray-700">User</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                value="ADMIN"
                checked={roles.includes('ADMIN')}
                onChange={() => handleRoleChange('ADMIN')}
              />
              <span className="ml-2 text-gray-700">Admin</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="btn-primary w-full"
        >
          Create User
        </button>
        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default UserManagement;
