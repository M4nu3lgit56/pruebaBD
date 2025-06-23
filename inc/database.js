import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://sqdjywwbdizqwozyaumf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZGp5d3diZGl6cXdvenlhdW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MzQ5NjgsImV4cCI6MjA2NjExMDk2OH0.i1tvFAztuyYJCdD2N1VxogG9hZZSq9t0pE1ybPlR3MQ';
export const supabase = createClient(supabaseUrl, supabaseKey);