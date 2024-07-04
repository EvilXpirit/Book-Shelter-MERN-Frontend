import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    isAdmin: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/users');
        setUsers(response.data);
        console.log('Fetched users:', response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser(user._id);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      isAdmin: user.isAdmin,
    });
    console.log('Editing user:', user);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      console.log('Deleted user with ID:', userId);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    console.log('User ID for update:', editUser);
    try {
      const response = await axios.put(`http://localhost:3000/api/admin/users/${editUser}`, formData);
      console.log('Update response:', response.data);
      setUsers(users.map(user => (user._id === editUser ? response.data : user)));
      setEditUser(null);
      setFormData({
        username: '',
        fullName: '',
        email: '',
        mobileNumber: '',
        isAdmin: false,
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-28">
      <h1 className="text-3xl text-white text-center font-bold mb-4">Admin Dashboard</h1>
      <table className="min-w-full bg-white/75 border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Full Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Mobile Number</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Login Date</th>
            <th className="border border-gray-300 px-4 py-2">Login Time</th>
            <th className="border border-gray-300 px-4 py-2">Logout Date</th>
            <th className="border border-gray-300 px-4 py-2">Logout Time</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border border-gray-300 px-4 py-2">{user.username}</td>
              <td className="border border-gray-300 px-4 py-2">{user.fullName}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.mobileNumber}</td>
              <td className="border border-gray-300 px-4 py-2">{user.isAdmin ? 'Admin' : 'User'}</td>
              <td className="border border-gray-300 px-4 py-2">{user.loginTimes.map(time => new Date(time).toLocaleDateString()).join(', ')}</td>
              <td className="border border-gray-300 px-4 py-2">{user.loginTimes.map(time => new Date(time).toLocaleTimeString()).join(', ')}</td>
              <td className="border border-gray-300 px-4 py-2">{user.logoutTimes.map(time => new Date(time).toLocaleDateString()).join(', ')}</td>
              <td className="border border-gray-300 px-4 py-2">{user.logoutTimes.map(time => new Date(time).toLocaleTimeString()).join(', ')}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button onClick={() => handleEdit(user)} className="mr-2">Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <form onSubmit={handleSubmit} className="bg-white/75 p-4 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Edit User</h2>
          <div className="mb-4">
            <label className="block mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Admin</label>
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Save</button>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;
