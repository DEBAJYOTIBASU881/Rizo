require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fix() {
    console.log('Fixing enrollments...');

    // 1. Delete existing enrollments and marks for STU001
    await supabase.from('marks').delete().eq('student_id', 'STU001');
    await supabase.from('enrollments').delete().eq('student_id', 'STU001');

    // 2. Enroll in subjects
    const subjects = ['BTECH-C-1-1', 'BTECH-C-1-2'];
    const { error: eErr } = await supabase.from('enrollments').insert([
        { student_id: 'STU001', subject_id: 'BTECH-C-1-1' },
        { student_id: 'STU001', subject_id: 'BTECH-C-1-2' }
    ]);

    if (eErr) console.error('Enrollment error:', eErr);
    else console.log('Enrolled in subjects');

    // 3. Add marks
    const { error: mErr } = await supabase.from('marks').insert([
        { student_id: 'STU001', subject_id: 'BTECH-C-1-1', marks: 85 },
        { student_id: 'STU001', subject_id: 'BTECH-C-1-2', marks: 35 }
    ]);

    if (mErr) console.error('Marks error:', mErr);
    else console.log('Marks added');
}

fix();
