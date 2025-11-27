import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-dark-card border-t border-neutral-200 dark:border-neutral-700 py-8">
            <div className="container mx-auto px-4 text-center">
                <p className="text-neutral-600 dark:text-neutral-400">
                    &copy; {new Date().getFullYear()} RIZO. Developed by DEBAJYOTI BASU & ABHIJIT KUNAR.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
