-- Migration: Add session-based attendance tracking
-- This migration adds new fields to support morning/afternoon in/out functionality

-- Add new columns to attendance table
ALTER TABLE attendance 
ADD COLUMN IF NOT EXISTS session_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS session_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create enum type for session types
DO $$ BEGIN
    CREATE TYPE "SessionType" AS ENUM ('MORNING_IN', 'MORNING_OUT', 'AFTERNOON_IN', 'AFTERNOON_OUT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the session_type column to use the enum
ALTER TABLE attendance 
ALTER COLUMN session_type TYPE "SessionType" USING session_type::"SessionType";

-- Set default values for existing records
UPDATE attendance 
SET 
    session_type = 'MORNING_IN',
    session_date = DATE(timestamp),
    notes = 'Migrated from old system'
WHERE session_type IS NULL;

-- Make session_type and session_date NOT NULL after setting defaults
ALTER TABLE attendance 
ALTER COLUMN session_type SET NOT NULL,
ALTER COLUMN session_date SET NOT NULL;

-- Add unique constraint to prevent duplicate entries for same session
ALTER TABLE attendance 
ADD CONSTRAINT attendance_unique_session 
UNIQUE (student_id, session_type, session_date);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_session_date ON attendance(session_date);
CREATE INDEX IF NOT EXISTS idx_attendance_session_type ON attendance(session_type);
CREATE INDEX IF NOT EXISTS idx_attendance_student_session ON attendance(student_id, session_type, session_date);

-- Add comments for documentation
COMMENT ON COLUMN attendance.session_type IS 'Type of attendance session (MORNING_IN, MORNING_OUT, AFTERNOON_IN, AFTERNOON_OUT)';
COMMENT ON COLUMN attendance.session_date IS 'Date of the session (date part only)';
COMMENT ON COLUMN attendance.notes IS 'Optional notes about the attendance record';
COMMENT ON COLUMN attendance.timestamp IS 'Exact timestamp when attendance was recorded';
