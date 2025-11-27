import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Save, Loader2, Download } from 'lucide-react';

const MarksManagement: React.FC = () => {
    const [department, setDepartment] = useState('B.Tech');
    const [branch, setBranch] = useState('Core');
    const [semester, setSemester] = useState(1);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [marks, setMarks] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, [department, branch, semester]);

    useEffect(() => {
        if (selectedSubject) {
            fetchStudents();
        }
    }, [selectedSubject]);

    const fetchSubjects = async () => {
        try {
            const params: any = { department, semester };
            if (department === 'B.Tech') params.branch = branch;
            const response = await api.get('/subjects', { params });
            if (response.data.success) {
                setSubjects(response.data.subjects);
            }
        } catch (error) {
            console.error('Failed to fetch subjects', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await api.get(`/subject/${selectedSubject}/students`);
            if (response.data.success) {
                setStudents(response.data.enrollments);
                // Initialize marks from existing data if available
                const marksData: Record<string, number> = {};
                response.data.enrollments.forEach((e: any) => {
                    if (e.marks !== undefined) marksData[e.student_id] = e.marks;
                });
                setMarks(marksData);
            }
        } catch (error) {
            console.error('Failed to fetch students', error);
        }
    };

    const handleMarkChange = (studentId: string, value: string) => {
        const numValue = parseInt(value);
        if (value === '' || (numValue >= 0 && numValue <= 100)) {
            setMarks(prev => ({ ...prev, [studentId]: numValue }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = Object.entries(marks).map(([studentId, marksValue]) => ({
                studentId,
                marks: marksValue
            }));
            await api.post(`/subject/${selectedSubject}/marks`, payload);
            alert('Marks saved successfully!');
        } catch (error) {
            alert('Failed to save marks');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-8">Marks Management</h1>

            {/* Filters */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Department</label>
                        <select
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                        >
                            <option value="B.Tech">B.Tech</option>
                            <option value="BCA">BCA</option>
                        </select>
                    </div>
                    {department === 'B.Tech' && (
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Branch</label>
                            <select
                                value={branch}
                                onChange={e => setBranch(e.target.value)}
                                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                            >
                                <option value="Core">Core</option>
                                <option value="AIML">AIML</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Cyber Security">Cyber Security</option>
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Semester</label>
                        <select
                            value={semester}
                            onChange={e => setSemester(parseInt(e.target.value))}
                            className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={e => setSelectedSubject(e.target.value)}
                            className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(sub => (
                                <option key={sub.subject_id} value={sub.subject_id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Marks Table */}
            {selectedSubject && (
                <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                            {subjects.find(s => s.subject_id === selectedSubject)?.name} - Marks Entry
                        </h2>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg flex items-center gap-2 transition-colors"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Marks
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="p-4 text-left font-semibold text-neutral-600 dark:text-neutral-300">Student ID</th>
                                    <th className="p-4 text-left font-semibold text-neutral-600 dark:text-neutral-300">Marks (0-100)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="p-8 text-center text-neutral-500">
                                            No students enrolled in this subject.
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student: any) => (
                                        <tr key={student.student_id} className="border-b border-neutral-100 dark:border-neutral-800">
                                            <td className="p-4 font-mono text-primary dark:text-blue-400">{student.student_id}</td>
                                            <td className="p-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={marks[student.student_id] || ''}
                                                    onChange={e => handleMarkChange(student.student_id, e.target.value)}
                                                    className="w-32 p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                                                    placeholder="Enter marks"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarksManagement;
