import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

const StudentCreate: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        studentId: '',
        password: '',
        firstName: '',
        email: '',
        phone: '',
        department: 'B.Tech',
        branch: 'Core',
        year: new Date().getFullYear(),
        semester: 1,
        subjects: [] as string[]
    });

    useEffect(() => {
        if (formData.department && formData.semester) {
            fetchSubjects();
        }
    }, [formData.department, formData.branch, formData.semester]);

    const fetchSubjects = async () => {
        try {
            const params: any = { department: formData.department, semester: formData.semester };
            if (formData.department === 'B.Tech') {
                params.branch = formData.branch;
            }
            const response = await api.get('/subjects', { params });
            if (response.data.success) {
                setSubjects(response.data.subjects);
            }
        } catch (error) {
            console.error('Failed to fetch subjects', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/student', formData);
            if (response.data.success) {
                alert('Student created successfully!');
                navigate('/faculty/students');
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create student');
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectToggle = (subjectId: string) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(subjectId)
                ? prev.subjects.filter(id => id !== subjectId)
                : [...prev.subjects, subjectId]
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="max-w-3xl mx-auto bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-8">
                <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">Enroll New Student</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Student ID</label>
                            <input
                                type="text"
                                required
                                value={formData.studentId}
                                onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Password</label>
                            <input
                                type="text"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">First Name</label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Mobile Number</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="10-digit mobile number"
                                pattern="[0-9]{10}"
                                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Department</label>
                            <select
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                            >
                                <option value="B.Tech">B.Tech</option>
                                <option value="BCA">BCA</option>
                            </select>
                        </div>
                        {formData.department === 'B.Tech' && (
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Branch</label>
                                <select
                                    value={formData.branch}
                                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
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
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Year</label>
                            <input
                                type="number"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Semester</label>
                            <select
                                value={formData.semester}
                                onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Enroll Subjects</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            {subjects.length === 0 ? (
                                <p className="text-neutral-500 text-sm">No subjects found for this selection.</p>
                            ) : (
                                subjects.map(subject => (
                                    <label key={subject.subject_id} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.subjects.includes(subject.subject_id)}
                                            onChange={() => handleSubjectToggle(subject.subject_id)}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-neutral-700 dark:text-neutral-300">{subject.name}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold shadow-lg shadow-primary/25 transition-all flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Student</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentCreate;
