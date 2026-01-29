-- Create spinning_schedule table for class schedules
CREATE TABLE IF NOT EXISTS spinning_schedule (
  id SERIAL PRIMARY KEY,
  time_slot VARCHAR(10) NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 5), -- 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta
  instructor VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent duplicate time/day combinations
CREATE UNIQUE INDEX IF NOT EXISTS spinning_schedule_unique_slot 
ON spinning_schedule(time_slot, day_of_week);

-- Insert default spinning schedule based on the image
INSERT INTO spinning_schedule (time_slot, day_of_week, instructor) VALUES
  -- 6:00
  ('6:00', 1, 'ALEX'),
  ('6:00', 2, 'ARILDO'),
  ('6:00', 3, 'ALEX'),
  ('6:00', 4, 'ARILDO'),
  ('6:00', 5, 'ALEX'),
  -- 7:00
  ('7:00', 1, 'RENATO'),
  ('7:00', 2, 'ARILDO'),
  ('7:00', 3, 'RENATO'),
  ('7:00', 4, 'ARILDO'),
  ('7:00', 5, 'RENATO'),
  -- 17:00
  ('17:00', 2, 'ALEX'),
  ('17:00', 4, 'ALEX'),
  ('17:00', 5, 'ALEX'),
  -- 18:15
  ('18:15', 2, 'RAFAEL'),
  ('18:15', 4, 'RAFAEL'),
  -- 19:15
  ('19:15', 1, 'RAFAEL'),
  ('19:15', 2, 'RAFAEL'),
  ('19:15', 3, 'RAFAEL'),
  ('19:15', 4, 'RAFAEL'),
  ('19:15', 5, 'ARILDO'),
  -- 20:00
  ('20:00', 1, 'ARILDO'),
  ('20:00', 2, 'ARILDO'),
  ('20:00', 3, 'ARILDO'),
  ('20:00', 5, 'ARILDO'),
  -- 21:00
  ('21:00', 1, 'ARILDO'),
  ('21:00', 2, 'ARILDO'),
  ('21:00', 3, 'ARILDO')
ON CONFLICT (time_slot, day_of_week) DO UPDATE SET
  instructor = EXCLUDED.instructor,
  updated_at = NOW();
