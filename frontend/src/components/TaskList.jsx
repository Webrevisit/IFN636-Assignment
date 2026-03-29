import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskList = ({ tasks = [], setTasks, setEditingTask }) => {
  const { user } = useAuth();

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/licenses/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setTasks((prev = []) => prev.filter((item) => item._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete license.');
    }
  };

  if (!Array.isArray(tasks)) {
    return <div>No licenses found.</div>;
  }

  return (
    <div>
      {tasks.map((item) => (
        <div key={item._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold text-lg">{item.name}</h2>

          <p><strong>Total Licenses:</strong> {item.totalLicenses}</p>

          <p className="text-sm text-gray-600">
            <strong>Purchase Date:</strong>{' '}
            {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}
          </p>

          <p className="text-sm text-gray-600">
            <strong>Expiry Date:</strong>{' '}
            {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
          </p>

          <p className="mt-2">{item.description}</p>

          <div className="mt-3">
            <button
              onClick={() => setEditingTask(item)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;