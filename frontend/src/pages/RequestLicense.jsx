import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const RequestLicense = () => {
  const { user } = useAuth();

  const [licenses, setLicenses] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [formData, setFormData] = useState({
    licenseId: '',
    reason: '',
    requestType: 'normal',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const licenseResponse = await axiosInstance.get('/api/licenses', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const requestResponse = await axiosInstance.get('/api/license-requests/my-requests', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setLicenses(licenseResponse.data);
        setMyRequests(requestResponse.data);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load request data');
      }
    };

    if (user?.token) {
      fetchData();
    }
  }, [user]);

  const handleSubmit = async (e) => {
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

      const requestResponse = await axiosInstance.get('/api/license-requests/my-requests', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setMyRequests(requestResponse.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit request');
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'user') return <Navigate to="/tasks" />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Request License</h1>

      <div className="bg-white p-6 shadow rounded mb-6">
        <h2 className="text-xl font-bold mb-4">Submit a License Request</h2>

        <form onSubmit={handleSubmit}>
          <select
            value={formData.licenseId}
            onChange={(e) => setFormData({ ...formData, licenseId: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Select License</option>
            {licenses.map((license) => (
              <option key={license._id} value={license._id}>
                {license.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Reason for requesting this license"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            rows="4"
          />

          <select
            value={formData.requestType}
            onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
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

      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold mb-4">My Requests</h2>

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
                  <td className="border p-2">{request.licenseId?.name || 'N/A'}</td>
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

export default RequestLicense;