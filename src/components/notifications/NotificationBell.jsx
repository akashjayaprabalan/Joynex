import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { getNotifications, markAsRead, subscribeToNotifications } from '@services/notificationService';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const subscription = subscribeToNotifications(user.id, (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data } = await getNotifications(user.id, true);
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationContent = (notification) => {
    const { type, data } = notification;

    switch (type) {
      case 'GROUP_JOIN':
        return \`You've joined "\${data.groupName}" on \${new Date(
          data.date
        ).toLocaleDateString()} at \${data.timeSlot}\`;

      case 'GROUP_UPDATE':
        return \`"\${data.groupName}" has been updated\`;

      case 'GROUP_CANCEL':
        return \`"\${data.groupName}" has been cancelled\`;

      default:
        return 'New notification';
    }
  };

  return (
    <div className="relative">
      <button
        className="p-2 rounded-full hover:bg-gray-100 relative"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No new notifications
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <p className="text-sm text-gray-800">
                      {getNotificationContent(notification)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
