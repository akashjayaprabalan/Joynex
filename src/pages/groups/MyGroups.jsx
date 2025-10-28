import { useState, useEffect } from 'react';
import { Container, Card, Button } from '@components/ui';
import { GroupCard, MembersModal } from '@components/groups';
import { getJoinedGroups, getCreatedGroups, leaveGroup } from '@services/groupService';
import { useAuth } from '@context/AuthContext';

const MyGroups = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('joined'); // joined or created
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [activeTab]);

  const fetchGroups = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await (activeTab === 'joined'
        ? getJoinedGroups()
        : getCreatedGroups());

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Failed to load groups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const { error } = await leaveGroup(groupId);
      if (error) throw error;
      // Remove group from list
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
    } catch (error) {
      console.error('Error leaving group:', error);
      // Show error in the UI
    }
  };

  const handleViewMembers = (group) => {
    setSelectedGroup(group);
    setShowMembersModal(true);
  };

  return (
    <Container className="py-8">
      <div className="flex gap-4 mb-8">
        <Button
          variant={activeTab === 'joined' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('joined')}
        >
          Groups I've Joined
        </Button>
        <Button
          variant={activeTab === 'created' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('created')}
        >
          Groups I've Created
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            {activeTab === 'joined'
              ? "You haven't joined any groups yet"
              : "You haven't created any groups yet"}
          </p>
          <p className="mt-2 text-gray-500">
            {activeTab === 'joined'
              ? 'Check out the Discover page to find groups to join!'
              : 'Why not create a new group?'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onLeave={
                activeTab === 'joined'
                  ? () => handleLeaveGroup(group.id)
                  : undefined
              }
              onViewMembers={() => handleViewMembers(group)}
              isOwner={group.created_by === user?.id}
              isMember={true}
            />
          ))}
        </div>
      )}

      <MembersModal
        isOpen={showMembersModal}
        onClose={() => {
          setShowMembersModal(false);
          setSelectedGroup(null);
        }}
        groupName={selectedGroup?.name}
        members={selectedGroup?.members}
      />
    </Container>
  );
};

export default MyGroups;
