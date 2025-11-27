import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { ArrowLeft, Bell, Loader2 } from 'lucide-react';

const AnnouncementCreate: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('Faculty Admin');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !body.trim()) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/announcement', {
                title: title.trim(),
                body: body.trim(),
                author: author.trim()
            });
            if (res.data.success) {
                alert('Announcement posted successfully!');
                navigate('/faculty/dashboard');
            }
        } catch (e: any) {
            alert(e.response?.data?.message || 'Failed to post announcement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="max-w-2xl mx-auto bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-8 h-8 text-orange-600" />
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">Create Announcement</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Announcement title"
                            required
                            className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Message
                        </label>
                        <textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            placeholder="Write your announcement message here..."
                            rows={8}
                            required
                            className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Author
                        </label>
                        <input
                            type="text"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            placeholder="Your name"
                            required
                            className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold shadow-lg shadow-orange-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Bell className="w-5 h-5" />
                                    Post Announcement
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnnouncementCreate;
