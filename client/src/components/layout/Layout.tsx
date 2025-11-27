import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Aurora from '../Aurora';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen relative">
            <div className="absolute inset-0 -z-10 w-full h-full">
                <Aurora
                    colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>
            <Navbar />
            <main className="flex-grow pt-16 relative z-10">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
