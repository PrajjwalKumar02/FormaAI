import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
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
    
    const { login, loginWithGoogle, loginWithFacebook, socialLoading } = useAuth();
    const navigate = useNavigate();

    // ============================================================
    // EMAIL LOGIN
    // ============================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
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

    // ============================================================
    // GOOGLE LOGIN
    // ============================================================
    const handleGoogleLogin = async () => {
        setError('');
        
        try {
            console.log('🔐 Starting Google login...');
            const result = await loginWithGoogle();
            console.log('📤 Google login result:', result);
            
            if (result.success) {
                console.log('✅ Google login successful!');
                navigate('/dashboard');
            } else {
                setError(result.error || 'Google login failed. Please try again.');
            }
        } catch (err) {
            console.error('❌ Google login error:', err);
            setError('An unexpected error occurred during Google login.');
        }
    };

    // ============================================================
    // FACEBOOK LOGIN
    // ============================================================
    const handleFacebookLogin = async () => {
        setError('');
        
        try {
            console.log('🔐 Starting Facebook login...');
            const result = await loginWithFacebook();
            console.log('📤 Facebook login result:', result);
            
            if (result.success) {
                console.log('✅ Facebook login successful!');
                navigate('/dashboard');
            } else {
                setError(result.error || 'Facebook login failed. Please try again.');
            }
        } catch (err) {
            console.error('❌ Facebook login error:', err);
            setError('An unexpected error occurred during Facebook login.');
        }
    };

    // ============================================================
    // RENDER
    // ============================================================
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
                    onClick={handleGoogleLogin}
                    disabled={socialLoading}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 ${
                        socialLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:shadow-md'
                    }`}
                >
                    <FcGoogle className="w-5 h-5" />
                    <span className="text-sm text-gray-700">
                        {socialLoading ? 'Loading...' : 'Google'}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={handleFacebookLogin}
                    disabled={socialLoading}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 ${
                        socialLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:shadow-md'
                    }`}
                >
                    <FaFacebook className="w-5 h-5 text-[#1877F2]" />
                    <span className="text-sm text-gray-700">
                        {socialLoading ? 'Loading...' : 'Facebook'}
                    </span>
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
