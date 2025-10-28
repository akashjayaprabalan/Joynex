import { supabase } from '@config/supabase';

// Create a new group
export const createGroup = async ({
  name,
  type,
  description,
  date,
  timeSlot,
  location,
  locationLink,
  contactMethod,
  contactInfo,
  maxMembers,
}) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Create group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert([
        {
          name,
          type,
          description,
          date,
          time_slot: timeSlot,
          location,
          location_link: locationLink,
          contact_method: contactMethod,
          contact_info: contactInfo,
          max_members: maxMembers,
          current_members: 1,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (groupError) throw groupError;

    // Add creator as first member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert([
        {
          group_id: group.id,
          user_id: user.id,
        },
      ]);

    if (memberError) throw memberError;

    return { data: group, error: null };
  } catch (error) {
    console.error('Error in createGroup:', error);
    return { error };
  }
};

// Get all available groups (not joined by current user)
export const getAvailableGroups = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Get groups not joined by current user
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        created_by:users!groups_created_by_fkey(full_name),
        members:group_members(user_id)
      `)
      .not('members.user_id', 'eq', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error in getAvailableGroups:', error);
    return { error };
  }
};

// Get user's joined groups
export const getJoinedGroups = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        created_by:users!groups_created_by_fkey(full_name),
        members:group_members(user_id)
      `)
      .eq('members.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error in getJoinedGroups:', error);
    return { error };
  }
};

// Get user's created groups
export const getCreatedGroups = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        created_by:users!groups_created_by_fkey(full_name),
        members:group_members(user_id, users(full_name))
      `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error in getCreatedGroups:', error);
    return { error };
  }
};

// Join a group
export const joinGroup = async (groupId) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.rpc('join_group', {
      group_id: groupId,
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error in joinGroup:', error);
    return { error };
  }
};

// Leave a group
export const leaveGroup = async (groupId) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.rpc('leave_group', {
      group_id: groupId,
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error in leaveGroup:', error);
    return { error };
  }
};

// Get group members
export const getGroupMembers = async (groupId) => {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        user:users(full_name)
      `)
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error in getGroupMembers:', error);
    return { error };
  }
};

// Subscribe to group updates
export const subscribeToGroup = (groupId, callback) => {
  return supabase
    .channel(`group:${groupId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'groups',
        filter: `id=eq.${groupId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();
};

// Subscribe to group members updates
export const subscribeToGroupMembers = (groupId, callback) => {
  return supabase
    .channel(`group_members:${groupId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'group_members',
        filter: `group_id=eq.${groupId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();
};
