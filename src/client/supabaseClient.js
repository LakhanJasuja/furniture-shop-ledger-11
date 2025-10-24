// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vsbcvvhmezqedhwnishd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYmN2dmhtZXpxZWRod25pc2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NjYwMTgsImV4cCI6MjA3NjQ0MjAxOH0.rvodku-fzTiRvdsuIMo5__JCnlyN-LRK7XnvX3R_DjM';
export const supabase = createClient(supabaseUrl, supabaseKey);
