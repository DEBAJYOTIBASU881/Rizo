import { Link } from 'react-router-dom';
import { Users, FileText, Activity, Plus, Edit, BookOpen, Settings, MessageSquare, BarChart2, Bell } from 'lucide-react';
import api from '@/services/api';
import React, { useState, useEffect } from 'react';

const FacultyDashboard: React.FC = () => {
    const [universityName, setUniversityName] = useState('');
    const [editingName, setEditingName] = useState(false);
    const [tempName, setTempName] = useState('');
    const [studentCount, setStudentCount] = useState(0);

    useEffect(() => {
        api.get('/settings/university_name')
            .then(res => {
                if (res.data.success && res.data.value) {
                    setUniversityName(res.data.value);
                    setTempName(res.data.value);
                }
            })
            .catch(console.error);

        // Fetch student count
        api.get('/students')
            .then(res => {
                if (res.data.success) {
                    setStudentCount(res.data.students.length);
                }
            })
            .catch(console.error);
    }, []);

    const handleSaveUniversityName = async () => {
        try {
            const res = await api.post('/settings/university_name', { value: tempName });
            if (res.data.success) {
                setUniversityName(tempName);
                setEditingName(false);
                alert('University name updated successfully!');
                // Trigger page reload to update Navbar
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
            alert('Failed to update university name');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">Faculty Dashboard</h1>
                <p className="text-neutral-600 dark:text-neutral-400">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Settings Card */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 mb-8 shadow-sm">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-primary" />
                    System Settings
                </h2>
                <div className="max-w-md">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        University Name
                    </label>
                    {editingName ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tempName}
                                onChange={e => setTempName(e.target.value)}
                                className="flex-1 p-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                            />
                            <button
                                onClick={handleSaveUniversityName}
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setEditingName(false);
                                    setTempName(universityName);
                                }}
                                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded hover:bg-neutral-300 dark:hover:bg-neutral-600"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <span className="text-neutral-800 dark:text-white font-medium">{universityName || 'RIZO University'}</span>
                            <button
                                onClick={() => setEditingName(true)}
                                className="px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <SummaryCard
                    icon={<Users className="w-8 h-8 text-blue-500" />}
                    title="Total Students"
                    value={studentCount.toString()}
                    trend="Currently enrolled"
                />
                <SummaryCard
                    icon={<FileText className="w-8 h-8 text-green-500" />}
                    title="Marks Entered"
                    value="85%"
                    trend="Pending for 3 subjects"
                />
                <SummaryCard
                    icon={<Activity className="w-8 h-8 text-purple-500" />}
                    title="System Status"
                    value="Online"
                    trend="All systems operational"
                />
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard
                    to="/faculty/students/create"
                    icon={<Plus className="w-6 h-6" />}
                    title="Enroll Student"
                    description="Register a new student and assign subjects."
                    color="bg-primary"
                />
                <ActionCard
                    to="/faculty/students"
                    icon={<Edit className="w-6 h-6" />}
                    title="Manage Students"
                    description="Update student details or remove records."
                    color="bg-blue-600"
                />
                <ActionCard
                    to="/faculty/marks"
                    icon={<BookOpen className="w-6 h-6" />}
                    title="Manage Marks"
                    description="Enter or update marks for subjects."
                    color="bg-accent"
                />
                <ActionCard
                    to="/faculty/queries"
                    icon={<MessageSquare className="w-6 h-6" />}
                    title="Answer Queries"
                    description="Respond to student questions and inquiries."
                    color="bg-green-600"
                />
                <ActionCard
                    to="/faculty/polls/create"
                    icon={<BarChart2 className="w-6 h-6" />}
                    title="Create Poll"
                    description="Launch a new poll for student feedback."
                    color="bg-purple-600"
                />
                <ActionCard
                    to="/faculty/announcements/create"
                    icon={<Bell className="w-6 h-6" />}
                    title="Post Announcement"
                    description="Share important news with all students."
                    color="bg-orange-600"
                />
            </div>
        </div>
    );
};

const SummaryCard: React.FC<{ icon: React.ReactNode; title: string; value: string; trend: string }> = ({ icon, title, value, trend }) => (
    <div className="p-6 bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                {icon}
            </div>
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                Today
            </span>
        </div>
        <h3 className="text-3xl font-bold text-neutral-800 dark:text-white mb-1">{value}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{title}</p>
        <p className="text-xs text-green-600 dark:text-green-400 font-medium">{trend}</p>
    </div>
);

const ActionCard: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string; color: string }> = ({ to, icon, title, description, color }) => (
    <Link to={to} className="group relative overflow-hidden p-6 bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary transition-all hover:shadow-lg">
        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color.replace('bg-', 'text-')}`}>
            {icon}
        </div>
        <div className={`w-12 h-12 ${color} text-white rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
    </Link>
);

export default FacultyDashboard;
