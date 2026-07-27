-- Migration: 2026-08-08 — Students Table: Add father_mobile, mother_mobile; change roll_no to formatted VARCHAR
-- Roll number format: [YYS]-[CC]-[NNNN]
--   YYS = 2-digit year + 1-digit session (e.g. 261 = year 26, session 1)
--   CC  = 2-digit class number, zero-padded (01–12)
--   NNNN = 4-digit sequential roll within class, zero-padded
-- Examples:
--   261-01-0001  (Year 26, Session 1, Class 1, Roll 1)
--   261-10-1245  (Year 26, Session 1, Class 10, Roll 1245)

-- 1. Add father_mobile column
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS father_mobile VARCHAR(50);

-- 2. Add mother_mobile column
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS mother_mobile VARCHAR(50);

-- 3. Change roll_no from INT to VARCHAR to support the formatted roll ID string
--    Step A: add a temporary new column
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS roll_no_formatted VARCHAR(20);

-- Step B: populate roll_no_formatted from existing roll_no (plain integer → just store as-is during migration)
UPDATE public.students
  SET roll_no_formatted = LPAD(roll_no::text, 4, '0');

-- Step C: drop the old INT column
ALTER TABLE public.students
  DROP COLUMN IF EXISTS roll_no;

-- Step D: rename the new column to roll_no
ALTER TABLE public.students
  RENAME COLUMN roll_no_formatted TO roll_no;

-- Add NOT NULL constraint after migration
ALTER TABLE public.students
  ALTER COLUMN roll_no SET NOT NULL;
