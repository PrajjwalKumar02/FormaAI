import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

const OAuthCallback = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { handleGoogleCallback, handleFacebookCallback } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const code = params.get('code');
                const provider = params.get('provider') || 'google';

                if (!code) {
                    setError('No authorization code received');
                    setLoading(false);
                    return;
                }

                let result;
                if (provider === 'google') {
                    result = await handleGoogleCallback(code);
                } else if (provider === 'facebook') {
                    result = await handleFacebookCallback(code);
                } else {
                    setError('Unknown provider');
                    setLoading(false);
                    return;
                }

                if (result.success) {
                    navigate('/dashboard');
                } else {
                    setError(result.error || 'Authentication failed');
                    setLoading(false);
                }
            } catch (err) {
                setError(err.message || 'Authentication failed');
                setLoading(false);
            }
        };

        handleCallback();
    }, [location, navigate, handleGoogleCallback, handleFacebookCallback]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="mt-4 text-gray-600">Authenticating...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default OAuthCallback;
