import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { ArrowLeft, BarChart2, Users, TrendingUp, Eye, Power, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface PollResult {
    option: string;
    index: number;
    count: number;
    voters: {
        studentId: string;
        studentName: string;
        votedAt: string;
    }[];
}

interface PollDetails {
    id: number;
    question: string;
    options: string;
    active: boolean;
    created_at: string;
}

const PollsManagement: React.FC = () => {
    const navigate = useNavigate();
    const [polls, setPolls] = useState<PollDetails[]>([]);
    const [selectedPoll, setSelectedPoll] = useState<number | null>(null);
    const [pollResults, setPollResults] = useState<PollResult[]>([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [resultsLoading, setResultsLoading] = useState(false);

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const res = await api.get('/polls/all');
            if (res.data.success) {
                setPolls(res.data.polls);
            }
        } catch (error) {
            console.error('Failed to fetch polls', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPollDetails = async (pollId: number) => {
        setResultsLoading(true);
        try {
            const res = await api.get(`/polls/${pollId}/detailed-results`);
            if (res.data.success) {
                setPollResults(res.data.results);
                setTotalVotes(res.data.totalVotes);
                setSelectedPoll(pollId);
            }
        } catch (error) {
            console.error('Failed to fetch poll details', error);
            alert('Failed to load poll results');
        } finally {
            setResultsLoading(false);
        }
    };

    const togglePollStatus = async (pollId: number) => {
        try {
            const res = await api.post(`/polls/${pollId}/toggle-active`);
            if (res.data.success) {
                // Update local state
                setPolls(polls.map(p =>
                    p.id === pollId ? { ...p, active: res.data.active } : p
                ));
                alert(`Poll ${res.data.active ? 'activated' : 'deactivated'} successfully!`);
            }
        } catch (error) {
            console.error('Failed to toggle poll status', error);
            alert('Failed to update poll status');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-neutral-600 dark:text-neutral-400">Loading polls...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">Polls Management</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">View and manage all polls and their results</p>
                </div>
                <button
                    onClick={() => navigate('/faculty/polls/create')}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2"
                >
                    <BarChart2 className="w-5 h-5" />
                    Create New Poll
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Polls List */}
                <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-purple-600" />
                        All Polls ({polls.length})
                    </h2>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {polls.length === 0 ? (
                            <p className="text-neutral-500 text-center py-8">No polls created yet.</p>
                        ) : (
                            polls.map((poll) => (
                                <div
                                    key={poll.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPoll === poll.id
                                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-neutral-200 dark:border-neutral-700 hover:border-purple-400'
                                        }`}
                                    onClick={() => fetchPollDetails(poll.id)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-neutral-800 dark:text-white pr-4">
                                            {poll.question}
                                        </h3>
                                        <span
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${poll.active
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                        >
                                            {poll.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {poll.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-neutral-500">
                                            Created: {new Date(poll.created_at).toLocaleDateString()}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePollStatus(poll.id);
                                            }}
                                            className={`p-1.5 rounded transition-colors ${poll.active
                                                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50'
                                                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50'
                                                }`}
                                            title={poll.active ? 'Deactivate poll' : 'Activate poll'}
                                        >
                                            <Power className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Poll Results */}
                <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Poll Results
                    </h2>

                    {resultsLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        </div>
                    ) : selectedPoll === null ? (
                        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                            <Eye className="w-16 h-16 mb-4 opacity-50" />
                            <p>Select a poll to view results</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    <span className="font-semibold text-neutral-800 dark:text-white">Total Votes:</span>
                                </div>
                                <span className="text-2xl font-bold text-primary">{totalVotes}</span>
                            </div>

                            <div className="space-y-4">
                                {pollResults.map((result) => {
                                    const percentage = totalVotes > 0 ? ((result.count / totalVotes) * 100).toFixed(1) : 0;
                                    return (
                                        <div key={result.index} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="font-semibold text-neutral-800 dark:text-white">{result.option}</h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        {result.count} votes
                                                    </span>
                                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-bold">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-3">
                                                <div
                                                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>

                                            {/* Voters List Removed as per requirements */}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PollsManagement;
