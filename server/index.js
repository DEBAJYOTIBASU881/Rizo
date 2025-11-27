require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_KEY not set. Set them in .env or environment.');
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Predefined faculty credentials (hardcoded as requested)
const FACULTY_USER = 'faculty@college.local';
const FACULTY_PASS = 'FacultyPass123';

app.get('/', (req, res) => res.json({ ok: true, message: 'Student Results Server' }));

// Faculty login (hardcoded check)
app.post('/faculty/login', (req, res) => {
  const { username, password } = req.body;
  if (username === FACULTY_USER && password === FACULTY_PASS) {
    return res.json({ success: true, role: 'faculty' });
  }
  return res.status(401).json({ success: false, message: 'Invalid faculty credentials' });
});

// Student login
app.post('/student/login', async (req, res) => {
  const { studentId, password } = req.body;
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('student_id', studentId)
    .maybeSingle();
  if (error) return res.status(500).json({ success: false, error });
  if (!data || data.password !== password) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  return res.json({ success: true, student: data });
});

// Create student (faculty action)
app.post('/student', async (req, res) => {
  const payload = req.body; // expected fields described in README
  const {
    studentId,
    firstName,
    email,
    phone,
    password,
    department,
    branch,
    year,
    semester,
    subjects // array of subject_ids
  } = payload;
  if (!studentId || !password) return res.status(400).json({ success: false, message: 'studentId and password required' });

  // insert student
  const { data: studentData, error: studentError } = await supabase
    .from('students')
    .insert([
      {
        student_id: studentId,
        first_name: firstName,
        email,
        phone,
        password,
        department,
        branch,
        year,
        semester
      }
    ]);
  if (studentError) return res.status(500).json({ success: false, error: studentError });

  // enroll subjects if provided
  if (Array.isArray(subjects) && subjects.length > 0) {
    const enrollRows = subjects.map((s) => ({ student_id: studentId, subject_id: s }));
    const { error: enrollError } = await supabase.from('enrollments').insert(enrollRows);
    if (enrollError) console.error('enroll error', enrollError);
  }

  return res.json({ success: true, student: studentData });
});

// Get all students (for management list)
app.get('/students', async (req, res) => {
  const { data, error } = await supabase.from('students').select('*').order('student_id');
  if (error) return res.status(500).json({ success: false, error });
  return res.json({ success: true, students: data });
});

// Get student details
app.get('/student/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('students').select('*').eq('student_id', id).maybeSingle();
  if (error) return res.status(500).json({ success: false, error });
  if (!data) return res.status(404).json({ success: false, message: 'Not found' });
  // fetch enrolled subjects with marks
  const { data: enrolls, error: enrollError } = await supabase
    .from('enrollments')
    .select('subject_id, subjects(name, semester), marks(marks)')
    .eq('student_id', id);

  // The query above might need adjustment depending on how supabase joins work with the schema. 
  // Since marks table is separate and linked by student_id and subject_id, it's easier to fetch marks separately or use a join.
  // Let's try a simpler approach: fetch subjects, then fetch marks.

  const { data: subjects } = await supabase.from('enrollments').select('subject_id, subjects(*)').eq('student_id', id);
  const { data: marks } = await supabase.from('marks').select('*').eq('student_id', id);

  // Merge marks into subjects
  const subjectsWithMarks = subjects.map(s => {
    const markEntry = marks.find(m => m.subject_id === s.subject_id);
    return {
      ...s.subjects,
      marks: markEntry ? markEntry.marks : null
    };
  });

  return res.json({ success: true, student: data, subjects: subjectsWithMarks });
});

// Update student details
app.put('/student/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('students').update(updates).eq('student_id', id);
  if (error) return res.status(500).json({ success: false, error });
  return res.json({ success: true, updated: data });
});

// Delete student
app.delete('/student/:id', async (req, res) => {
  const { id } = req.params;
  const { error: delEnroll } = await supabase.from('enrollments').delete().eq('student_id', id);
  if (delEnroll) console.error(delEnroll);
  const { error } = await supabase.from('students').delete().eq('student_id', id);
  if (error) return res.status(500).json({ success: false, error });
  return res.json({ success: true });
});

// Get students enrolled for a subject
app.get('/subject/:subjectId/students', async (req, res) => {
  const { subjectId } = req.params;
  const { data, error } = await supabase
    .from('enrollments')
    .select('student_id, students(first_name, student_id)')
    .eq('subject_id', subjectId);
  if (error) return res.status(500).json({ success: false, error });
  return res.json({ success: true, enrollments: data });
});

// Get subjects (with optional filters)
app.get('/subjects', async (req, res) => {
  const { department, branch, semester } = req.query;
  let query = supabase.from('subjects').select('*');
  if (department) query = query.eq('department', department);
  if (branch) query = query.eq('branch', branch);
  if (semester) query = query.eq('semester', semester);

  const { data, error } = await query;
  if (error) return res.status(500).json({ success: false, error });
  return res.json({ success: true, subjects: data });
});

