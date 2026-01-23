-- Add new columns for enhanced purchase requests
-- Run this SQL in Supabase SQL Editor

ALTER TABLE purchase_requests 
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS invoice_type VARCHAR(20) DEFAULT 'individual',
ADD COLUMN IF NOT EXISTS tc_no VARCHAR(11),
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS tax_office VARCHAR(100),
ADD COLUMN IF NOT EXISTS tax_no VARCHAR(50);
