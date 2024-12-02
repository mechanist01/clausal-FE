import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pfxdwmwwfmxiqnjworyc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmeGR3bXd3Zm14aXFuandvcnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MDkwOTYsImV4cCI6MjA0ODM4NTA5Nn0.7D5V_IhZ-Dne3hI3YNsfU1QLlfL3fhKy6raXsY3pV4w' 

export const supabase = createClient(supabaseUrl, supabaseKey)