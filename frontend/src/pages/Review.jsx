import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiCheckCircle, 
    FiEdit, 
    FiArrowLeft, 
    FiSend, 
    FiUser, 
    FiMail, 
    FiPhone, 
    FiMapPin, 
    FiCalendar, 
    FiClock, 
    FiAlertCircle, 
    FiShield, 
    FiFileText,
    FiActivity,
    FiBriefcase,
    FiHome,
    FiTruck,
    FiTag,
    FiAward,
    FiHeart,
    FiUsers,
    FiCamera,
    FiBook,
    FiFlag,
    FiInfo,
    FiPrinter,
    FiX,
    FiEye
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const Review = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [extractedData, setExtractedData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔍 Review: Checking for data...');
        console.log('📍 Location state:', location.state);
        console.log('📦 localStorage:', localStorage.getItem('extractedData'));
        console.log('📦 sessionStorage:', sessionStorage.getItem('extractedData'));
        
        let data = null;
        
        // 1. Check location state
        if (location.state?.extractedData) {
            data = location.state.extractedData;
            console.log('✅ Found data in location.state');
        }
        
        // 2. Check localStorage
        if (!data) {
            const stored = localStorage.getItem('extractedData');
            console.log('📦 Raw localStorage:', stored);
            if (stored) {
                try {
                    data = JSON.parse(stored);
                    console.log('✅ Parsed localStorage data:', data);
                } catch (e) {
                    console.error('❌ Error parsing localStorage:', e);
                    localStorage.removeItem('extractedData');
                }
            }
        }
        
        // 3. Check sessionStorage
        if (!data) {
            const sessionData = sessionStorage.getItem('extractedData');
            console.log('📦 Raw sessionStorage:', sessionData);
            if (sessionData) {
                try {
                    data = JSON.parse(sessionData);
                    console.log('✅ Parsed sessionStorage data:', data);
                } catch (e) {
                    console.error('❌ Error parsing sessionStorage:', e);
                    sessionStorage.removeItem('extractedData');
                }
            }
        }
        
        // 4. If still no data, show error
        if (!data) {
            console.log('❌ No data found anywhere');
            toast.error('No data found. Please describe your incident first.');
            navigate('/ai-input');
            setLoading(false);
            return;
        }
        
        // ✅ Set data
        console.log('✅ Setting extracted data:', data);
        setExtractedData(data);
        setLoading(false);
        
    }, [location, navigate]);

    const handleClearData = () => {
        localStorage.removeItem('extractedData');
        sessionStorage.removeItem('extractedData');
        setExtractedData(null);
        toast.info('Data cleared. Please describe your incident again.');
        navigate('/ai-input');
    };

    const handleEdit = () => {
        navigate('/ai-input');
    };

    const handleSubmit = () => {
        if (!extractedData) {
            toast.error('No data to submit');
            return;
        }
        
        const allForms = JSON.parse(localStorage.getItem('allForms') || '[]');
        const newForm = {
            id: Date.now().toString(),
            userId: user?.id,
            title: `${extractedData?.incidentType || 'Incident'} Report`,
            reference: `FRM-${Date.now().toString().slice(-6)}`,
            data: extractedData,
            status: 'Completed',
            submittedAt: new Date().toISOString(),
            extractedData: extractedData
        };
        
        allForms.unshift(newForm);
        localStorage.setItem('allForms', JSON.stringify(allForms));
        localStorage.removeItem('extractedData');
        sessionStorage.removeItem('extractedData');
        
        toast.success('✅ Form submitted successfully!');
        navigate('/success', { state: { formId: newForm.id } });
    };

    const renderField = (label, value, icon) => {
        if (!value || value === 'Not provided' || value === '' || value === 'Not specified') {
            return null;
        }
        return (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-gray-900 font-medium">
                        {Array.isArray(value) ? value.join(', ') : value}
                    </p>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!extractedData) {
        return (
            <div className="text-center py-12">
                <FiAlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No data to review</p>
                <p className="text-sm text-gray-400 mt-2">Please describe your incident first</p>
                <Button variant="primary" onClick={() => navigate('/ai-input')} className="mt-4">
                    Go to AI Input
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Review Extracted Data</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Verify all information extracted by AI
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleClearData}>
                        <FiX className="mr-1.5" />
                        Clear Data
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                        <FiEdit className="mr-1.5" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                        <FiPrinter className="mr-1.5" />
                        Print
                    </Button>
                </div>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                        AI Extracted Information
                    </h3>
                    <span className="text-xs text-gray-400">Confidence: 92%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                            <FiUser className="w-4 h-4 text-blue-600" />
                            Personal Information
                        </h4>
                        {renderField('Full Name', extractedData.ownerName || extractedData.fullName, <FiUser />)}
                        {renderField('Age', extractedData.age, <FiTag />)}
                        {renderField('Phone Number', extractedData.phone || extractedData.phoneNumber, <FiPhone />)}
                        {renderField('Email Address', extractedData.email || extractedData.emailAddress, <FiMail />)}
                        {renderField('Address', extractedData.address, <FiHome />)}
                        {renderField('City', extractedData.city, <FiMapPin />)}
                        {renderField('State', extractedData.state, <FiFlag />)}
                        {renderField('Country', extractedData.country, <FiFlag />)}
                        {renderField('Pincode', extractedData.pincode, <FiTag />)}
                        {renderField('Occupation', extractedData.occupation, <FiBriefcase />)}
                        {renderField('Employer', extractedData.employer, <FiBriefcase />)}
                    </div>

                    {/* Incident Details */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                            <FiAlertCircle className="w-4 h-4 text-red-600" />
                            Incident Details
                        </h4>
                        {renderField('Incident Type', extractedData.incidentType, <FiAlertCircle />)}
                        {renderField('Sub Type', extractedData.incidentSubType, <FiTag />)}
                        {renderField('Severity', extractedData.severity, <FiActivity />)}
                        {renderField('Date', extractedData.date || extractedData.incidentDate, <FiCalendar />)}
                        {renderField('Time', extractedData.time || extractedData.incidentTime, <FiClock />)}
                        {renderField('Location', extractedData.location || extractedData.incidentLocation, <FiMapPin />)}
                        {renderField('Weather', extractedData.weatherConditions, <FiActivity />)}
                        {renderField('Road Conditions', extractedData.roadConditions, <FiActivity />)}
                        {renderField('Visibility', extractedData.visibility, <FiEye />)}
                        {renderField('Speed', extractedData.speed, <FiActivity />)}
                    </div>

                    {/* Vehicle Details */}
                    {extractedData.vehicleMake || extractedData.vehicle ? (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <FiTruck className="w-4 h-4 text-purple-600" />
                                Vehicle Details
                            </h4>
                            {renderField('Vehicle Make', extractedData.vehicleMake || extractedData.vehicle, <FiTruck />)}
                            {renderField('Vehicle Model', extractedData.vehicleModel, <FiTruck />)}
                            {renderField('Vehicle Number', extractedData.vehicleNumber, <FiTag />)}
                            {renderField('Vehicle Color', extractedData.vehicleColor, <FiTag />)}
                            {renderField('Vehicle Type', extractedData.vehicleType, <FiTruck />)}
                            {renderField('Airbag Deployed', extractedData.airbagDeployed, <FiShield />)}
                            {renderField('Seatbelt Used', extractedData.seatbeltUsed, <FiShield />)}
                        </div>
                    ) : null}

                    {/* Police Details */}
                    {extractedData.policeReportFiled || extractedData.policeReport ? (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <FiShield className="w-4 h-4 text-yellow-600" />
                                Police Details
                            </h4>
                            {renderField('Police Report Filed', extractedData.policeReportFiled || extractedData.policeReport, <FiShield />)}
                            {renderField('FIR Number', extractedData.firNumber, <FiFileText />)}
                            {renderField('Police Station', extractedData.policeStation || extractedData.policeStationName, <FiHome />)}
                            {renderField('Police Officer', extractedData.policeOfficerName, <FiUser />)}
                            {renderField('Police Charges', extractedData.policeCharges || extractedData.policeChargesFiled, <FiFileText />)}
                            {renderField('Police Contact', extractedData.policeContactNumber, <FiPhone />)}
                        </div>
                    ) : null}

                    {/* Insurance Details */}
                    {extractedData.insuranceCompanyName || extractedData.insuranceCompany ? (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <FiAward className="w-4 h-4 text-green-600" />
                                Insurance Details
                            </h4>
                            {renderField('Insurance Company', extractedData.insuranceCompanyName || extractedData.insuranceCompany, <FiAward />)}
                            {renderField('Policy Number', extractedData.policyNumber, <FiFileText />)}
                            {renderField('Policy Type', extractedData.policyType, <FiTag />)}
                            {renderField('Claim Number', extractedData.claimNumber, <FiFileText />)}
                            {renderField('Claim Type', extractedData.claimType, <FiTag />)}
                            {renderField('Claim Status', extractedData.claimStatus, <FiActivity />)}
                            {renderField('Insurance Agent', extractedData.insuranceAgentName, <FiUser />)}
                        </div>
                    ) : null}

                    {/* Financial Details */}
                    {extractedData.estimatedTotalLoss || extractedData.estimatedLoss ? (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <FiAward className="w-4 h-4 text-emerald-600" />
                                Financial Details
                            </h4>
                            {renderField('Estimated Total Loss', extractedData.estimatedTotalLoss || extractedData.estimatedLoss, <FiAward />)}
                            {renderField('Vehicle Repair Cost', extractedData.vehicleRepairCost, <FiAward />)}
                            {renderField('Medical Expenses', extractedData.medicalExpenses, <FiHeart />)}
                            {renderField('Property Damage', extractedData.propertyDamageCost, <FiHome />)}
                            {renderField('Loss of Income', extractedData.lossOfIncome, <FiBriefcase />)}
                        </div>
                    ) : null}

                    {/* Medical Details */}
                    {extractedData.hospitalName || extractedData.hospital ? (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <FiHeart className="w-4 h-4 text-red-600" />
                                Medical Details
                            </h4>
                            {renderField('Hospital', extractedData.hospitalName || extractedData.hospital, <FiHeart />)}
                            {renderField('Hospital Address', extractedData.hospitalAddress, <FiMapPin />)}
                            {renderField('Doctor', extractedData.doctorName || extractedData.doctor, <FiUser />)}
                            {renderField('Doctor Specialty', extractedData.doctorSpecialty, <FiTag />)}
                            {renderField('Injuries', extractedData.injuriesDescription || extractedData.injuries, <FiAlertCircle />)}
                            {renderField('Treatment', extractedData.treatmentGiven, <FiHeart />)}
                            {renderField('Recovery Time', extractedData.recoveryTime, <FiClock />)}
                            {renderField('Ambulance Used', extractedData.ambulanceUsed, <FiTruck />)}
                        </div>
                    ) : null}

                    {/* Witnesses & Evidence */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                            <FiUsers className="w-4 h-4 text-indigo-600" />
                            Witnesses & Evidence
                        </h4>
                        {renderField('Witnesses', extractedData.witnesses, <FiUsers />)}
                        {renderField('Evidence', extractedData.evidence || extractedData.evidenceAvailable, <FiCamera />)}
                        {renderField('CCTV Footage', extractedData.cctvFootage, <FiCamera />)}
                        {renderField('Photographs', extractedData.photographs, <FiCamera />)}
                    </div>

                    {/* Legal Details */}
                    {extractedData.lawyerName ? (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <FiBook className="w-4 h-4 text-gray-600" />
                                Legal Details
                            </h4>
                            {renderField('Lawyer', extractedData.lawyerName, <FiUser />)}
                            {renderField('Court Case Filed', extractedData.courtCaseFiled, <FiFileText />)}
                            {renderField('Case Number', extractedData.courtCaseNumber, <FiFileText />)}
                            {renderField('Court Name', extractedData.courtName, <FiHome />)}
                            {renderField('Hearing Date', extractedData.hearingDate, <FiCalendar />)}
                        </div>
                    ) : null}

                    {/* Additional Information */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                            <FiInfo className="w-4 h-4 text-gray-600" />
                            Additional Information
                        </h4>
                        {renderField('Driving Experience', extractedData.drivingExperience, <FiActivity />)}
                        {renderField('License Number', extractedData.drivingLicenseNumber, <FiFileText />)}
                        {renderField('Employer Notified', extractedData.employerNotified, <FiBriefcase />)}
                        {renderField('Leave Approved', extractedData.leaveApproved, <FiCheckCircle />)}
                        {renderField('Emotional Trauma', extractedData.emotionalTrauma, <FiHeart />)}
                    </div>
                </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    className="flex-1 shadow-lg shadow-blue-500/25"
                >
                    <FiSend className="mr-2" />
                    Submit Form
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/ai-input')}
                >
                    Edit Description
                </Button>
            </div>
        </div>
    );
};

export default Review;
