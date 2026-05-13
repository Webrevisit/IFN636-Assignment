import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/api/license-requests', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setRequests(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load license requests');
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleApprove = async (requestId) => {
    try {
      await axiosInstance.put(
        `/api/license-requests/${requestId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      alert('Request approved successfully.');
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axiosInstance.put(
        `/api/license-requests/${requestId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      alert('Request rejected successfully.');
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject request');
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/user" />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">License Requests</h1>

      {requests.length === 0 ? (
        <p>No license requests found.</p>
      ) : (
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">License</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Priority</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td className="border p-2">{request.userId?.name || 'N/A'}</td>
                <td className="border p-2">{request.userId?.email || 'N/A'}</td>
                <td className="border p-2">{request.licenseId?.name || 'N/A'}</td>
                <td className="border p-2">{request.reason}</td>
                <td className="border p-2">{request.requestType}</td>
                <td className="border p-2">{request.priority}</td>
                <td className="border p-2">{request.status}</td>

                <td className="border p-2">
                  {request.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(request._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(request._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminRequests;