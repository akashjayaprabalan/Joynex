import { X } from 'lucide-react';
import { Button } from '@components/ui';

const MembersModal = ({ isOpen, onClose, members = [], groupName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">
            Members of {groupName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {members.length === 0 ? (
            <p className="text-gray-500 text-center">No members yet</p>
          ) : (
            <ul className="space-y-2">
              {members.map((member, index) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium">{member.fullName}</p>
                    {index === 0 && (
                      <span className="text-sm text-blue-600">Group Owner</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-6 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MembersModal;