// Update marks for a subject (payload: [{studentId, marks}, ...])
app.post('/subject/:subjectId/marks', async (req, res) => {
  const { subjectId } = req.params;
  const rows = req.body; // array of { studentId, marks }
  if (!Array.isArray(rows)) return res.status(400).json({ success: false, message: 'array required' });
  // Upsert marks
  const upserts = rows.map((r) => ({ student_id: r.studentId, subject_id: subjectId, marks: r.marks }));
  const { error } = await supabase.from('marks').upsert(upserts, { onConflict: ['student_id', 'subject_id'] });
  if (error) return res.status(500).json({ success: false, error });
  return res.json({ success: true });
});

// Student change password
app.post('/student/:id/change-password', async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  const { data, error } = await supabase.from('students').select('password').eq('student_id', id).maybeSingle();
  if (error) return res.status(500).json({ success: false, error });
  if (!data || data.password !== oldPassword) return res.status(401).json({ success: false, message: 'Invalid old password' });
  const { error: updateError } = await supabase.from('students').update({ password: newPassword }).eq('student_id', id);
  if (updateError) return res.status(500).json({ success: false, updateError });
  return res.json({ success: true });
});

// --- Student-Faculty Query feature (simple threaded Q&A)

// Create a new query (student)
app.post('/query', async (req, res) => {
  const { studentId, title, body } = req.body;
  if (!studentId || !title || !body) return res.status(400).json({ success: false, message: 'studentId, title and body required' });
  try {
    const { data: qdata, error: qerr } = await supabase.from('queries').insert([{ student_id: studentId, title }]).select().maybeSingle();
    if (qerr) return res.status(500).json({ success: false, error: qerr });
    const qid = qdata.id;
    const { error: merr } = await supabase.from('query_messages').insert([{ query_id: qid, sender: 'student', sender_id: studentId, body }]);
    if (merr) return res.status(500).json({ success: false, error: merr });
    return res.json({ success: true, query: qdata });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get queries for a student
app.get('/student/:studentId/queries', async (req, res) => {
  const { studentId } = req.params;
  const { data, error } = await supabase.from('queries').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ success: false, error });
  return res.json({ success: true, queries: data });
});

// Get query details and its messages
app.get('/query/:id', async (req, res) => {
  const { id } = req.params;
  const { data: q, error: qerr } = await supabase.from('queries').select('*').eq('id', id).maybeSingle();
  if (qerr) return res.status(500).json({ success: false, error: qerr });
  if (!q) return res.status(404).json({ success: false, message: 'Not found' });
  const { data: msgs, error: merr } = await supabase.from('query_messages').select('*').eq('query_id', id).order('created_at', { ascending: true });
  if (merr) return res.status(500).json({ success: false, error: merr });
  return res.json({ success: true, query: q, messages: msgs });
});

// Faculty: list queries (optional filter by status)
app.get('/queries', async (req, res) => {
  const { status } = req.query;
  let q = supabase.from('queries').select('*').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) return res.status(500).json({ success: false, error });
  return res.json({ success: true, queries: data });
});

