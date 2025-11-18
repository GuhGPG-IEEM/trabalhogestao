import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          student_id: string;
          name: string;
          schedule_days: string[];
          schedule_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          name: string;
          schedule_days?: string[];
          schedule_time?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          name?: string;
          schedule_days?: string[];
          schedule_time?: string;
          created_at?: string;
        };
      };
      grades: {
        Row: {
          id: string;
          student_id: string;
          subject_id: string;
          grade: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject_id: string;
          grade: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject_id?: string;
          grade?: number;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          student_id: string;
          subject_id: string;
          title: string;
          due_date: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject_id: string;
          title: string;
          due_date: string;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject_id?: string;
          title?: string;
          due_date?: string;
          completed?: boolean;
          created_at?: string;
        };
      };
      study_tips: {
        Row: {
          id: string;
          student_id: string;
          query: string;
          tips: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          query: string;
          tips: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          query?: string;
          tips?: string;
          created_at?: string;
        };
      };
    };
  };
};
