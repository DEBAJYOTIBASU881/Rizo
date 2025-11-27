import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '@/services/api';
import { Lock, Mail, Loader2 } from 'lucide-react';

const FacultyLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // In a real app, this would be the API call
            // const response = await api.post('/faculty/login', { username: email, password });
            // For demo/dev as per instructions, we might need to match the backend expectation
            // Backend expects: { username, password }

            const response = await api.post('/faculty/login', { username: email, password });

            if (response.data.success) {
                login('dummy-jwt-token', { id: 'faculty', role: 'faculty', name: 'Faculty Admin', email });
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
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Faculty Login</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-2">Enter your credentials to access the dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email ID</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="admin@rizo.local"
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
                                className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-neutral-500">Dev Credentials: faculty@college.local / FacultyPass123</p>
                </div>
            </div>
        </div>
    );
};

export default FacultyLogin;
