-- Supabase DB schema for Student Result Management

-- students table
CREATE TABLE IF NOT EXISTS students (
  id serial PRIMARY KEY,
  student_id text UNIQUE NOT NULL,
  first_name text,
  email text,
  phone text,
  password text,
  department text,
  branch text,
  year integer,
  semester integer,
  created_at timestamptz default now()
);

-- subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id serial PRIMARY KEY,
  subject_id text UNIQUE NOT NULL,
  name text NOT NULL,
  department text,
  branch text,
  year integer,
  semester integer
);

-- enrollments: student - subject
CREATE TABLE IF NOT EXISTS enrollments (
  id serial PRIMARY KEY,
  student_id text REFERENCES students(student_id) ON DELETE CASCADE,
  subject_id text REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- marks
CREATE TABLE IF NOT EXISTS marks (
  id serial PRIMARY KEY,
  student_id text REFERENCES students(student_id) ON DELETE CASCADE,
  subject_id text REFERENCES subjects(subject_id) ON DELETE CASCADE,
  marks integer,
  UNIQUE (student_id, subject_id)
);

-- Insert sample subjects (minimal)
INSERT INTO subjects (subject_id, name, department, branch, year, semester) VALUES
('BTECH-C-1-1','Mathematics I','B.Tech','Core',1,1),
('BTECH-C-1-2','Physics','B.Tech','Core',1,1),
('BTECH-AIML-3-5','Machine Learning','B.Tech','AIML',3,5),
('BCA-1-1','Programming Fundamentals','BCA',NULL,1,1)
ON CONFLICT DO NOTHING;

-- queries / query_messages for student-faculty Q&A
CREATE TABLE IF NOT EXISTS queries (
  id serial PRIMARY KEY,
  student_id text NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  title text NOT NULL,
  status text DEFAULT 'open', -- open | answered | closed
  unread boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS query_messages (
  id serial PRIMARY KEY,
  query_id integer REFERENCES queries(id) ON DELETE CASCADE,
  sender text NOT NULL,
  sender_id text,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_queries_student ON queries(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_query ON query_messages(query_id);

-- announcements: simple notices posted by faculty
CREATE TABLE IF NOT EXISTS announcements (
  id serial PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL,
  author text DEFAULT 'faculty',
  created_at timestamptz DEFAULT now()
);

INSERT INTO announcements (title, body, author) VALUES
('Welcome to RIZO','Welcome! This system will host student results and important notices.','RIZO Admin')
ON CONFLICT DO NOTHING;

-- polls
CREATE TABLE IF NOT EXISTS polls (
  id serial PRIMARY KEY,
  question text NOT NULL,
  options jsonb NOT NULL, -- array of strings
  created_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

-- poll_votes
CREATE TABLE IF NOT EXISTS poll_votes (
  id serial PRIMARY KEY,
  poll_id integer REFERENCES polls(id) ON DELETE CASCADE,
  student_id text REFERENCES students(student_id) ON DELETE CASCADE,
  option_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (poll_id, student_id)
);

-- Insert sample poll
INSERT INTO polls (question, options) VALUES
('What new sports facility do you want?', '["Swimming Pool", "Tennis Court", "Gym Expansion"]')
ON CONFLICT DO NOTHING;
