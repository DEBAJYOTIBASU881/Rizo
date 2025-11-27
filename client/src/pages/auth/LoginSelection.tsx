import React from 'react';
import { Link } from 'react-router-dom';
import { UserCog, GraduationCap } from 'lucide-react';

const LoginSelection: React.FC = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                <Link to="/login/faculty" className="group relative overflow-hidden bg-white dark:bg-dark-card p-8 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary transition-all hover:shadow-2xl hover:shadow-primary/20">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UserCog className="w-32 h-32 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                            <UserCog className="w-8 h-8 text-primary group-hover:text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-neutral-800 dark:text-white">Faculty Login</h2>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Access student management, marks entry, and administrative tools.
                        </p>
                    </div>
                </Link>

                <Link to="/login/student" className="group relative overflow-hidden bg-white dark:bg-dark-card p-8 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:border-accent dark:hover:border-accent transition-all hover:shadow-2xl hover:shadow-accent/20">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <GraduationCap className="w-32 h-32 text-accent" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                            <GraduationCap className="w-8 h-8 text-accent group-hover:text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-neutral-800 dark:text-white">Student Login</h2>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            View your semester results, profile, and academic progress.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default LoginSelection;
