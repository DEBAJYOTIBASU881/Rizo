require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkTables() {
    console.log('Checking tables...');
    const { data, error } = await supabase.from('polls').select('*').limit(1);
    if (error) {
        console.error('Error accessing polls table:', error);
    } else {
        console.log('Polls table exists. Data:', data);
    }
}

checkTables();
