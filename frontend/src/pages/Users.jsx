import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Users = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(response.data);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load users');
      }
    };

    const fetchLicenses = async () => {
      try {
        const response = await axiosInstance.get('/api/licenses', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLicenses(response.data);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load licenses');
      }
    };

    if (user?.token) {
      fetchUsers();
      fetchLicenses();
    }
  }, [user]);

  const handleAssignClick = (selectedUserData) => {
    setSelectedUser(selectedUserData);
    setSelectedLicense('');
  };

  const handleAssignSubmit = async () => {
    if (!selectedLicense || !selectedUser) {
      alert('Please select a license');
      return;
    }

    try {
      await axiosInstance.put(
        `/api/licenses/${selectedLicense}/assign`,
        { assignedTo: selectedUser._id },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      alert(`License assigned to ${selectedUser.name}`);

      const response = await axiosInstance.get('/api/licenses', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setLicenses(response.data);

      setSelectedUser(null);
      setSelectedLicense('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to assign license');
    }
  };

  const getAssignedLicenses = (userId) => {
  return licenses.filter(
    (license) =>
      license.assignedTo &&
      license.assignedTo.some(
        (u) => String(u) === String(userId)
      )
  );
  };
  const handleRemoveLicense = async (licenseId, userId) => {
  try {
    await axiosInstance.put(
      `/api/licenses/${licenseId}/remove-assignment`,
      { userId },
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    const response = await axiosInstance.get('/api/licenses', {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setLicenses(response.data);
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to remove assigned license');
  }
};

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/user" />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Assigned Licenses</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => {
            const assignedLicenses = getAssignedLicenses(item._id);

            return (
              <tr key={item._id}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.email}</td>
                <td className="border p-2">{item.role}</td>

                <td className="border p-2">
                  {assignedLicenses.length === 0 ? (
                    <span>No license assigned</span>
                  ) : (
                    <ul className="space-y-2">
                      {assignedLicenses.map((license) => (
                        <li key={license._id} className="flex items-center gap-2">
                          <span>{license.name}</span>
                          <button
                            onClick={() => handleRemoveLicense(license._id, item._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>

                <td className="border p-2">
                  <button
                    onClick={() => handleAssignClick(item)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Assign License
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedUser && (
        <div className="mt-6 bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-3">
            Assign License to {selectedUser.name}
          </h2>

          <select
            value={selectedLicense}
            onChange={(e) => setSelectedLicense(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Select a license</option>
            {licenses.map((license) => (
              <option key={license._id} value={license._id}>
                {license.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAssignSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Confirm Assign
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;