-- Tabela para reservas de aulas (Spinning e Ginastica)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'class_bookings') THEN
    CREATE TABLE class_bookings (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(100) NOT NULL,
      class_type VARCHAR(20) NOT NULL,
      class_date DATE NOT NULL,
      class_time VARCHAR(10) NOT NULL,
      instructor VARCHAR(100),
      checked_in_app BOOLEAN DEFAULT false,
      checked_in_gym BOOLEAN DEFAULT false,
      reminder_sent BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    
    -- Indice para buscas rapidas
    CREATE INDEX idx_class_bookings_user ON class_bookings(user_id);
    CREATE INDEX idx_class_bookings_date ON class_bookings(class_date);
    
    -- Constraint de unicidade
    ALTER TABLE class_bookings ADD CONSTRAINT unique_booking UNIQUE(user_id, class_type, class_date, class_time);
  END IF;
END $$;
