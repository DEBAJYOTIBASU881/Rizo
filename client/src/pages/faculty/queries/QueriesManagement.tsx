import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { ArrowLeft, MessageSquare, Send, Loader2 } from 'lucide-react';

const QueriesManagement: React.FC = () => {
    const navigate = useNavigate();
    const [queries, setQueries] = useState<any[]>([]);
    const [selectedQuery, setSelectedQuery] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [responseText, setResponseText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const res = await api.get('/queries');
            if (res.data.success) {
                setQueries(res.data.queries);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchQueryDetails = async (queryId: number) => {
        try {
            const res = await api.get(`/query/${queryId}`);
            if (res.data.success) {
                setSelectedQuery(res.data.query);
                setMessages(res.data.messages);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSendResponse = async () => {
        if (!responseText.trim() || !selectedQuery) return;

        setSending(true);
        try {
            const res = await api.post(`/query/${selectedQuery.id}/respond`, {
                facultyId: 'faculty',
                body: responseText
            });
            if (res.data.success) {
                setResponseText('');
                fetchQueryDetails(selectedQuery.id);
                fetchQueries();
            }
        } catch (e) {
            alert('Failed to send response');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-8">Student Queries</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Queries List */}
                    <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">All Queries</h2>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {queries.length === 0 ? (
                                <p className="text-neutral-500 text-center py-8">No queries yet.</p>
                            ) : (
                                queries.map(q => (
                                    <div
                                        key={q.id}
                                        onClick={() => fetchQueryDetails(q.id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedQuery?.id === q.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-neutral-800 dark:text-white">{q.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${q.status === 'answered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {q.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-500">Student: {q.student_id}</p>
                                        <p className="text-xs text-neutral-400 mt-1">{new Date(q.created_at).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Query Details */}
                    <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm">
                        {selectedQuery ? (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">{selectedQuery.title}</h2>
                                    <p className="text-sm text-neutral-500">Student: {selectedQuery.student_id}</p>
                                </div>

                                {/* Messages */}
                                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`p-4 rounded-lg ${msg.sender === 'student'
                                                ? 'bg-neutral-100 dark:bg-neutral-800'
                                                : 'bg-primary/10'
                                            }`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium text-sm text-neutral-800 dark:text-white">
                                                    {msg.sender === 'student' ? 'Student' : 'Faculty'}
                                                </span>
                                                <span className="text-xs text-neutral-500">{new Date(msg.created_at).toLocaleString()}</span>
                                            </div>
                                            <p className="text-neutral-700 dark:text-neutral-300">{msg.body}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Response Form */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Your Response</label>
                                    <textarea
                                        value={responseText}
                                        onChange={e => setResponseText(e.target.value)}
                                        placeholder="Type your response here..."
                                        rows={4}
                                        className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 dark:text-white"
                                    />
                                    <button
                                        onClick={handleSendResponse}
                                        disabled={sending || !responseText.trim()}
                                        className="mt-3 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        Send Response
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                                <MessageSquare className="w-16 h-16 mb-4" />
                                <p>Select a query to view details and respond</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueriesManagement;
