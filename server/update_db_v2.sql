-- settings table for key-value storage (e.g., University Name)
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL
);

-- Insert default University Name
INSERT INTO settings (key, value) VALUES ('university_name', 'RIZO University')
ON CONFLICT DO NOTHING;