// Faculty responds to a query
app.post('/query/:id/respond', async (req, res) => {
  const { id } = req.params;
  const { facultyId, body } = req.body;
  if (!body) return res.status(400).json({ success: false, message: 'body required' });
  try {
    const { error: merr } = await supabase.from('query_messages').insert([{ query_id: id, sender: 'faculty', sender_id: facultyId || FACULTY_USER, body }]);
    if (merr) return res.status(500).json({ success: false, error: merr });
    // mark query as answered and set unread for student so they see the reply
    const { error: uerr } = await supabase.from('queries').update({ status: 'answered', unread: true }).eq('id', id);
    if (uerr) console.error('query status update error', uerr);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Mark query as read (student acknowledges replies)
app.post('/query/:id/mark-read', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('queries').update({ unread: false }).eq('id', id);
    if (error) return res.status(500).json({ success: false, error });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- Announcements: faculty posts, students view

// Create an announcement (faculty)
app.post('/announcement', async (req, res) => {
  const { title, body, author } = req.body;
  if (!title || !body) return res.status(400).json({ success: false, message: 'title and body required' });
  try {
    const { data, error } = await supabase.from('announcements').insert([{ title, body, author }]).select().maybeSingle();
    if (error) return res.status(500).json({ success: false, error });
    return res.json({ success: true, announcement: data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// List announcements (students and faculty)
app.get('/announcements', async (req, res) => {
  const { limit = 20 } = req.query;
  try {
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(Number(limit));
    if (error) return res.status(500).json({ success: false, error });
    return res.json({ success: true, announcements: data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- Polls

// Create a poll (faculty)
app.post('/poll', async (req, res) => {
  const { question, options } = req.body;
  console.log('Creating poll:', { question, options }); // Debug log

  if (!question || !Array.isArray(options) || options.length < 2) {
    console.log('Invalid poll data');
    return res.status(400).json({ success: false, message: 'question and at least 2 options required' });
  }
  try {
    const { data, error } = await supabase
      .from('polls')
      .insert([{ question, options: JSON.stringify(options), active: true }])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase error creating poll:', error);
      return res.status(500).json({ success: false, error });
    }

    console.log('Poll created successfully:', data);
    return res.json({ success: true, poll: data });
  } catch (err) {
    console.error('Server error creating poll:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// List active polls
app.get('/polls', async (req, res) => {
  const { data, error } = await supabase.from('polls').select('*').eq('active', true).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ success: false, error });
  return res.json({ success: true, polls: data });
});

// Vote on a poll
app.post('/polls/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { studentId, optionIndex } = req.body;
  if (!studentId || optionIndex === undefined) return res.status(400).json({ success: false, message: 'studentId and optionIndex required' });

  try {
    const { error } = await supabase.from('poll_votes').insert([{ poll_id: id, student_id: studentId, option_index: optionIndex }]);
    if (error) {
      if (error.code === '23505') return res.status(400).json({ success: false, message: 'Already voted' });
      return res.status(500).json({ success: false, error });
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get poll results (for display after voting)
app.get('/polls/:id/results', async (req, res) => {
  const { id } = req.params;
  // Count votes for each option
  const { data, error } = await supabase.from('poll_votes').select('option_index').eq('poll_id', id);
  if (error) return res.status(500).json({ success: false, error });

  const counts = {};
  data.forEach(v => {
    counts[v.option_index] = (counts[v.option_index] || 0) + 1;
  });

  return res.json({ success: true, results: counts });
});

// Get all polls (faculty view - includes inactive)
app.get('/polls/all', async (req, res) => {
  try {
    const { data, error } = await supabase.from('polls').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, error });
    return res.json({ success: true, polls: data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get detailed poll results with voter information
app.get('/polls/:id/detailed-results', async (req, res) => {
  const { id } = req.params;
  try {
    // Get poll details
    const { data: poll, error: pollError } = await supabase.from('polls').select('*').eq('id', id).maybeSingle();
    if (pollError) return res.status(500).json({ success: false, error: pollError });
    if (!poll) return res.status(404).json({ success: false, message: 'Poll not found' });

    // Get all votes with student information
    const { data: votes, error: votesError } = await supabase
      .from('poll_votes')
      .select('option_index, student_id, created_at, students(first_name, student_id)')
      .eq('poll_id', id)
      .order('created_at', { ascending: false });

    if (votesError) return res.status(500).json({ success: false, error: votesError });

    // Organize votes by option
    const options = JSON.parse(poll.options);
    const results = options.map((option, index) => {
      const optionVotes = votes.filter(v => v.option_index === index);
      return {
        option,
        index,
        count: optionVotes.length,
        voters: optionVotes.map(v => ({
          studentId: v.student_id,
          studentName: v.students?.first_name || 'Unknown',
          votedAt: v.created_at
        }))
      };
    });

    return res.json({
      success: true,
      poll,
      results,
      totalVotes: votes.length
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Toggle poll active status
app.post('/polls/:id/toggle-active', async (req, res) => {
  const { id } = req.params;
  try {
    // Get current status
    const { data: poll, error: fetchError } = await supabase.from('polls').select('active').eq('id', id).maybeSingle();
    if (fetchError) return res.status(500).json({ success: false, error: fetchError });
    if (!poll) return res.status(404).json({ success: false, message: 'Poll not found' });

    // Toggle status
    const { error: updateError } = await supabase.from('polls').update({ active: !poll.active }).eq('id', id);
    if (updateError) return res.status(500).json({ success: false, error: updateError });

    return res.json({ success: true, active: !poll.active });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Check if student has voted on a poll
app.get('/polls/:id/vote-status/:studentId', async (req, res) => {
  const { id, studentId } = req.params;
  try {
    const { data, error } = await supabase
      .from('poll_votes')
      .select('option_index')
      .eq('poll_id', id)
      .eq('student_id', studentId)
      .maybeSingle();

    if (error) return res.status(500).json({ success: false, error });

    if (data) {
      return res.json({ success: true, hasVoted: true, optionIndex: data.option_index });
    } else {
      return res.json({ success: true, hasVoted: false });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- Settings (University Name, etc.)

// Get a setting
app.get('/settings/:key', async (req, res) => {
  const { key } = req.params;
  const { data, error } = await supabase.from('settings').select('value').eq('key', key).maybeSingle();
  if (error) return res.status(500).json({ success: false, error });
  return res.json({ success: true, value: data ? data.value : null });
});

// Update a setting (faculty only - ideally protected)
app.post('/settings/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  if (!value) return res.status(400).json({ success: false, message: 'value required' });

  const { error } = await supabase.from('settings').upsert([{ key, value }]);
  if (error) return res.status(500).json({ success: false, error });
  return res.json({ success: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
