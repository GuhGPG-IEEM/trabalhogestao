/*
  # Minha Rotina Escolar - Database Schema

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `name` (text) - Student's name
      - `email` (text) - Student email
      - `created_at` (timestamptz)
    
    - `subjects`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key)
      - `name` (text) - Subject name
      - `schedule_days` (text array) - Days of the week
      - `schedule_time` (text) - Time of class
      - `created_at` (timestamptz)
    
    - `grades`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key)
      - `subject_id` (uuid, foreign key)
      - `grade` (numeric) - Grade value
      - `created_at` (timestamptz)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key)
      - `subject_id` (uuid, foreign key)
      - `title` (text) - Task title
      - `due_date` (date) - Due date
      - `completed` (boolean) - Completion status
      - `created_at` (timestamptz)
    
    - `study_tips`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key)
      - `query` (text) - Original study query
      - `tips` (text) - AI-generated tips
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Users can only access their own student records and related data
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own student profile"
  ON students FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own student profile"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own student profile"
  ON students FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  schedule_days text[] DEFAULT '{}',
  schedule_time text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Users can insert own subjects"
  ON subjects FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can update own subjects"
  ON subjects FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can delete own subjects"
  ON subjects FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  grade numeric(4,2) NOT NULL CHECK (grade >= 0 AND grade <= 10),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own grades"
  ON grades FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Users can insert own grades"
  ON grades FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can update own grades"
  ON grades FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can delete own grades"
  ON grades FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  due_date date NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- Create study_tips table
CREATE TABLE IF NOT EXISTS study_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  query text NOT NULL,
  tips text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE study_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own study tips"
  ON study_tips FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Users can insert own study tips"
  ON study_tips FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can delete own study tips"
  ON study_tips FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());