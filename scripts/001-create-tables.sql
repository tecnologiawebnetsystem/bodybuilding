-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  pin VARCHAR(6) NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  initial_weight DECIMAL(5,2) NOT NULL,
  target_weight DECIMAL(5,2) NOT NULL,
  start_date DATE NOT NULL,
  gender VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create weight_logs table
CREATE TABLE IF NOT EXISTS weight_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create workout_checkins table
CREATE TABLE IF NOT EXISTS workout_checkins (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  workout_type VARCHAR(50) NOT NULL,
  workout_name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create running_checkins table
CREATE TABLE IF NOT EXISTS running_checkins (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  distance DECIMAL(5,2) NOT NULL,
  duration INTEGER,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create nutrition_logs table
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  meal_type VARCHAR(50) NOT NULL,
  description TEXT,
  calories INTEGER,
  protein DECIMAL(5,2),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create supplement_logs table
CREATE TABLE IF NOT EXISTS supplement_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  supplement_name VARCHAR(100) NOT NULL,
  dosage VARCHAR(50),
  time VARCHAR(50),
  date DATE NOT NULL,
  taken BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON weight_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_checkins_user_date ON workout_checkins(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_running_checkins_user_date ON running_checkins(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date ON nutrition_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_supplement_logs_user_date ON supplement_logs(user_id, date DESC);
