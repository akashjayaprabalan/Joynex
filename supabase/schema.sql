-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    verification_status BOOLEAN DEFAULT FALSE,
    failed_attempts INTEGER DEFAULT 0,
    last_failed_attempt TIMESTAMP WITH TIME ZONE,
    email_blocked_until TIMESTAMP WITH TIME ZONE,
    CONSTRAINT email_domain CHECK (
        email LIKE '%@unimelb.edu.au' OR 
        email LIKE '%@student.unimelb.edu.au'
    )
);

-- Verification codes table
CREATE TABLE verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) + INTERVAL '15 minutes',
    attempts INTEGER DEFAULT 0,
    used BOOLEAN DEFAULT FALSE
);

-- Groups table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time_slot TIME NOT NULL,
    location TEXT NOT NULL,
    location_link TEXT NOT NULL,
    contact_method VARCHAR(50) NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    max_members INTEGER NOT NULL,
    current_members INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_group_type CHECK (
        type IN ('Poker', 'Sports', 'Study', 'Party', 'Gaming', 'Other')
    ),
    CONSTRAINT valid_contact_method CHECK (
        contact_method IN ('Instagram', 'WhatsApp', 'WeChat', 'Phone')
    ),
    CONSTRAINT valid_members CHECK (
        current_members <= max_members AND
        current_members >= 1
    )
);

-- Group members table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(group_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_groups_type ON groups(type);
CREATE INDEX idx_groups_date ON groups(date);
CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_group ON group_members(group_id);

-- Row Level Security Policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Groups table policies
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read groups" ON groups
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create groups" ON groups
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Group owners can update their groups" ON groups
    FOR UPDATE USING (auth.uid()::UUID = created_by);

CREATE POLICY "Group owners can delete their groups" ON groups
    FOR DELETE USING (auth.uid()::UUID = created_by);

-- Group members table policies
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read group members" ON group_members
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join groups" ON group_members
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        user_id = auth.uid()::UUID
    );

CREATE POLICY "Users can leave groups" ON group_members
    FOR DELETE USING (
        user_id = auth.uid()::UUID
    );

-- Functions

-- Function to check if email is blocked
CREATE OR REPLACE FUNCTION is_email_blocked(email_address TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE email = email_address
        AND email_blocked_until > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment failed attempts
CREATE OR REPLACE FUNCTION increment_failed_attempts(email_address TEXT)
RETURNS void AS $$
BEGIN
    UPDATE users
    SET 
        failed_attempts = failed_attempts + 1,
        last_failed_attempt = NOW(),
        email_blocked_until = CASE 
            WHEN failed_attempts >= 2 THEN NOW() + INTERVAL '24 hours'
            ELSE NULL
        END
    WHERE email = email_address;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to join a group
CREATE OR REPLACE FUNCTION join_group(group_id UUID)
RETURNS void AS $$
BEGIN
    -- Check if group is full
    IF EXISTS (
        SELECT 1 FROM groups
        WHERE id = group_id
        AND current_members >= max_members
    ) THEN
        RAISE EXCEPTION 'Group is full';
    END IF;

    -- Insert member
    INSERT INTO group_members (group_id, user_id)
    VALUES (group_id, auth.uid()::UUID);

    -- Update member count
    UPDATE groups
    SET current_members = current_members + 1
    WHERE id = group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to leave a group
CREATE OR REPLACE FUNCTION leave_group(group_id UUID)
RETURNS void AS $$
BEGIN
    -- Check if user is group creator
    IF EXISTS (
        SELECT 1 FROM groups
        WHERE id = group_id
        AND created_by = auth.uid()::UUID
    ) THEN
        RAISE EXCEPTION 'Group creator cannot leave the group';
    END IF;

    -- Remove member
    DELETE FROM group_members
    WHERE group_id = group_id
    AND user_id = auth.uid()::UUID;

    -- Update member count
    UPDATE groups
    SET current_members = current_members - 1
    WHERE id = group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_groups_updated_at
    BEFORE UPDATE ON groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Prevent deleting the last member trigger
CREATE OR REPLACE FUNCTION prevent_delete_last_member()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT current_members FROM groups WHERE id = OLD.group_id) <= 1 THEN
        RAISE EXCEPTION 'Cannot remove the last member from a group';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_delete_last_member_trigger
    BEFORE DELETE ON group_members
    FOR EACH ROW
    EXECUTE FUNCTION prevent_delete_last_member();
