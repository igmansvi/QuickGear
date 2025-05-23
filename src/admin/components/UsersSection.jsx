import React, { useState, useEffect } from "react";

const UsersSection = ({ users, loading, onViewDetails }) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (users.length) {
      filterUsers();
    }
  }, [users, searchTerm]);

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const term = searchTerm.toLowerCase();
    const result = users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );

    setFilteredUsers(result);
  };

  const resetFilters = () => {
    setSearchTerm("");
  };

  const userStats = {
    total: filteredUsers.length,
    active: filteredUsers.length,
    newUsers: Math.floor(filteredUsers.length * 0.3),
  };

  if (loading) {
    return <div className="text-center py-10">Loading users...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={filterUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600">Total Users</p>
          <p className="text-xl font-bold">{userStats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">Active Users</p>
          <p className="text-xl font-bold">{userStats.active}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600">New Users (This Month)</p>
          <p className="text-xl font-bold">{userStats.newUsers}</p>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Users</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border" id="user-table">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Phone</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="text-center hover:bg-gray-50">
                <td className="py-1 px-2 border">{user.id}</td>
                <td className="py-1 px-2 border">{user.full_name}</td>
                <td className="py-1 px-2 border">{user.email}</td>
                <td className="py-1 px-2 border">{user.phone || "N/A"}</td>
                <td className="py-1 px-2 border">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {user.role || "user"}
                  </span>
                </td>
                <td className="py-1 px-2 border">
                  <button
                    className="text-blue-600 hover:text-blue-800 mx-1"
                    onClick={() => onViewDetails(user)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersSection;
