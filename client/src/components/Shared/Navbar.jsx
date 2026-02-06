import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import AvatarDisplay from '../Profile/AvatarDisplay';
import { LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 z-50 flex items-center justify-between px-6 transition-colors duration-300">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StudyGenius
            </Link>

            <div className="flex items-center gap-4 sm:gap-6">
                {user ? (
                    <>
                        <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium" title="Dashboard">
                            <span className="hidden sm:inline">Dashboard</span>
                            <LayoutDashboard className="sm:hidden w-6 h-6" />
                        </Link>
                        <Link to="/profile" className="flex items-center gap-2">
                            <AvatarDisplay user={user} size="sm" />
                            <span className="hidden md:block font-medium text-gray-700 dark:text-gray-200">{user.fullName}</span>
                        </Link>
                        <ThemeToggle />
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Login</Link>
                        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors">Get Started</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
