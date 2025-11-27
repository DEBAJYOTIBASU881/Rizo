import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Go back"
        >
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </button>
    );
};

export default BackButton;
