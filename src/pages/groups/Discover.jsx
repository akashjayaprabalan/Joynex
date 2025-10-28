import { useState, useEffect } from 'react';
import { Container, Card, Input, Button } from '@components/ui';
import { GroupCard, MembersModal } from '@components/groups';
import { getAvailableGroups, joinGroup } from '@services/groupService';
import { useAuth } from '@context/AuthContext';

const Discover = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const groupTypes = ['All', 'Poker', 'Sports', 'Study', 'Party', 'Gaming', 'Other'];

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data, error } = await getAvailableGroups();
      if (error) throw error;
      setGroups(data);
    } catch (error) {
      setError('Failed to load groups. Please try again.');
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const { error } = await joinGroup(groupId);
      if (error) throw error;
      // Remove group from list
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
    } catch (error) {
      console.error('Error joining group:', error);
      // Show error in the UI
    }
  };

  const handleViewMembers = (group) => {
    setSelectedGroup(group);
    setShowMembersModal(true);
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = searchTerm
      ? group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesType = selectedType && selectedType !== 'All'
      ? group.type === selectedType
      : true;

    return matchesSearch && matchesType;
  });

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {groupTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
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
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No groups found</p>
          <p className="mt-2 text-gray-500">
            {searchTerm || selectedType
              ? 'Try adjusting your filters'
              : 'Why not create one?'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onJoin={() => handleJoinGroup(group.id)}
              onViewMembers={() => handleViewMembers(group)}
              isOwner={group.created_by === user?.id}
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

export default Discover;
