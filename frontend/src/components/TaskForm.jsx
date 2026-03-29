import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    totalLicenses: '',
    purchaseDate: '',
    expiryDate: '',
    description: '',
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        name: editingTask.name || '',
        totalLicenses: editingTask.totalLicenses || '',
        purchaseDate: editingTask.purchaseDate ? editingTask.purchaseDate.split('T')[0] : '',
        expiryDate: editingTask.expiryDate ? editingTask.expiryDate.split('T')[0] : '',
        description: editingTask.description || '',
      });
    } else {
      setFormData({
        name: '',
        totalLicenses: '',
        purchaseDate: '',
        expiryDate: '',
        description: '',
      });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTask) {
        const response = await axiosInstance.put(`/api/licenses/${editingTask._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setTasks(
          tasks.map((task) => (task._id === response.data._id ? response.data : task))
        );
      } else {
        const response = await axiosInstance.post('/api/licenses', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setTasks([...tasks, response.data]);
      }

      setEditingTask(null);
      setFormData({
        name: '',
        totalLicenses: '',
        purchaseDate: '',
        expiryDate: '',
        description: '',
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save license.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingTask ? 'Edit License' : 'Add License'}
      </h1>

      <input
        type="text"
        placeholder="Software Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Total Licenses"
        value={formData.totalLicenses}
        onChange={(e) => setFormData({ ...formData, totalLicenses: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block mb-1 font-medium">Purchase Date</label>
      <input
        type="date"
        value={formData.purchaseDate}
        onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block mb-1 font-medium">Expiry Date</label>
      <input
        type="date"
        value={formData.expiryDate}
        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingTask ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default TaskForm;