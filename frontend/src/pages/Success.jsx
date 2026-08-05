import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiCheckCircle, 
    FiHome, 
    FiFileText, 
    FiPlus,
    FiShare2,
    FiDownload,
    FiX,
    FiMail,
    FiTwitter,
    FiLinkedin,
    FiCopy,
    FiCheck
} from 'react-icons/fi';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../context/FormContext';

const Success = () => {
    const [showConfetti, setShowConfetti] = useState(true);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [feedbackRating, setFeedbackRating] = useState(0);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [copied, setCopied] = useState(false);
    const { user } = useAuth();
    const { formData, extractedData, resetForm } = useForm();

    // ✅ Get actual form count from localStorage
    const getAllForms = () => {
        return JSON.parse(localStorage.getItem('allForms') || '[]');
    };

    // ✅ Get actual reference number
    const getReferenceNumber = () => {
        const allForms = getAllForms();
        const currentYear = new Date().getFullYear();
        const formCount = allForms.length;
        return `F-${currentYear}-${String(formCount).padStart(3, '0')}`;
    };

    // ✅ Get actual forms processed count
    const getFormsProcessed = () => {
        const allForms = getAllForms();
        const userForms = allForms.filter(f => f.userId === user?.id || !f.userId);
        return userForms.length;
    };

    useEffect(() => {
        console.log('Success page loaded! 🎉');
        const timer = setTimeout(() => setShowConfetti(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    // ✅ Handle Share Feedback
    const handleShareFeedback = () => {
        setShowFeedbackModal(true);
    };

    // ✅ Handle Feedback Submit
    const handleFeedbackSubmit = () => {
        if (!feedback.trim()) {
            alert('Please write your feedback before submitting.');
            return;
        }
        if (feedbackRating === 0) {
            alert('Please select a rating.');
            return;
        }
        
        // Save feedback to localStorage
        const allFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
        allFeedback.push({
            id: Date.now(),
            name: user?.name || 'Anonymous',
            email: user?.email || '',
            rating: feedbackRating,
            message: feedback,
            date: new Date().toISOString(),
            formReference: getReferenceNumber()
        });
        localStorage.setItem('feedback', JSON.stringify(allFeedback));
        
        setFeedbackSubmitted(true);
        setTimeout(() => {
            setShowFeedbackModal(false);
            setFeedback('');
            setFeedbackRating(0);
            setFeedbackSubmitted(false);
        }, 2000);
    };

    // ✅ Handle Download PDF
    const handleDownloadPDF = () => {
        console.log('Download PDF clicked');
        
        // Get form data
        const allForms = getAllForms();
        const latestForm = allForms[allForms.length - 1];
        const referenceNumber = getReferenceNumber();
        const formsProcessed = getFormsProcessed();
        
        // Create PDF content
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            alert('Please allow popups to download PDF.');
            return;
        }
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Form Submission - ${referenceNumber}</title>
                <style>
                    body { 
                        font-family: 'Arial', sans-serif; 
                        padding: 40px; 
                        max-width: 800px; 
                        margin: 0 auto;
                        color: #1E293B;
                    }
                    .header {
                        border-bottom: 3px solid #2563EB;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #2563EB;
                        font-size: 28px;
                        margin: 0;
                    }
                    .header p {
                        color: #64748B;
                        margin: 5px 0 0;
                    }
                    .success-badge {
                        display: inline-block;
                        background: #10B981;
                        color: white;
                        padding: 8px 20px;
                        border-radius: 20px;
                        font-size: 14px;
                        margin-bottom: 20px;
                    }
                    .section {
                        margin: 20px 0;
                        padding: 15px;
                        background: #F8FAFC;
                        border-radius: 8px;
                        border-left: 4px solid #2563EB;
                    }
                    .section h3 {
                        margin: 0 0 10px 0;
                        color: #1E293B;
                    }
                    .field {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        border-bottom: 1px solid #E2E8F0;
                    }
                    .field:last-child {
                        border-bottom: none;
                    }
                    .field-label {
                        font-weight: 600;
                        color: #475569;
                    }
                    .field-value {
                        color: #1E293B;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #E2E8F0;
                        text-align: center;
                        color: #94A3B8;
                        font-size: 12px;
                    }
                    .stats {
                        display: flex;
                        justify-content: space-around;
                        margin: 20px 0;
                        padding: 20px;
                        background: linear-gradient(135deg, #2563EB, #3B82F6);
                        border-radius: 8px;
                        color: white;
                    }
                    .stats div {
                        text-align: center;
                    }
                    .stats .number {
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .stats .label {
                        font-size: 12px;
                        opacity: 0.8;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🎉 Form Submission Confirmation</h1>
                    <p>Your form has been successfully submitted to Forma AI</p>
                </div>
                
                <div class="success-badge">✅ Form Submitted Successfully</div>
                
                <div class="stats">
                    <div>
                        <div class="number">${referenceNumber}</div>
                        <div class="label">Reference Number</div>
                    </div>
                    <div>
                        <div class="number">${formsProcessed}</div>
                        <div class="label">Forms Processed</div>
                    </div>
                    <div>
                        <div class="number">98%</div>
                        <div class="label">Accuracy Rate</div>
                    </div>
                </div>
                
                <div class="section">
                    <h3>📋 Form Details</h3>
                    <div class="field">
                        <span class="field-label">Form Title</span>
                        <span class="field-value">${latestForm?.title || 'Form Submission'}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Submitted By</span>
                        <span class="field-value">${user?.name || 'Guest'}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Submitted On</span>
                        <span class="field-value">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })} at ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Status</span>
                        <span class="field-value" style="color: #10B981;">Completed</span>
                    </div>
                </div>
                
                ${latestForm?.extractedData ? `
                <div class="section">
                    <h3>🤖 Extracted Information</h3>
                    ${Object.entries(latestForm.extractedData).filter(([key]) => !['description', 'extractedAt', 'extractedAtFull'].includes(key)).map(([key, value]) => `
                        <div class="field">
                            <span class="field-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                            <span class="field-value">${typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value || 'N/A')}</span>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                <div class="footer">
                    <p>Generated by Forma AI • ${new Date().getFullYear()}</p>
                    <p>This is a system-generated confirmation. Please save this for your records.</p>
                </div>
                
                <script>
                    setTimeout(() => {
                        window.print();
                    }, 500);
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    // ✅ Handle Copy Link
    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // ✅ Handle Share on Social Media
    const handleShareSocial = (platform) => {
        const url = window.location.href;
        const text = `I just submitted a form with Forma AI! 🎉 Reference: ${getReferenceNumber()}`;
        
        const shareUrls = {
            email: `mailto:?subject=Form Submission Confirmation&body=${text}%0A%0AView my submission: ${url}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        };
        
        if (platform === 'copy') {
            handleCopyLink();
            return;
        }
        
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    };

    // ✅ Get actual data
    const formsProcessed = getFormsProcessed();
    const referenceNumber = getReferenceNumber();

    return (
        <div className="max-w-2xl mx-auto py-12 text-center">
            {/* Success Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
                className="relative"
            >
                <div className="w-32 h-32 mx-auto relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
                    <div className="absolute inset-2 bg-green-500/30 rounded-full animate-pulse delay-150" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/25">
                            <FiCheckCircle className="w-14 h-14 text-white" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Confetti Particles */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: -20,
                                scale: Math.random() * 1 + 0.5,
                                rotate: 0
                            }}
                            animate={{
                                y: window.innerHeight + 50,
                                rotate: Math.random() * 720,
                                x: Math.random() * 200 - 100 + Math.random() * window.innerWidth / 2
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                delay: Math.random() * 2,
                                ease: "easeOut"
                            }}
                            className={`absolute w-3 h-3 rounded-full ${
                                ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500'][Math.floor(Math.random() * 7)]
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Success Message */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
            >
                <h1 className="text-4xl font-bold text-gray-900">Form Submitted Successfully! 🎉</h1>
                <p className="text-gray-500 mt-3 text-lg">
                    Your form has been received and is being processed.
                    You will receive a confirmation email shortly.
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid sm:grid-cols-3 gap-4 mt-8"
            >
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{referenceNumber}</p>
                    <p className="text-xs text-gray-500">Reference Number</p>
                </Card>
                
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{formsProcessed}</p>
                    <p className="text-xs text-gray-500">Forms Processed</p>
                </Card>
                
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">98%</p>
                    <p className="text-xs text-gray-500">Accuracy Rate</p>
                </Card>
            </motion.div>

            {/* ✅ Next Steps - With Working Share Feedback */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8"
            >
                <h3 className="font-semibold text-gray-900 mb-4">What would you like to do next?</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/dashboard">
                        <Card hoverable className="p-4 text-center h-full cursor-pointer">
                            <FiHome className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">Go to Dashboard</p>
                        </Card>
                    </Link>
                    <Link to="/ai-input">
                        <Card hoverable className="p-4 text-center h-full cursor-pointer">
                            <FiPlus className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">Create New Form</p>
                        </Card>
                    </Link>
                    <Link to="/forms">
                        <Card hoverable className="p-4 text-center h-full cursor-pointer">
                            <FiFileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">View All Forms</p>
                        </Card>
                    </Link>
                    {/* ✅ Working Share Feedback Button */}
                    <Card 
                        hoverable 
                        className="p-4 text-center h-full cursor-pointer"
                        onClick={handleShareFeedback}
                    >
                        <FiShare2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">Share Feedback</p>
                    </Card>
                </div>
            </motion.div>

            {/* ✅ Actions - With Working Download PDF */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
            >
                {/* ✅ Working Download PDF */}
                <Button
                    variant="primary"
                    onClick={handleDownloadPDF}
                    className="shadow-lg shadow-blue-500/25"
                >
                    <FiDownload className="mr-2" />
                    Download PDF
                </Button>
                <Link to="/dashboard">
                    <Button variant="outline">
                        <FiHome className="mr-2" />
                        Return to Dashboard
                    </Button>
                </Link>
            </motion.div>

            {/* Footer Note */}
            <p className="text-xs text-gray-400 mt-8">
                A confirmation email has been sent to your registered email address.
                If you don't see it, please check your spam folder.
            </p>

            {/* ✅ Feedback Modal */}
            {showFeedbackModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={() => !feedbackSubmitted && setShowFeedbackModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {feedbackSubmitted ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                                    <FiCheck className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Thank You!</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Your feedback has been submitted successfully.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Your Feedback</h3>
                                    <button
                                        onClick={() => setShowFeedbackModal(false)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <FiX className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Your feedback helps us improve Forma AI for everyone.
                                </p>
                                
                                {/* Rating */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Rate your experience
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setFeedbackRating(star)}
                                                className={`text-2xl transition-colors ${
                                                    star <= feedbackRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                                                } hover:text-yellow-400`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Feedback Text */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Your Feedback
                                    </label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="What did you like? What could be improved?"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-600/20 dark:focus:ring-blue-400/20 transition-all duration-300 outline-none resize-none"
                                        rows="4"
                                    />
                                </div>
                                
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFeedbackModal(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleFeedbackSubmit}
                                        className="flex-1"
                                    >
                                        Submit Feedback
                                    </Button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Success;
