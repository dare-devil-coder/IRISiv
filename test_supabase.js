const { createClient } = require('@supabase/supabase-js');

const url = 'https://jhwjabgqcmrgtkuselyr.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impod2phYmdxY21yZ3RrdXNlbHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNzIzODEsImV4cCI6MjEwMTg0ODM4MX0.yzL3EBHVExnND-OQEXHYw_c3h44EFusXualpRo4rCKc';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impod2phYmdxY21yZ3RrdXNlbHlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjI3MjM4MSwiZXhwIjoyMTAxODQ4MzgxfQ.gmpTxx2u3Jsz4HZ8RQklXdAfLsZV3XlH85PLLmZmMa8';

async function testConnection() {
  console.log('Testing connection to Supabase API URL:', url);
  const supabase = createClient(url, serviceKey);

  try {
    const { data, error } = await supabase.from('projects').select('*').limit(5);
    if (error) {
      console.log('Query result error:', { message: error.message, code: error.code, details: error.details, hint: error.hint });
    } else {
      console.log('SUCCESS! Connected to Supabase. Records found:', data.length);
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Exception connecting to Supabase:', err);
  }
}

testConnection();
