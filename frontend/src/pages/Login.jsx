import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // ✅ Trim email to remove spaces
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        
        if (!trimmedEmail || !trimmedPassword) {
            setError('Please fill in all fields');
            return;
        }
        
        console.log('🔑 Attempting login with:', { email: trimmedEmail });
        
        setIsLoading(true);
        
        try {
            const result = await login(trimmedEmail, trimmedPassword);
            console.log('📤 Login result:', result);
            
            if (result.success) {
                console.log('✅ Login successful!');
                navigate('/dashboard');
            } else {
                setError(result.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('❌ Login error:', err);
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-500 mt-2">Sign in to continue to your dashboard</p>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                >
                    {error}
                </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={FiMail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    icon={FiLock}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    
                    <button
                        type="button"
                        onClick={() => {
                            console.log('Forgot password clicked');
                            alert('🔑 Password reset link will be sent to your email.');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Forgot password?
                    </button>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    className="shadow-lg shadow-blue-500/25"
                >
                    Sign In
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/70 text-gray-500">Or continue with</span>
                </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => {
                        console.log('Google Login clicked');
                        alert('🔐 Google Login coming soon!\n\nWe\'re integrating Google authentication.');
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm text-gray-700">Google</span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        console.log('Facebook Login clicked');
                        alert('🔐 Facebook Login coming soon!\n\nWe\'re integrating Facebook authentication.');
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-sm text-gray-700">Facebook</span>
                </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <button
                    onClick={() => {
                        console.log('Sign up free clicked - navigating to register');
                        navigate('/register');
                    }}
                    className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                    Sign up free
                </button>
            </p>
        </div>
    );
};

export default Login;
