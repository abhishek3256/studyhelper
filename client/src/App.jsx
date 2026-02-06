import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import Navbar from './components/Shared/Navbar';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import NotesViewer from './components/Notes/NotesViewer';
import ProfileView from './components/Profile/ProfileView';
import useAuth from './hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center dark:bg-slate-900 dark:text-white">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
                        <Navbar />
                        <Routes>
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<SignupForm />} />
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <DashboardLayout />
                                </ProtectedRoute>
                            } />
                            <Route path="/notes/:syllabusId" element={
                                <ProtectedRoute>
                                    <NotesViewer />
                                </ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <ProfileView />
                                </ProtectedRoute>
                            } />
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </div>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
