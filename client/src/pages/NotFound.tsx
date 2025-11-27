import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
            <p>Page not found.</p>
        </div>
    );
};

export default NotFound;
