import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, BarChart2, Users, FileText } from 'lucide-react';

const Landing: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-bg">
                {/* Abstract Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-black opacity-90"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl filter mix-blend-screen animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl filter mix-blend-screen animate-pulse delay-1000"></div>
                </div>

                <div className="container mx-auto px-4 z-10 relative text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src="/logo.jpg"
                            alt="RIZO Logo"
                            className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 object-contain"
                        />
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            RIZO
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-200 mb-8 font-light">
                            Online Exam Result Management Solution
                        </p>
                        <p className="text-sm text-gray-400 mb-2 uppercase tracking-widest">
                            Empowering Education Through Technology
                        </p>
                        <p className="text-xs text-white mb-12 italic">
                            Streamlining Academic Excellence
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-3xl mx-auto mb-12"
                    >
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Welcome to RIZO — a secure, lightweight, and powerful results management platform built to simplify student record keeping, marks entry, and semester-wise result viewing. Designed for colleges and training institutes, RIZO gives faculty a single interface to register students, enroll subjects, and enter marks — and gives students an easy-to-use view of their progress across semesters.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col md:flex-row gap-6 justify-center"
                    >
                        <Link
                            to="/login?role=faculty"
                            className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                        >
                            Faculty / Admin Login <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/login?role=student"
                            className="px-8 py-4 bg-transparent border-2 border-white/20 hover:bg-white/10 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            Student Login <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-2 bg-white/50 rounded-full"></div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-dark-card">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-primary" />}
                            title="Student Management"
                            description="Centralized student registration and profile management."
                        />
                        <FeatureCard
                            icon={<FileText className="w-8 h-8 text-accent" />}
                            title="Subject Enrollment"
                            description="Easy subject enrollment per semester & branch."
                        />
                        <FeatureCard
                            icon={<BarChart2 className="w-8 h-8 text-green-500" />}
                            title="Marks Entry"
                            description="Bulk/inline marks entry with CSV import/export."
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-red-500" />}
                            title="Secure Access"
                            description="Role-based access control for Faculty and Students."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-neutral-800 dark:text-white">{title}</h3>
        <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
);

export default Landing;
