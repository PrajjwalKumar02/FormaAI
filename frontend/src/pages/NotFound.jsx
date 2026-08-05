import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import Button from '../components/Button'; 
import Card from '../components/Card'; 

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <Card className="p-8 text-center">
                    {/* 404 Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-red-100 rounded-full">
                            <FiAlertCircle className="w-16 h-16 text-red-600" />
                        </div>
                    </div>

                    {/* Error Code */}
                    <h1 className="text-7xl font-bold text-gray-900 mb-2">404</h1>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link to="/dashboard">
                            <Button variant="primary" fullWidth>
                                <FiHome className="mr-2" />
                                Go to Dashboard
                            </Button>
                        </Link>
                        <Button 
                            variant="outline" 
                            fullWidth
                            onClick={() => navigate(-1)}
                        >
                            <FiArrowLeft className="mr-2" />
                            Go Back
                        </Button>
                    </div>

                    {/* Help Section */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl text-left">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Need help finding something?
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Check the URL for typos</li>
                            <li>• Return to the dashboard</li>
                            <li>• Contact support if you need assistance</li>
                        </ul>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default NotFound;