import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSend, FiTrash2, FiZap, FiClock, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useForm } from '../context/FormContext';
import { aiService } from '../services';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const AIInput = () => {
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showTips, setShowTips] = useState(true);
    const { setExtractedData, generateFormConfig } = useForm();
    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!inputText.trim()) {
            toast.warning('Please describe your incident first');
            return;
        }

        setIsProcessing(true);
        setProgress(0);

        try {
            // Show progress
            const steps = [
                { progress: 20, message: 'Analyzing text...' },
                { progress: 45, message: 'Extracting entities...' },
                { progress: 70, message: 'Structuring data...' },
                { progress: 90, message: 'Generating form...' },
                { progress: 100, message: 'Complete!' },
            ];

            for (const step of steps) {
                await new Promise(resolve => setTimeout(resolve, 400));
                setProgress(step.progress);
            }

            console.log('🔍 Sending to AI:', inputText.substring(0, 100) + '...');
            
            // ✅ Call AI Service
            const response = await aiService.extract(inputText);
            console.log('📥 Full AI Response:', response);

            // ✅ Extract data from response
            let extractedData = null;
            
            if (response.success && response.data) {
                extractedData = response.data;
            } else if (response.data) {
                extractedData = response.data;
            }
            
            if (extractedData && Object.keys(extractedData).length > 0) {
                console.log('✅ Extracted Data:', extractedData);
                
                // ✅ Save to context
                setExtractedData(extractedData);
                generateFormConfig(extractedData);
                
                // ✅ Save to localStorage
                const jsonData = JSON.stringify(extractedData);
                localStorage.setItem('extractedData', jsonData);
                console.log('✅ Saved to localStorage. Length:', jsonData.length);
                
                // ✅ Also save to sessionStorage as backup
                sessionStorage.setItem('extractedData', jsonData);
                
                toast.success('✅ AI extraction complete!');
                
                // ✅ Navigate with data
                setTimeout(() => {
                    navigate('/review', { 
                        state: { extractedData: extractedData } 
                    });
                }, 500);
            } else {
                console.error('❌ No extracted data found in response:', response);
                toast.error('No data extracted. Please try again.');
            }

        } catch (error) {
            console.error('❌ Processing Error:', error);
            toast.error(error.message || 'Error processing your request. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClear = () => {
        setInputText('');
        setProgress(0);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 text-sm font-medium mb-4"
                >
                    <FiZap className="w-4 h-4" />
                    <span>AI-Powered Form Generation</span>
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900">Describe Your Incident</h1>
                <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                    Write a detailed description and our AI will extract all information automatically.
                </p>
            </div>

            {showTips && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-6 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 border-blue-600/10">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                <div className="p-2 rounded-xl bg-blue-600/10 mt-1">
                                    <FiInfo className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Tips for better results</h4>
                                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                        <li className="flex items-center space-x-2">
                                            <FiCheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Include <strong>date, time, and location</strong></span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <FiCheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Mention <strong>police and FIR details</strong></span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <FiCheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Add <strong>insurance and claim information</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <button onClick={() => setShowTips(false)} className="text-gray-400 hover:text-gray-600">
                                <FiAlertCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </Card>
                </motion.div>
            )}

            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                            Incident Description <span className="text-red-500">*</span>
                        </label>
                        <span className="text-xs text-gray-400">{inputText.length} characters</span>
                    </div>

                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={`Describe your incident in detail...

Include:
📅 Date & Time
📍 Location
🚗 Vehicle details (if any)
📄 Police & FIR details
🏥 Insurance information
💰 Estimated damages/loss`}
                        className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300 outline-none resize-none text-gray-900 placeholder-gray-400"
                    />

                    <div className="flex flex-wrap gap-3">
                        <Button onClick={handleClear} variant="ghost" size="sm" disabled={isProcessing || !inputText}>
                            <FiTrash2 className="mr-2" />
                            Clear
                        </Button>
                    </div>
                </div>
            </Card>

            {isProcessing && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <Loader size="sm" />
                                <span className="text-sm font-medium text-gray-700">Processing your description...</span>
                            </div>
                            <span className="text-sm font-semibold text-blue-600">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-2">
                            {['Analyzing', 'Extracting', 'Structuring', 'Generating'].map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className={`w-2 h-2 mx-auto rounded-full ${progress > index * 25 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                                    <p className="text-xs text-gray-500 mt-1">{step}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleGenerate}
                    disabled={isProcessing || !inputText.trim()}
                    className="shadow-lg shadow-blue-500/25"
                >
                    {isProcessing ? 'Processing...' : (
                        <>
                            <FiSend className="mr-2" />
                            Generate Form
                        </>
                    )}
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={() => navigate('/dashboard')}
                    disabled={isProcessing}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default AIInput;
