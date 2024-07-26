import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAPI from '../services/api';

const TaskStatus = {
  NOT_COMPLETED: 'Not Completed',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

const Vendor = () => {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState('');
  const [vendor, setVendor] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      navigate('/login');
    } else {
      setLoggedInUser(user);
      fetchVendorProfile();
    }
  }, [navigate]);

  const fetchVendorProfile = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.get('/user/vendor/profile');
      console.log('API response:', response.data);
      
      if (response.data.vendor) {
        setVendor(response.data.vendor);
        setClients(response.data.clients || []);
      } else {
        throw new Error('No vendor data in response');
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (clientId, newStatus) => {
    try {
      await adminAPI.put(`/user/vendor/client/${clientId}/status`, { status: newStatus });
      setClients(prevClients =>
        prevClients.map(client =>
          client._id === clientId ? { ...client, status: newStatus } : client
        )
      );
    } catch (error) {
      console.error('Error updating client status:', error);
      setError('Failed to update client status');
    }
  };

  const handleNoteChange = async (clientId, newNote) => {
    try {
      await adminAPI.put(`/user/vendor/client/${clientId}/note`, { note: newNote });
      setClients(prevClients =>
        prevClients.map(client =>
          client._id === clientId ? { ...client, note: newNote } : client
        )
      );
    } catch (error) {
      console.error('Error updating client note:', error);
      setError('Failed to update client note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!vendor) {
    return <div className="p-4">No vendor data available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome {loggedInUser}</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300"
        >
          Logout
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-4">{vendor.name}'s Dashboard</h2>
      <div className="space-y-4">
        {clients.map(client => (
          <div key={client._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{client.name}</h3>
            <p className="text-gray-600 mb-2">{client.details}</p>
            <div className="flex flex-col sm:flex-row sm:items-center mb-2">
              <label htmlFor={`status-${client._id}`} className="mr-2 mb-1 sm:mb-0">Status:</label>
              <select
                id={`status-${client._id}`}
                value={client.status}
                onChange={(e) => handleStatusChange(client._id, e.target.value)}
                className="border rounded p-1"
              >
                {Object.values(TaskStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="mt-2">
              <label htmlFor={`note-${client._id}`} className="block mb-1">Note:</label>
              <textarea
                id={`note-${client._id}`}
                value={client.note}
                onChange={(e) => handleNoteChange(client._id, e.target.value)}
                className="w-full border rounded p-2"
                rows="3"
                placeholder="Add a note..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vendor;