-- Tabela de eventos do calendario
CREATE TABLE IF NOT EXISTS calendar_events (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'personal', -- 'personal', 'gym_class', 'workout', 'running'
  start_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  all_day BOOLEAN DEFAULT false,
  
  -- Recorrencia
  recurrence_type TEXT, -- 'none', 'daily', 'weekly', 'monthly', 'yearly'
  recurrence_interval INTEGER DEFAULT 1, -- a cada X dias/semanas/meses
  recurrence_days INTEGER[], -- dias da semana para recorrencia semanal (0=domingo, 1=segunda, etc)
  recurrence_end_date DATE, -- data fim da recorrencia (null = infinito)
  
  -- Notificacao
  reminder_minutes INTEGER, -- minutos antes para notificar (null = sem lembrete)
  
  -- Vinculo com aulas da academia
  gym_class_type TEXT, -- 'spinning', 'ginastica', etc
  gym_class_id INTEGER,
  
  -- Cores e visual
  color TEXT DEFAULT '#3b82f6',
  
  -- Metadados
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indice para busca por usuario e data
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date ON calendar_events(user_id, start_date);

-- Tabela de excecoes para eventos recorrentes (dias especificos cancelados)
CREATE TABLE IF NOT EXISTS calendar_event_exceptions (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES calendar_events(id) ON DELETE CASCADE,
  exception_date DATE NOT NULL,
  is_cancelled BOOLEAN DEFAULT true,
  modified_title TEXT,
  modified_start_time TIME,
  modified_end_time TIME,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indice para busca de excecoes
CREATE INDEX IF NOT EXISTS idx_calendar_exceptions_event ON calendar_event_exceptions(event_id, exception_date);
