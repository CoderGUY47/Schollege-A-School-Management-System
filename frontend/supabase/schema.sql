-- PostgreSQL Schema for Schollege MS (NCTB Curriculum)

-- 1. Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_name VARCHAR(50) UNIQUE NOT NULL, -- e.g. "Class 1", "Class 12"
    numeric_level INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Sections Table
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_name VARCHAR(50) NOT NULL REFERENCES public.classes(class_name) ON DELETE CASCADE,
    section_name VARCHAR(50) NOT NULL, -- e.g. "Section A", "Section B", "Section C", "Section D", "Section E"
    capacity INT DEFAULT 25,
    student_count INT DEFAULT 25,
    room_number VARCHAR(50),
    class_teacher VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Curriculum Subjects Table
CREATE TABLE IF NOT EXISTS public.curriculum_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_name VARCHAR(50) NOT NULL,
    group_name VARCHAR(50) DEFAULT 'General', -- "General", "Science", "Commerce", "Arts"
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- "COMPULSORY", "ELECTIVE", "OPTIONAL"
    full_marks INT NOT NULL DEFAULT 100,
    theory_marks INT NOT NULL DEFAULT 100,
    practical_marks INT DEFAULT 0,
    credit_hours INT NOT NULL DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Students Roster Table (900 Students)
-- Student Roll / ID Format: [Period]-[Class]-[Serial] (e.g. "261-01-0001")
--   Period (261) = Enrollment Period / Session (26 = Year 2026, 1 = Spring, 2 = Summer, 3 = Fall)
--   Class  (01)  = Class Level zero-padded (01 to 12)
--   Serial (0001)= Sequential student roll serial number within class
-- Examples: 261-01-0001 (Class 1, Roll 1) | 261-12-0003 (Class 12, Roll 3)
CREATE TABLE IF NOT EXISTS public.students (
    id VARCHAR(100) PRIMARY KEY,                    -- e.g. "SCHOLLEGE-C12-A-01"
    student_id_number VARCHAR(50) UNIQUE NOT NULL,  -- "SCH-2026-1001"
    roll_no VARCHAR(20) NOT NULL,                   -- "261-01-0001" (Period-Class-Serial)
    name VARCHAR(100) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    section_name VARCHAR(50) NOT NULL,
    group_name VARCHAR(50) DEFAULT 'General',
    gender VARCHAR(20) DEFAULT 'MALE',
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50),
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    father_mobile VARCHAR(50),                      -- NEW: Father's mobile number
    mother_mobile VARCHAR(50),                      -- NEW: Mother's mobile number
    guardian_phone VARCHAR(50),
    blood_group VARCHAR(10),
    gpa NUMERIC(3, 2) DEFAULT 5.00,
    attendance_rate VARCHAR(20) DEFAULT '96.5%',
    tuition_status VARCHAR(20) DEFAULT 'PAID',
    avatar_initials VARCHAR(5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Campus Notices Table
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- "EXAMS", "ACADEMIC", "FEES", "HOLIDAY"
    publisher VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    date VARCHAR(50) NOT NULL,
    urgent BOOLEAN DEFAULT FALSE,
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Exam Results Table
CREATE TABLE IF NOT EXISTS public.exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(100) REFERENCES public.students(id) ON DELETE CASCADE,
    term_name VARCHAR(100) NOT NULL, -- "Mid-Term Exam 2026"
    subject_code VARCHAR(50) NOT NULL,
    subject_name VARCHAR(150) NOT NULL,
    marks_obtained INT, -- NULL if absent / unattended
    grade VARCHAR(10) DEFAULT 'null', -- "A+", "A", "A-", "B", "C", "D", "F", "null"
    grade_point NUMERIC(3, 2) DEFAULT 0.00,
    is_absent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

-- Allow Public Select for Schollege Portal
CREATE POLICY "Allow public read access for classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow public read access for sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Allow public read access for curriculum_subjects" ON public.curriculum_subjects FOR SELECT USING (true);
CREATE POLICY "Allow public read access for students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public read access for notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow public read access for exam_results" ON public.exam_results FOR SELECT USING (true);
