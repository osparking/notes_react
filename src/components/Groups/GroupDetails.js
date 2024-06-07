import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import AddUserToGroup from './AddUserToGroup';

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await api.get(`/groups/${groupId}`);
        setGroup(response.data);
      } catch (error) {
        console.error('Error fetching group details', error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleRemoveUser = async (userId) => {
    try {
      await api.delete(`/groups/${groupId}/users/${userId}`);
      setGroup({
        ...group,
        users: group.users.filter(user => user.id !== userId)
      });
    } catch (error) {
      console.error('Error removing user from group', error);
    }
  };

  if (!group) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{group.name}</h2>
      <h3>Members</h3>
      <ul>
        {group.users.map(user => (
          <li key={user.id}>
            {user.username}
            <button onClick={() => handleRemoveUser(user.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <AddUserToGroup groupId={groupId} setGroup={setGroup} />
    </div>
  );
};

export default GroupDetails;
