require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
    console.log('Seeding student data...');

    // 1. Create student
    const { data: student, error: sErr } = await supabase.from('students').upsert([{
        student_id: 'STU001',
        first_name: 'John',
        email: 'john@example.com',
        password: 'pass123',
        department: 'B.Tech',
        branch: 'Core',
        semester: 1
    }], { onConflict: 'student_id' }).select().maybeSingle();

    if (sErr) console.error('Student error:', sErr);
    else console.log('Student created/updated:', student);

    // 2. Enroll in subjects (using IDs from db.sql)
    const subjects = ['BTECH-C-1-1', 'BTECH-C-1-2'];

    for (const sub of subjects) {
        const { error: eErr } = await supabase.from('enrollments').upsert([
            { student_id: 'STU001', subject_id: sub }
        ], { onConflict: 'student_id, subject_id' }); // Assuming composite key constraint might exist or just ignore duplicate error

        if (eErr) console.log(`Enrollment error for ${sub} (might already exist):`, eErr.message);
        else console.log(`Enrolled in ${sub}`);
    }

    // 3. Add marks
    const marksData = [
        { student_id: 'STU001', subject_id: 'BTECH-C-1-1', marks: 85 },
        { student_id: 'STU001', subject_id: 'BTECH-C-1-2', marks: 35 }
    ];

    for (const m of marksData) {
        const { error: mErr } = await supabase.from('marks').upsert([m], { onConflict: 'student_id, subject_id' });
        if (mErr) console.log(`Marks error for ${m.subject_id}:`, mErr.message);
        else console.log(`Marks added for ${m.subject_id}`);
    }

    console.log('Seeding complete.');
}

seed();
