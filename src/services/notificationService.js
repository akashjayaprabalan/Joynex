import { supabase } from '@config/supabase';

/**
 * Create a notification
 * @param {string} userId - User ID
 * @param {string} type - Notification type
 * @param {Object} data - Notification data
 * @returns {Promise} Supabase response
 */
export const createNotification = async (userId, type, data) => {
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          type,
          data,
          read: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data: notification, error: null };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { data: null, error };
  }
};

/**
 * Get user notifications
 * @param {string} userId - User ID
 * @param {boolean} unreadOnly - Get only unread notifications
 * @returns {Promise} Supabase response
 */
export const getNotifications = async (userId, unreadOnly = false) => {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return { data: null, error };
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise} Supabase response
 */
export const markAsRead = async (notificationId) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { data: null, error };
  }
};

/**
 * Mark all notifications as read
 * @param {string} userId - User ID
 * @returns {Promise} Supabase response
 */
export const markAllAsRead = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { data: null, error };
  }
};

/**
 * Subscribe to notifications
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function
 * @returns {Object} Supabase subscription
 */
export const subscribeToNotifications = (userId, callback) => {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe();
};

/**
 * Create group join notification
 * @param {string} userId - User ID
 * @param {Object} group - Group details
 * @returns {Promise} Notification response
 */
export const createGroupJoinNotification = async (userId, group) => {
  return createNotification(userId, 'GROUP_JOIN', {
    groupId: group.id,
    groupName: group.name,
    date: group.date,
    timeSlot: group.timeSlot,
  });
};

/**
 * Create group update notification
 * @param {string} userId - User ID
 * @param {Object} group - Group details
 * @returns {Promise} Notification response
 */
export const createGroupUpdateNotification = async (userId, group) => {
  return createNotification(userId, 'GROUP_UPDATE', {
    groupId: group.id,
    groupName: group.name,
    date: group.date,
    timeSlot: group.timeSlot,
  });
};

/**
 * Create group cancel notification
 * @param {string} userId - User ID
 * @param {Object} group - Group details
 * @returns {Promise} Notification response
 */
export const createGroupCancelNotification = async (userId, group) => {
  return createNotification(userId, 'GROUP_CANCEL', {
    groupId: group.id,
    groupName: group.name,
  });
};
