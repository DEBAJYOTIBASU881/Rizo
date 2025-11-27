import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';

interface Student {
    student_id: string;
    first_name: string;
    email: string;
    department: string;
    year: number;
}

const StudentList: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/students');
            if (response.data.success) {
                setStudents(response.data.students);
            }
        } catch (error) {
            console.error('Failed to fetch students', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(`Are you sure you want to delete student ${id}?`)) return;
        try {
            await api.delete(`/student/${encodeURIComponent(id)}`);
            setStudents(students.filter(s => s.student_id !== id));
        } catch (error) {
            alert('Failed to delete student');
        }
    };

    const filteredStudents = students.filter(s =>
        s.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">Student Management</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">View and manage student records</p>
                </div>
                <Link to="/faculty/students/create" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-5 h-5" /> Enroll Student
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                    type="text"
                    placeholder="Search by Name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-card border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white"
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                            <tr>
                                <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300">ID</th>
                                <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300">Name</th>
                                <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300">Email</th>
                                <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300">Dept</th>
                                <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300">Year</th>
                                <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-neutral-500">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                        Loading students...
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-neutral-500">
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.student_id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="p-4 font-mono text-primary dark:text-blue-400">{student.student_id}</td>
                                        <td className="p-4 text-neutral-800 dark:text-white">{student.first_name}</td>
                                        <td className="p-4 text-neutral-600 dark:text-neutral-400">{student.email}</td>
                                        <td className="p-4 text-neutral-600 dark:text-neutral-400">{student.department}</td>
                                        <td className="p-4 text-neutral-600 dark:text-neutral-400">{student.year}</td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <Link to={`/faculty/students/${encodeURIComponent(student.student_id)}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(student.student_id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentList;
