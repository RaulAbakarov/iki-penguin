# Chocolate & Vanilla

A private two-person web application designed for mutual understanding through questions and answers.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Supabase Setup

Create a new Supabase project and run this SQL in the SQL Editor:

```sql
-- Questions table
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  choices TEXT[] NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  author TEXT NOT NULL CHECK (author IN ('Chocolate', 'Vanilla')),
  target TEXT NOT NULL CHECK (target IN ('Chocolate', 'Vanilla')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Answers table
CREATE TABLE answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answered_by TEXT NOT NULL CHECK (answered_by IN ('Chocolate', 'Vanilla')),
  selected_index INTEGER NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id, answered_by)
);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Allow all operations (private app, no auth)
CREATE POLICY "Allow all for questions" ON questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for answers" ON answers FOR ALL USING (true) WITH CHECK (true);
```

## Deployment

Deploy to Vercel and add your Supabase environment variables in the Vercel dashboard.
