import { useEffect, useState } from 'react';
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

export default UserPage;