-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO FIX POLLS AND SETTINGS

-- 1. Create Polls Table
CREATE TABLE IF NOT EXISTS polls (
  id serial PRIMARY KEY,
  question text NOT NULL,
  options jsonb NOT NULL, -- array of strings
  created_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

-- 2. Create Poll Votes Table
CREATE TABLE IF NOT EXISTS poll_votes (
  id serial PRIMARY KEY,
  poll_id integer REFERENCES polls(id) ON DELETE CASCADE,
  student_id text REFERENCES students(student_id) ON DELETE CASCADE,
  option_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (poll_id, student_id)
);

-- 3. Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL
);

-- 4. Insert Default Settings
INSERT INTO settings (key, value) VALUES ('university_name', 'RIZO University')
ON CONFLICT (key) DO NOTHING;

-- 5. Insert Sample Poll (Optional)
INSERT INTO polls (question, options) VALUES
('How is the new campus wifi?', '["Excellent", "Good", "Needs Improvement", "Terrible"]')
ON CONFLICT DO NOTHING;
