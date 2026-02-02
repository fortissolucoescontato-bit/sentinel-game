-- Migration: Remove obsolete isCracked column
-- The isCracked field is no longer used after implementing the unlocked_safes table
-- Individual unlock tracking is now done via the unlocked_safes join table

ALTER TABLE safes DROP COLUMN IF EXISTS is_cracked;
