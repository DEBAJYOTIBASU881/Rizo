import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '@/services/api';
import { Lock, User, Loader2 } from 'lucide-react';

const StudentLogin: React.FC = () => {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/student/login', { studentId, password });

            if (response.data.success) {
                login('dummy-jwt-token', {
                    id: response.data.student.student_id,
                    role: 'student',
                    name: response.data.student.first_name,
                    email: response.data.student.email
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-dark-card p-8 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Student Login</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-2">View your results and academic profile</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Student ID</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="Enter your Roll Number"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-accent hover:bg-yellow-600 text-white rounded-lg font-semibold shadow-lg shadow-accent/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'View Results'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentLogin;
