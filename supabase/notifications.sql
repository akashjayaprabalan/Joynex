-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_notification_type CHECK (
        type IN ('GROUP_JOIN', 'GROUP_UPDATE', 'GROUP_CANCEL')
    )
);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (auth.uid()::UUID = user_id);

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid()::UUID = user_id);

-- Functions for notification management
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type VARCHAR,
    p_data JSONB
) RETURNS notifications AS $$
DECLARE
    v_notification notifications;
BEGIN
    INSERT INTO notifications (user_id, type, data)
    VALUES (p_user_id, p_type, p_data)
    RETURNING * INTO v_notification;

    RETURN v_notification;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_as_read(
    p_user_id UUID,
    p_notification_ids UUID[] DEFAULT NULL
) RETURNS SETOF notifications AS $$
BEGIN
    IF p_notification_ids IS NULL THEN
        -- Mark all notifications as read
        RETURN QUERY
        UPDATE notifications
        SET read = true
        WHERE user_id = p_user_id AND read = false
        RETURNING *;
    ELSE
        -- Mark specific notifications as read
        RETURN QUERY
        UPDATE notifications
        SET read = true
        WHERE user_id = p_user_id
        AND id = ANY(p_notification_ids)
        AND read = false
        RETURNING *;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications() RETURNS void AS $$
BEGIN
    -- Delete notifications older than 30 days
    DELETE FROM notifications
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to clean up old notifications
SELECT cron.schedule(
    'cleanup-old-notifications',
    '0 0 * * *', -- Run at midnight every day
    'SELECT cleanup_old_notifications()'
);
