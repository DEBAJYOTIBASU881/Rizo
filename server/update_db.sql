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
