import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import BackButton from '../common/BackButton';
import api from '@/services/api';

const Navbar: React.FC = () => {
    const [isDark, setIsDark] = React.useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const [universityName, setUniversityName] = React.useState('RIZO');
    const location = useLocation();

    useEffect(() => {
        // Apply theme on mount
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Fetch university name
        api.get('/settings/university_name')
            .then(res => {
                if (res.data.success && res.data.value) {
                    setUniversityName(res.data.value);
                }
            })
            .catch(console.error);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const showBackButton = location.pathname !== '/' && location.pathname !== '/login';

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {showBackButton && <BackButton />}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">R</div>
                        <span className="text-xl font-heading font-bold text-primary dark:text-white">{universityName}</span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-white transition-colors">Home</Link>
                    <Link to="/about" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-white transition-colors">About</Link>
                    <Link to="/contact" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-white transition-colors">Contact</Link>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-neutral-600" />}
                    </button>
                    <Link to="/login" className="hidden md:block px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
