import { Button, Card } from '@components/ui';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const GroupCard = ({
  group,
  onJoin,
  onLeave,
  onViewMembers,
  isOwner,
  isMember,
}) => {
  const {
    name,
    type,
    description,
    date,
    timeSlot,
    location,
    locationLink,
    contactMethod,
    contactInfo,
    currentMembers,
    maxMembers,
  } = group;

  const isFull = currentMembers >= maxMembers;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">{name}</h3>
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {type}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users size={18} className="mr-1" />
            <span>{currentMembers}/{maxMembers}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar size={18} className="mr-2" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock size={18} className="mr-2" />
            <span>{timeSlot}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin size={18} className="mr-2" />
            <a
              href={locationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {location}
            </a>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-gray-600">Contact via:</span>
              <div className="font-medium">
                {contactMethod}: {contactInfo}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {isOwner ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={onViewMembers}
                >
                  View Members
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Edit Group
                </Button>
              </>
            ) : isMember ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onLeave}
              >
                Leave Group
              </Button>
            ) : (
              <Button
                variant={isFull ? 'ghost' : 'primary'}
                size="sm"
                className="flex-1"
                disabled={isFull}
                onClick={onJoin}
              >
                {isFull ? 'Group Full' : 'Join Group'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GroupCard;
