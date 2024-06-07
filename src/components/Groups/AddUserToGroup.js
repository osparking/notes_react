import React, { useState } from 'react';
import api from '../../services/api';

const AddUserToGroup = ({ groupId, setGroup }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/groups/${groupId}/users/${username}`);
      setGroup(group => ({
        ...group,
        users: [...group.users, response.data]
      }));
      setUsername('');
    } catch (error) {
      console.error('Error adding user to group', error);
    }
  };

  return (
    <div>
      <h3>Add User to Group</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUserToGroup;
