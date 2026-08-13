import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { FormProvider } from './context/FormContext';
import { useTokenRefresh } from './hooks/useTokenRefresh';
// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AI_Input from './pages/AI_Input';
import Analytics from './pages/Analytics';
import Review from './pages/Review';
import Dynamic_Form from './pages/Dynamic_Form';
import Success from './pages/Success';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Forms from './pages/Forms';
import FormDetails from './pages/FormDetails';
import IncidentDetail from './pages/IncidentDetail';
import NotFound from './pages/NotFound';

//  AppContent with token refresh
const AppContent = () => {
    //  Auto-refresh token every 5 minutes
    useTokenRefresh({
        interval: 5 * 60 * 1000,
        onTokenExpired: () => {
            console.log('⏰ Token expired');
        },
        onTokenRefreshed: () => {
            console.log('✅ Token refreshed');
        }
    });

    return (
        <AnimatePresence mode="wait">
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ai-input" element={<AI_Input />} />
                    <Route path="/review" element={<Review />} />
                    <Route path="/form" element={<Dynamic_Form />} />
                    <Route path="/form/:id" element={<FormDetails />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/forms" element={<Forms />} />
                    <Route path="/incident/:id" element={<IncidentDetail />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <FormProvider>
                    <AppContent />
                    <ToastContainer 
                        position="top-right" 
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </FormProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
