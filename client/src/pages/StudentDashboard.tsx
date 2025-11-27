import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '@/services/api';
import { User, Mail, Phone, GraduationCap, BookOpen, Bell, MessageSquare, BarChart2, Send, Plus, Lock, RefreshCw } from 'lucide-react';

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [studentData, setStudentData] = useState<any>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [marks, setMarks] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [queries, setQueries] = useState<any[]>([]);
    const [polls, setPolls] = useState<any[]>([]);
    const [voteStatus, setVoteStatus] = useState<{ [key: number]: number }>({});
    const [pollResults, setPollResults] = useState<{ [key: number]: any }>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Form states
    const [newQueryTitle, setNewQueryTitle] = useState('');
    const [newQueryBody, setNewQueryBody] = useState('');
    const [showQueryForm, setShowQueryForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (user?.id) {
            fetchStudentData();
        }
    }, [user]);

    // Refresh data function
    const refreshData = async () => {
        if (!user?.id) return;

        setRefreshing(true);
        try {
            await fetchStudentData();
        } finally {
            setRefreshing(false);
        }
    };

    // Auto-refresh when window gains focus
    useEffect(() => {
        const handleFocus = () => {
            if (user?.id) {
                refreshData();
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [user]);

    const fetchStudentData = async () => {
        try {
            const response = await api.get(`/student/${encodeURIComponent(user?.id || '')}`);
            if (response.data.success) {
                setStudentData(response.data.student);
                setSubjects(response.data.subjects || []);
                // Fetch other data
                fetchAnnouncements();
                fetchQueries();
                fetchPolls();
            }
        } catch (error) {
            console.error('Failed to fetch student data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements?limit=5');
            if (res.data.success) setAnnouncements(res.data.announcements);
        } catch (e) { console.error(e); }
    };

    const fetchQueries = async () => {
        try {
            const res = await api.get(`/student/${encodeURIComponent(user?.id || '')}/queries`);
            if (res.data.success) setQueries(res.data.queries);
        } catch (e) { console.error(e); }
    };

    const fetchPolls = async () => {
        try {
            const res = await api.get('/polls');
            if (res.data.success) {
                setPolls(res.data.polls);
                // Fetch vote status for each poll
                res.data.polls.forEach((poll: any) => {
                    checkVoteStatus(poll.id);
                });
            }
        } catch (e) { console.error(e); }
    };

    const checkVoteStatus = async (pollId: number) => {
        if (!user?.id) return;
        try {
            const res = await api.get(`/polls/${pollId}/vote-status/${user.id}`);
            if (res.data.success && res.data.hasVoted) {
                setVoteStatus(prev => ({ ...prev, [pollId]: res.data.optionIndex }));
                fetchPollResults(pollId);
            }
        } catch (e) { console.error(e); }
    };

    const fetchPollResults = async (pollId: number) => {
        try {
            const res = await api.get(`/polls/${pollId}/results`);
            if (res.data.success) {
                setPollResults(prev => ({ ...prev, [pollId]: res.data.results }));
            }
        } catch (e) { console.error(e); }
    };

    const handleSubmitQuery = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/query', {
                studentId: user?.id,
                title: newQueryTitle,
                body: newQueryBody
            });
            if (res.data.success) {
                setNewQueryTitle('');
                setNewQueryBody('');
                setShowQueryForm(false);
                fetchQueries();
            }
        } catch (e) { console.error(e); }
    };

    const handleVote = async (pollId: number, optionIndex: number) => {
        try {
            const res = await api.post(`/polls/${pollId}/vote`, {
                studentId: user?.id,
                optionIndex
            });
            if (res.data.success) {
                alert('Vote recorded!');
                setVoteStatus(prev => ({ ...prev, [pollId]: optionIndex }));
                fetchPollResults(pollId);
            } else {
                alert(res.data.message || 'Failed to vote');
            }
        } catch (e: any) {
            alert(e.response?.data?.message || 'Failed to vote');
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const res = await api.post(`/student/${encodeURIComponent(user?.id || '')}/change-password`, {
                oldPassword,
                newPassword
            });
            if (res.data.success) {
                alert('Password changed successfully!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowPasswordForm(false);
            } else {
                alert(res.data.message || 'Failed to change password');
            }
        } catch (e: any) {
            alert(e.response?.data?.message || 'Failed to change password');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-600 dark:text-neutral-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">Student Dashboard</h1>
                <button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh data"
                >
                    <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                </button>
            </div>

            {/* Profile Card */}
            <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-8 mb-8 text-white shadow-xl">
                <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                        {studentData?.first_name?.charAt(0) || 'S'}
                    </div>
                    <div className="flex-grow">
                        <h2 className="text-2xl font-bold mb-2">{studentData?.first_name || 'Student'}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>Roll: {studentData?.student_id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{studentData?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{studentData?.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                <span>{studentData?.department} - {studentData?.branch || ''} - Sem {studentData?.semester}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Lock className="w-4 h-4" />
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Change Form */}
            {showPasswordForm && (
                <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 mb-8 shadow-sm">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">Change Password</h2>
                    <form onSubmit={handleChangePassword} className="max-w-md">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Old Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={e => setOldPassword(e.target.value)}
                                    className="w-full p-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full p-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover">
                                    Update Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordForm(false)}
                                    className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded hover:bg-neutral-300 dark:hover:bg-neutral-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Semester Results */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        Semester {studentData?.semester} Results
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="p-4 text-left font-semibold text-neutral-600 dark:text-neutral-300">Subject Code</th>
                                <th className="p-4 text-left font-semibold text-neutral-600 dark:text-neutral-300">Subject Name</th>
                                <th className="p-4 text-center font-semibold text-neutral-600 dark:text-neutral-300">Marks</th>
                                <th className="p-4 text-center font-semibold text-neutral-600 dark:text-neutral-300">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-neutral-500">
                                        No subjects enrolled yet.
                                    </td>
                                </tr>
                            ) : (
                                subjects.map((subject: any) => (
                                    <tr key={subject.subject_id} className="border-b border-neutral-100 dark:border-neutral-800">
                                        <td className="p-4 font-mono text-primary dark:text-blue-400">{subject.subject_id}</td>
                                        <td className="p-4 text-neutral-800 dark:text-white">{subject.name || 'Subject Name'}</td>
                                        <td className="p-4 text-center">
                                            <span className="inline-block px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full font-mono font-semibold">
                                                {subject.marks !== null ? subject.marks : '--'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${subject.marks !== null
                                                ? (subject.marks >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {subject.marks !== null
                                                    ? (subject.marks >= 40 ? 'Pass' : 'Fail')
                                                    : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

                {/* Announcements */}
                <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-primary" />
                        Announcements
                    </h2>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {announcements.length === 0 ? (
                            <p className="text-neutral-500 text-center py-4">No announcements yet.</p>
                        ) : (
                            announcements.map((ann: any) => (
                                <div key={ann.id} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
                                    <h3 className="font-semibold text-neutral-800 dark:text-white">{ann.title}</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{ann.body}</p>
                                    <div className="flex justify-between items-center mt-2 text-xs text-neutral-500">
                                        <span>{ann.author}</span>
                                        <span>{new Date(ann.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Queries */}
                <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            My Queries
                        </h2>
                        <button
                            onClick={() => setShowQueryForm(!showQueryForm)}
                            className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {showQueryForm && (
                        <form onSubmit={handleSubmitQuery} className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                            <input
                                type="text"
                                placeholder="Subject"
                                className="w-full mb-2 p-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                                value={newQueryTitle}
                                onChange={e => setNewQueryTitle(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Your question..."
                                className="w-full mb-2 p-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                                rows={3}
                                value={newQueryBody}
                                onChange={e => setNewQueryBody(e.target.value)}
                                required
                            />
                            <button type="submit" className="w-full py-2 bg-primary text-white rounded hover:bg-primary/90">
                                Submit Query
                            </button>
                        </form>
                    )}

                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {queries.length === 0 ? (
                            <p className="text-neutral-500 text-center py-4">No queries submitted.</p>
                        ) : (
                            queries.map((q: any) => (
                                <div key={q.id} className="p-3 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-neutral-800 dark:text-white">{q.title}</h4>
                                        <span className={`text-xs px-2 py-1 rounded-full ${q.status === 'answered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {q.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1">{new Date(q.created_at).toLocaleDateString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Polls */}
                <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm lg:col-span-2">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2 mb-4">
                        <BarChart2 className="w-5 h-5 text-primary" />
                        Active Polls
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {polls.length === 0 ? (
                            <p className="text-neutral-500 py-4 col-span-2 text-center">No active polls available at the moment.</p>
                        ) : (
                            polls.map((poll: any) => {
                                // Check if user has already voted locally (simple check, ideally backend should tell us)
                                // For now, we rely on the user trying to vote and getting an error, or we could fetch vote status.
                                // Let's fetch vote status on load or just handle the "Already voted" error gracefully.
                                // Better UX: Fetch vote status for each poll.

                                return (
                                    <div key={poll.id} className="p-5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800/30">
                                        <h3 className="font-semibold text-lg mb-4 text-neutral-800 dark:text-white">{poll.question}</h3>
                                        <div className="space-y-3">
                                            {JSON.parse(poll.options).map((opt: string, idx: number) => {
                                                const hasVoted = voteStatus[poll.id] !== undefined;
                                                const isSelected = voteStatus[poll.id] === idx;
                                                const results = pollResults[poll.id];
                                                const totalVotes = results ? Object.values(results).reduce((a: any, b: any) => a + b, 0) as number : 0;
                                                const count = results ? (results[idx] || 0) : 0;
                                                const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : '0';

                                                return (
                                                    <div key={idx} className="mb-2">
                                                        <button
                                                            onClick={() => !hasVoted && handleVote(poll.id, idx)}
                                                            disabled={hasVoted}
                                                            className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center relative overflow-hidden ${hasVoted
                                                                ? isSelected
                                                                    ? 'bg-purple-50 border-purple-500 dark:bg-purple-900/20 dark:border-purple-500'
                                                                    : 'bg-neutral-100 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 opacity-70'
                                                                : 'bg-white dark:bg-neutral-800 hover:bg-primary/5 dark:hover:bg-primary/10 border-neutral-200 dark:border-neutral-700 hover:border-primary'
                                                                }`}
                                                        >
                                                            {hasVoted && (
                                                                <div
                                                                    className="absolute left-0 top-0 bottom-0 bg-purple-100 dark:bg-purple-900/30 transition-all duration-500"
                                                                    style={{ width: `${percentage}%`, zIndex: 0 }}
                                                                ></div>
                                                            )}
                                                            <div className="relative z-10 flex justify-between items-center w-full">
                                                                <span className={`font-medium ${isSelected ? 'text-purple-700 dark:text-purple-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                                                    {opt}
                                                                </span>
                                                                {hasVoted ? (
                                                                    <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                                                                        {percentage}% ({count})
                                                                    </span>
                                                                ) : (
                                                                    <div className="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-600 group-hover:border-primary"></div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-3 text-right">
                                            Posted on {new Date(poll.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentDashboard;
