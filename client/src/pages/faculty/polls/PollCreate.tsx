import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { ArrowLeft, Plus, X, Loader2, BarChart2 } from 'lucide-react';

const PollCreate: React.FC = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [loading, setLoading] = useState(false);

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validOptions = options.filter(opt => opt.trim());
        if (!question.trim() || validOptions.length < 2) {
            alert('Please provide a question and at least 2 options');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/poll', {
                question: question.trim(),
                options: validOptions
            });
            if (res.data.success) {
                alert('Poll created successfully!');
                navigate('/faculty/polls');
            }
        } catch (e: any) {
            console.error('Poll creation error:', e);
            alert(e.response?.data?.message || 'Failed to create poll. Please try again.');
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
                    <BarChart2 className="w-8 h-8 text-purple-600" />
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">Create New Poll</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Poll Question
                        </label>
                        <input
                            type="text"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            placeholder="What would you like to ask students?"
                            required
                            className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Options
                        </label>
                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={e => updateOption(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        required
                                        className="flex-1 p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg dark:text-white"
                                    />
                                    {options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addOption}
                            className="mt-3 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Option
                        </button>
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
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <BarChart2 className="w-5 h-5" />
                                    Create Poll
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PollCreate;
