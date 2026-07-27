-- SQL Migration Script to Restrict Financial & Admin Tables in Supabase PostgreSQL

-- 1. Enable Row Level Security (RLS) on Financial & Tables
ALTER TABLE IF EXISTS public.financial_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.financial_transaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_todo ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing permissive public policies if any
DROP POLICY IF EXISTS "Allow public read access for financial_telemetry" ON public.financial_telemetry;
DROP POLICY IF EXISTS "Allow public read access for financial_transaction" ON public.financial_transaction;
DROP POLICY IF EXISTS "Allow public read access for admin_todo" ON public.admin_todo;

-- 3. Create Restricted RLS Policies (RESTRICTED ACCESS)
-- Only Authenticated Users with 'ADMIN' role or service_role can view or modify financial data
CREATE POLICY "Strict Admin Only access for financial_telemetry"
ON public.financial_telemetry
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role') = 'ADMIN' OR
  (auth.jwt() ->> 'role') = 'service_role'
);

CREATE POLICY "Strict Admin Only access for financial_transaction"
ON public.financial_transaction
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role') = 'ADMIN' OR
  (auth.jwt() ->> 'role') = 'service_role'
);

CREATE POLICY "Strict Admin Only access for admin_todo"
ON public.admin_todo
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role') = 'ADMIN' OR
  (auth.jwt() ->> 'role') = 'service_role'
);

-- 4. Create Teachers Table & RLS Policies
CREATE TABLE IF NOT EXISTS public.teachers (
    id VARCHAR(100) PRIMARY KEY, -- e.g. "TCH-001"
    teacher_id_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    subject_specialization VARCHAR(150),
    assigned_class VARCHAR(50),
    assigned_section VARCHAR(50),
    gender VARCHAR(20) DEFAULT 'MALE',
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50),
    joining_year INT DEFAULT 2020,
    qualification VARCHAR(150),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    avatar_initials VARCHAR(5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access for teachers" ON public.teachers FOR SELECT USING (true);
