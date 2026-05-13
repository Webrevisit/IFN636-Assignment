/*import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const UserPage = () => {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    const fetchMyLicenses = async () => {
      try {
        const response = await axiosInstance.get('/api/licenses/my-licenses', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLicenses(response.data);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load assigned licenses');
      }
    };

    if (user?.token) {
      fetchMyLicenses();
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'user') return <Navigate to="/tasks" />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Assigned Licenses</h1>

      {licenses.length === 0 ? (
        <p>No licenses assigned.</p>
      ) : (
        <div className="grid gap-4">
          {licenses.map((license) => (
            <div key={license._id} className="bg-gray-100 p-4 rounded shadow">
              <h2 className="text-xl font-bold">{license.name}</h2>
              <p>
                <strong>Expiry Date:</strong>{' '}
                {license.expiryDate
                  ? new Date(license.expiryDate).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p><strong>Description:</strong> {license.description || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPage;*/

import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const UserPage = () => {
  const { user } = useAuth();

  const [myLicenses, setMyLicenses] = useState([]);
  const [allLicenses, setAllLicenses] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  const [formData, setFormData] = useState({
    licenseId: '',
    reason: '',
    requestType: 'normal',
  });

  const fetchMyLicenses = async () => {
    const response = await axiosInstance.get('/api/licenses/my-licenses', {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setMyLicenses(response.data);
  };

  const fetchAllLicenses = async () => {
    const response = await axiosInstance.get('/api/licenses', {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setAllLicenses(response.data);
  };

  const fetchMyRequests = async () => {
    const response = await axiosInstance.get('/api/license-requests/my-requests', {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setMyRequests(response.data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchMyLicenses();
        await fetchAllLicenses();
        await fetchMyRequests();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load user dashboard data');
      }
    };

    if (user?.token) {
      loadData();
    }
  }, [user]);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!formData.licenseId || !formData.reason) {
      alert('Please select a license and enter a reason.');
      return;
    }

    try {
      await axiosInstance.post('/api/license-requests', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert('License request submitted successfully.');

      setFormData({
        licenseId: '',
        reason: '',
        requestType: 'normal',
      });

      await fetchMyRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit request.');
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'user') return <Navigate to="/tasks" />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

      <div className="bg-white p-6 shadow rounded mb-6">
        <h2 className="text-xl font-bold mb-4">Request a License</h2>

        <form onSubmit={handleSubmitRequest}>
          <select
            value={formData.licenseId}
            onChange={(e) =>
              setFormData({ ...formData, licenseId: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Select License</option>
            {allLicenses.map((license) => (
              <option key={license._id} value={license._id}>
                {license.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Reason for requesting this license"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
          />

          <select
            value={formData.requestType}
            onChange={(e) =>
              setFormData({ ...formData, requestType: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="normal">Normal Request</option>
            <option value="urgent">Urgent Request</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Request
          </button>
        </form>
      </div>

      <div className="bg-white p-6 shadow rounded mb-6">
        <h2 className="text-xl font-bold mb-4">My Assigned Licenses</h2>

        {myLicenses.length === 0 ? (
          <p>No licenses assigned.</p>
        ) : (
          <div className="grid gap-4">
            {myLicenses.map((license) => (
              <div key={license._id} className="bg-gray-100 p-4 rounded shadow">
                <h3 className="text-lg font-bold">{license.name}</h3>
                <p><strong>Description:</strong> {license.description || 'N/A'}</p>
                <p>
                  <strong>Purchase Date:</strong>{' '}
                  {license.purchaseDate
                    ? new Date(license.purchaseDate).toLocaleDateString()
                    : 'N/A'}
                </p>
                <p>
                  <strong>Expiry Date:</strong>{' '}
                  {license.expiryDate
                    ? new Date(license.expiryDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold mb-4">My License Requests</h2>

        {myRequests.length === 0 ? (
          <p>No requests submitted.</p>
        ) : (
          <table className="w-full border border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">License</th>
                <th className="border p-2">Reason</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Priority</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((request) => (
                <tr key={request._id}>
                  <td className="border p-2">
                    {request.licenseId?.name || 'N/A'}
                  </td>
                  <td className="border p-2">{request.reason}</td>
                  <td className="border p-2">{request.requestType}</td>
                  <td className="border p-2">{request.priority}</td>
                  <td className="border p-2">{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserPage;