// src/pages/Review.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiCheckCircle, 
    FiEdit, 
    FiSend, 
    FiArrowLeft,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiClock,
    FiFileText,
    FiAlertCircle,
    FiCheck,
    FiUsers,
    FiPackage,
    FiInfo,
    FiHome,
    FiShield,
    FiBook,
    FiDollarSign,
    FiHeart,
    FiCamera,
    FiTool,
    FiBriefcase,
    FiTrendingUp
} from 'react-icons/fi';
import { useForm } from '../context/FormContext';
import Button from '../components/Button';
import Card from '../components/Card';

const Review = () => {
    const { formData, extractedData, resetForm } = useForm();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const reviewData = { ...extractedData, ...formData };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setShowSuccess(true);
            
            const allForms = JSON.parse(localStorage.getItem('allForms') || '[]');
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const newForm = {
                id: Date.now(),
                title: reviewData.incidentType || 'Form Submission',
                date: new Date().toISOString().split('T')[0],
                status: 'Completed',
                data: reviewData,
                extractedData: extractedData,
                userId: user?.id || 'unknown',
                userName: user?.name || 'Guest',
                reference: `F-${new Date().getFullYear()}-${String(allForms.length + 1).padStart(3, '0')}`,
                submittedAt: new Date().toISOString()
            };
            allForms.push(newForm);
            localStorage.setItem('allForms', JSON.stringify(allForms));
            
            const currentCount = parseInt(localStorage.getItem('formCount') || '0');
            localStorage.setItem('formCount', (currentCount + 1).toString());
            
            setTimeout(() => {
                resetForm();
                navigate('/success');
            }, 1500);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = () => navigate('/form');
    const handleBack = () => navigate('/ai-input');

    const getFieldIcon = (key) => {
        const icons = {
            ownerName: FiUser,
            age: FiUser,
            phone: FiPhone,
            email: FiMail,
            address: FiHome,
            occupation: FiBriefcase,
            employer: FiBriefcase,
            incidentType: FiAlertCircle,
            date: FiCalendar,
            time: FiClock,
            location: FiMapPin,
            severity: FiInfo,
            vehicle: FiPackage,
            vehicleNumber: FiPackage,
            policeReport: FiShield,
            firNumber: FiBook,
            policeStation: FiMapPin,
            policeCharges: FiBook,
            insuranceCompany: FiShield,
            policyNumber: FiFileText,
            claimNumber: FiFileText,
            claimType: FiFileText,
            policyType: FiFileText,
            estimatedLoss: FiDollarSign,
            hospital: FiHome,
            doctor: FiUser,
            injuries: FiHeart,
            witnesses: FiUsers,
            evidence: FiCamera,
            extractedAt: FiClock,
        };
        return icons[key] || FiFileText;
    };

    const formatLabel = (key) => {
        const labels = {
            ownerName: 'Owner Name',
            age: 'Age',
            phone: 'Phone Number',
            email: 'Email Address',
            address: 'Address',
            occupation: 'Occupation',
            employer: 'Employer',
            incidentType: 'Incident Type',
            date: 'Date of Incident',
            time: 'Time of Incident',
            location: 'Location',
            severity: 'Severity',
            vehicle: 'Vehicle',
            vehicleNumber: 'Vehicle Number',
            policeReport: 'Police Report Filed',
            firNumber: 'FIR Number',
            policeStation: 'Police Station',
            policeCharges: 'Police Charges',
            insuranceCompany: 'Insurance Company',
            policyNumber: 'Policy Number',
            claimNumber: 'Claim Number',
            claimType: 'Claim Type',
            policyType: 'Policy Type',
            estimatedLoss: 'Estimated Loss',
            hospital: 'Hospital',
            doctor: 'Doctor',
            injuries: 'Injuries',
            witnesses: 'Witnesses',
            evidence: 'Evidence',
            extractedAt: 'Extracted At',
        };
        return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    const renderValue = (value) => {
        if (value === null || value === undefined) return 'Not provided';
        if (typeof value === 'boolean') return value ? 'Yes ✅' : 'No ❌';
        if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'None';
        if (typeof value === 'object' && value !== null) {
            if (Object.keys(value).length === 0) return 'None';
            return JSON.stringify(value, null, 2);
        }
        if (typeof value === 'string' && value.trim() === '') return 'Not provided';
        return value;
    };

    const displayFields = [
        { key: 'ownerName', label: 'Owner Name' },
        { key: 'age', label: 'Age' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'email', label: 'Email Address' },
        { key: 'address', label: 'Address' },
        { key: 'occupation', label: 'Occupation' },
        { key: 'employer', label: 'Employer' },
        { key: 'incidentType', label: 'Incident Type' },
        { key: 'date', label: 'Date of Incident' },
        { key: 'time', label: 'Time of Incident' },
        { key: 'location', label: 'Location' },
        { key: 'severity', label: 'Severity' },
        { key: 'vehicle', label: 'Vehicle' },
        { key: 'vehicleNumber', label: 'Vehicle Number' },
        { key: 'policeReport', label: 'Police Report Filed' },
        { key: 'firNumber', label: 'FIR Number' },
        { key: 'policeStation', label: 'Police Station' },
        { key: 'policeCharges', label: 'Police Charges' },
        { key: 'insuranceCompany', label: 'Insurance Company' },
        { key: 'policyNumber', label: 'Policy Number' },
        { key: 'claimNumber', label: 'Claim Number' },
        { key: 'claimType', label: 'Claim Type' },
        { key: 'policyType', label: 'Policy Type' },
        { key: 'estimatedLoss', label: 'Estimated Loss' },
        { key: 'hospital', label: 'Hospital' },
        { key: 'doctor', label: 'Doctor' },
        { key: 'injuries', label: 'Injuries' },
        { key: 'witnesses', label: 'Witnesses' },
        { key: 'evidence', label: 'Evidence' },
        { key: 'extractedAt', label: 'Extracted At' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 text-sm font-medium mb-4"
                >
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Review Extracted Information</span>
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900">Review & Submit</h1>
                <p className="text-gray-500 mt-2">
                    AI has extracted all information from your description. Review and submit.
                </p>
            </div>

            {/* Description */}
            {reviewData.description && (
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-start gap-3">
                        <FiFileText className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Your Description</h3>
                            <p className="text-gray-700 text-sm leading-relaxed mt-1 wrap-break-word">
                                {reviewData.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* All Extracted Data Cards */}
            <div className="grid md:grid-cols-2 gap-4">
                {displayFields.map((field) => {
                    const value = reviewData[field.key];
                    const displayValue = renderValue(value);
                    
                    return (
                        <motion.div
                            key={field.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-blue-600/10 mt-0.5">
                                    {React.createElement(getFieldIcon(field.key), { className: "w-4 h-4 text-blue-600" })}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {field.label}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 mt-1 wrap-break-word">
                                        {displayValue}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Extracted At */}
            {reviewData.extractedAt && (
                <div className="text-center text-sm text-gray-400">
                    <FiClock className="inline mr-2" />
                    Extracted on: {reviewData.extractedAt}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                    <FiArrowLeft className="mr-2" />
                    Back to Input
                </Button>
                <div className="flex-1" />
                <Button variant="outline" onClick={handleEdit} disabled={isSubmitting}>
                    <FiEdit className="mr-2" />
                    Edit
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="shadow-lg shadow-blue-500/25"
                >
                    <FiSend className="mr-2" />
                    Submit Form
                </Button>
            </div>

            {/* Success Overlay */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className="bg-white rounded-3xl p-12 text-center max-w-sm mx-4"
                    >
                        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                            <FiCheck className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Submitting...</h3>
                        <p className="text-gray-500 mt-2">Please wait while we process your form.</p>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Review;
