// src/pages/AIInput.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSend, FiTrash2, FiZap, FiClock, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useForm } from '../context/FormContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';

const AIInput = () => {
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showTips, setShowTips] = useState(true);
    const { setExtractedData, generateFormConfig } = useForm();
    const navigate = useNavigate();

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatTime = (date) => {
        const d = new Date(date);
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    const cleanText = (str) => {
        if (!str) return '';
        return str.replace(/[^a-zA-Z0-9\s\-.,]/g, '').trim();
    };

    const safeGet = (fn, fallback = '') => {
        try {
            const result = fn();
            return (result !== undefined && result !== null && result !== '') ? result : fallback;
        } catch {
            return fallback;
        }
    };

    // ==================== EXTRACTION FUNCTIONS ====================

    const extractName = (text) => {
        return safeGet(() => {
            const match = text.match(/my name is\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
            if (match) return cleanText(match[1]);
            const match2 = text.match(/name\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
            if (match2) return cleanText(match2[1]);
            return '';
        }, '');
    };

    const extractAge = (text) => {
        return safeGet(() => {
            const match = text.match(/(\d{1,2})-year-old/i);
            if (match) return match[1];
            const match2 = text.match(/age\s*:?\s*(\d{1,2})/i);
            if (match2) return match2[1];
            return '';
        }, '');
    };

    const extractPhone = (text) => {
        return safeGet(() => {
            const match = text.match(/(?<!\d)(\+91[\s\-]?)?[6-9]\d{9}(?!\d)/);
            if (match) {
                let num = match[0].replace(/[\s\-]/g, '');
                if (!num.startsWith('+') && num.length === 10) {
                    num = '+91' + num;
                }
                return num;
            }
            return '';
        }, '');
    };

    const extractEmail = (text) => {
        return safeGet(() => {
            const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (match) return match[0];
            return '';
        }, '');
    };

    const extractAddress = (text) => {
        return safeGet(() => {
            const patterns = [
                /(?:live at|address|residence|parked at)\s*[:\-]?\s*([^,\n]+(?:,\s*[^,\n]+)?)/i,
                /(\d{1,3}\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*(?:Street|Road|Lane|Avenue|Apartments|Extension|Colony))/i,
                /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:Apartments|Apartments|Colony|Extension)/i,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    const address = cleanText(match[1]);
                    if (address && address.length > 5) return address;
                }
            }
            return '';
        }, '');
    };

    const extractOccupation = (text) => {
        return safeGet(() => {
            const patterns = [
                /I['']m\s+(?:a|an)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
                /occupation\s*:?\s*([A-Z][a-z]+)/i,
                /(?:working as|works as)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) return cleanText(match[1]);
            }
            return '';
        }, '');
    };

    const extractEmployer = (text) => {
        return safeGet(() => {
            const patterns = [
                /working at\s+([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
                /employer\s*:?\s*([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
                /(?:office|company)\s*(?:at|in)?\s*([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) return cleanText(match[1]);
            }
            return '';
        }, '');
    };

    const extractDate = (text) => {
        return safeGet(() => {
            const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
            const patterns = [
                /(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
                /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i,
                /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/,
                /(\d{4})-(\d{2})-(\d{2})/,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    const monthIdx = monthNames.indexOf(match[1]?.toLowerCase());
                    if (monthIdx !== -1) return `${String(match[2]).padStart(2, '0')}/${String(monthIdx + 1).padStart(2, '0')}/${match[3]}`;
                    const monthIdx2 = monthNames.indexOf(match[2]?.toLowerCase());
                    if (monthIdx2 !== -1) return `${String(match[1]).padStart(2, '0')}/${String(monthIdx2 + 1).padStart(2, '0')}/${match[3]}`;
                    if (match[1] && match[2] && match[3]) {
                        if (match[1].length === 4) return `${match[3]}/${match[2]}/${match[1]}`;
                        return `${String(match[1]).padStart(2, '0')}/${String(match[2]).padStart(2, '0')}/${match[3]}`;
                    }
                }
            }
            return formatDate(new Date());
        }, formatDate(new Date()));
    };

    const extractTime = (text) => {
        return safeGet(() => {
            const patterns = [
                /at\s*(\d{1,2})\s*[:\-]?\s*(\d{2})?\s*(AM|PM)/i,
                /at\s*(\d{1,2})\s*(AM|PM)/i,
                /(\d{1,2})\s*:\s*(\d{2})\s*(AM|PM)/i,
                /(\d{1,2})\s*(AM|PM)/i,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    let hours = parseInt(match[1]);
                    const minutes = match[2] || '00';
                    let ampm = match[3] || (hours >= 12 ? 'PM' : 'AM');
                    if (ampm.length === 2 && /[AP]M/i.test(ampm)) {}
                    else if (hours >= 12) ampm = 'PM';
                    else ampm = 'AM';
                    if (hours > 12) hours = hours - 12;
                    if (hours === 0) hours = 12;
                    return `${hours}:${minutes} ${ampm}`;
                }
            }
            return formatTime(new Date());
        }, formatTime(new Date()));
    };

    // ✅ Fixed: detectIncidentType - Car Theft detection added
    const detectIncidentType = (text) => {
        return safeGet(() => {
            const lower = text.toLowerCase();

            // ✅ Car Theft - Check FIRST
            if ((lower.includes('car') || lower.includes('vehicle')) && 
                (lower.includes('stolen') || lower.includes('theft') || 
                 lower.includes('missing') || lower.includes('stole'))) {
                return 'Car Theft';
            }

            // Cyber Fraud
            if (lower.includes('cyber') || lower.includes('fraud') || lower.includes('scam') ||
                lower.includes('identity theft') || lower.includes('phishing') ||
                lower.includes('otp') || lower.includes('bank fraud') ||
                lower.includes('credit card fraud') || lower.includes('online fraud') ||
                (lower.includes('call') && lower.includes('bank') && lower.includes('otp'))) {
                if (lower.includes('identity') || lower.includes('personal information')) return 'Identity Theft';
                if (lower.includes('credit card') || lower.includes('debit card')) return 'Card Fraud';
                if (lower.includes('phishing') || lower.includes('otp')) return 'Phishing Fraud';
                return 'Cyber Fraud';
            }

            // Vehicle Accidents
            if (lower.includes('car') || lower.includes('vehicle') || lower.includes('driving')) {
                if (lower.includes('truck') && (lower.includes('hit') || lower.includes('collision'))) return 'Truck Accident';
                if (lower.includes('hit and run')) return 'Hit and Run';
                if (lower.includes('multi') || lower.includes('multiple')) return 'Multi-Vehicle Accident';
                if (lower.includes('bike') || lower.includes('motorcycle')) return 'Bike Accident';
                if (lower.includes('slip') || lower.includes('fall') && !lower.includes('vehicle')) return 'Slip and Fall';
                return 'Car Accident';
            }

            // Slip and Fall
            if (lower.includes('slip') || lower.includes('fall') || lower.includes('slipped') || lower.includes('fell')) {
                if (lower.includes('mall') || lower.includes('store') || lower.includes('shop')) return 'Slip and Fall at Mall';
                if (lower.includes('work') || lower.includes('office')) return 'Workplace Slip and Fall';
                return 'Slip and Fall';
            }

            // Fire
            if (lower.includes('fire') || lower.includes('smoke') || lower.includes('burn')) {
                if (lower.includes('factory') || lower.includes('industrial') || lower.includes('warehouse')) return 'Industrial Fire';
                if (lower.includes('kitchen') || lower.includes('cooking')) return 'Kitchen Fire';
                if (lower.includes('electrical') || lower.includes('short circuit')) return 'Electrical Fire';
                return 'Fire Damage';
            }

            // Theft/Burglary
            if (lower.includes('burglary') || lower.includes('theft') || lower.includes('stole') || lower.includes('robbery')) {
                if (lower.includes('car') || lower.includes('vehicle')) return 'Car Theft';
                return 'Theft/Burglary';
            }

            // Medical
            if (lower.includes('hospital') || lower.includes('medical') || lower.includes('doctor') || lower.includes('surgery')) {
                if (lower.includes('dental') || lower.includes('tooth')) return 'Dental Claim';
                if (lower.includes('critical') || lower.includes('heart') || lower.includes('cancer')) return 'Critical Illness Claim';
                if (lower.includes('accident') || lower.includes('injury')) return 'Accidental Injury Claim';
                return 'Medical Claim';
            }

            // Workplace
            if (lower.includes('work') || lower.includes('office') || lower.includes('employee')) {
                if (lower.includes('slip') || lower.includes('fall')) return 'Workplace Slip and Fall';
                return 'Workplace Incident';
            }

            return 'General Incident';
        }, 'General Incident');
    };

    const extractSeverity = (text) => {
        return safeGet(() => {
            const lower = text.toLowerCase();
            if (lower.includes('critical') || lower.includes('severe') || lower.includes('fatal')) return 'Critical';
            if (lower.includes('extensive') || lower.includes('significant') || lower.includes('major') || lower.includes('fracture')) return 'High';
            if (lower.includes('minor') || lower.includes('slight') || lower.includes('small')) return 'Low';
            if (lower.includes('damage') || lower.includes('injured') || lower.includes('injuries')) return 'Medium';
            return 'Medium';
        }, 'Medium');
    };

    const extractLocation = (text) => {
        return safeGet(() => {
            const patterns = [
                /(?:located at|at|in)\s+([^,\n]+(?:,\s*[^,\n]+)?,\s*[A-Z][a-z]+)/i,
                /(?:plot|factory|warehouse|office|mall|apartment|sector)\s+(?:no\.?\s*)?([^,\n]+(?:,\s*[^,\n]+)?)/i,
                /(?:area|sector|colony)\s+([^,\n]+(?:,\s*[^,\n]+)?)/i,
                /(?:at|in)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:Mall|Hospital|Office|School|Apartments)/i,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    const location = cleanText(match[1]);
                    if (location && location.length > 5) return location;
                }
            }
            return 'Not specified';
        }, 'Not specified');
    };

    const extractPoliceReport = (text) => {
        return safeGet(() => {
            const lower = text.toLowerCase();
            if (lower.includes('police') && (lower.includes('fir') || lower.includes('report') || lower.includes('case'))) {
                return true;
            }
            return false;
        }, false);
    };

    const extractFIRNumber = (text) => {
        return safeGet(() => {
            const patterns = [
                /FIR\s*(?:number|no\.?)?\s*:?\s*([A-Z0-9/\-]+)/i,
                /FIR\s+number\s+([A-Z0-9/\-]+)/i,
                /case\s+number\s+([A-Z0-9/\-]+)/i,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    let fir = match[1].replace(/[^A-Z0-9/\-]/g, '');
                    if (fir) return fir;
                }
            }
            return '';
        }, '');
    };

    // ✅ Fixed: extractPoliceStation
    const extractPoliceStation = (text) => {
        return safeGet(() => {
            const patterns = [
                /(?:Police\s+Station|police\s+station)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
                /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:Police\s+Station|police\s+station)/i,
                /at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+police\s+station/i,
                /contacted\s+the\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+police\s+station/i,
                /filed\s+(?:a\s+complaint|an\s+FIR)\s+with\s+the\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+police\s+station/i,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    const station = cleanText(match[1]);
                    if (station && station.length > 2 && !station.toLowerCase().includes('hospital')) {
                        return station;
                    }
                }
            }
            return '';
        }, '');
    };

    // ✅ Fixed: extractPoliceCharges
    const extractPoliceCharges = (text) => {
        return safeGet(() => {
            const match = text.match(/sections?\s*(\d{3})(?:\s*,\s*(\d{3}))?\s*(?:and\s*(\d{3}))?/i);
            if (match) {
                const charges = [`Section ${match[1]}`];
                if (match[2]) charges.push(`Section ${match[2]}`);
                if (match[3]) charges.push(`Section ${match[3]}`);
                return charges.join(', ');
            }
            const altMatch = text.match(/under\s+sections?\s*(\d{3})(?:\s*,\s*(\d{3}))?/i);
            if (altMatch) {
                const charges = [`Section ${altMatch[1]}`];
                if (altMatch[2]) charges.push(`Section ${altMatch[2]}`);
                return charges.join(', ');
            }
            return '';
        }, '');
    };

    const extractInsurance = (text) => {
        return safeGet(() => {
            const companies = ['ICICI Lombard', 'Bajaj Allianz', 'New India Assurance', 'SBI General', 'HDFC Ergo',
                'Star Health', 'TATA AIG', 'Reliance', 'Aditya Birla', 'Bharti AXA',
                'National Insurance', 'United India', 'Oriental Insurance'];
            for (const company of companies) {
                if (text.toLowerCase().includes(company.toLowerCase())) {
                    return company;
                }
            }
            return '';
        }, '');
    };

    const extractPolicyNumber = (text) => {
        return safeGet(() => {
            const match = text.match(/policy\s*(?:number|no\.?)?\s*:?\s*([A-Z0-9\-]+)/i);
            if (match) return match[1];
            return '';
        }, '');
    };

    // ✅ Fixed: extractClaimNumber
    const extractClaimNumber = (text) => {
        return safeGet(() => {
            const match = text.match(/claim\s*(?:number|no\.?)?\s*:?\s*([A-Z0-9/\-]+)/i);
            if (match) {
                let claim = match[1].replace(/[^A-Z0-9/\-]/g, '');
                if (claim && claim.length > 3) return claim;
            }
            const altMatch = text.match(/claim\s+number\s+([A-Z0-9\-]+)/i);
            if (altMatch) return altMatch[1];
            return '';
        }, '');
    };

    const extractClaimType = (text) => {
        return safeGet(() => {
            const lower = text.toLowerCase();
            if (lower.includes('comprehensive')) return 'Comprehensive';
            if (lower.includes('third-party') || lower.includes('third party')) return 'Third-Party';
            if (lower.includes('liability')) return 'Liability';
            if (lower.includes('collision')) return 'Collision';
            if (lower.includes('cyber') || lower.includes('fraud')) return 'Cyber Insurance';
            return '';
        }, '');
    };

    const extractPolicyType = (text) => {
        return safeGet(() => {
            const lower = text.toLowerCase();
            if (lower.includes('comprehensive')) return 'Comprehensive';
            if (lower.includes('third-party') || lower.includes('third party')) return 'Third-Party';
            if (lower.includes('liability')) return 'Liability';
            if (lower.includes('cyber') || lower.includes('fraud')) return 'Cyber Insurance';
            return '';
        }, '');
    };

    // ✅ Fixed: extractEstimatedLoss
    const extractEstimatedLoss = (text) => {
        return safeGet(() => {
            const match = text.match(/estimated\s*(?:to be|at)?\s*[\₹\$€£]?\s?([\d.,]+\s*(?:crores?|lakhs?|thousand)?)/i);
            if (match) {
                let amount = match[1];
                if (amount.toLowerCase().includes('crore')) return `₹${amount}`;
                if (amount.toLowerCase().includes('lakh')) return `₹${amount}`;
                return `₹${amount}`;
            }
            const match2 = text.match(/total\s+(?:loss|damage|value)\s*(?:is|of)?\s*[\₹\$€£]?\s?([\d.,]+)/i);
            if (match2) {
                const amount = match2[1];
                if (parseInt(amount.replace(/,/g, '')) > 1000) return `₹${amount}`;
            }
            return '';
        }, '');
    };

    // ✅ Fixed: extractVehicle
    const extractVehicle = (text) => {
        return safeGet(() => {
            const lower = text.toLowerCase();
            if (!lower.includes('car') && !lower.includes('vehicle') && !lower.includes('driving') &&
                !lower.includes('hyundai') && !lower.includes('verna') && !lower.includes('honda') &&
                !lower.includes('toyota') && !lower.includes('maruti') && !lower.includes('suzuki') &&
                !lower.includes('ford') && !lower.includes('tata') && !lower.includes('mahindra')) {
                return '';
            }

            const patterns = [
                /my\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
                /(?:driving|car|vehicle)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
                /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:car|vehicle|suv|sedan|verna|creta|swift|city|fortuner|i10|i20)/i,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    const vehicle = cleanText(match[1]);
                    if (!vehicle.toLowerCase().includes('missing') && 
                        !vehicle.toLowerCase().includes('stolen') &&
                        !vehicle.toLowerCase().includes('road') &&
                        !vehicle.toLowerCase().includes('street') &&
                        !vehicle.toLowerCase().includes('was') &&
                        vehicle.split(' ').length >= 2) {
                        return vehicle;
                    }
                }
            }
            return '';
        }, '');
    };

    const extractVehicleNumber = (text) => {
        return safeGet(() => {
            const patterns = [
                /[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}/i,
                /[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}/i,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) return match[0].toUpperCase();
            }
            return '';
        }, '');
    };

    const extractHospital = (text) => {
        return safeGet(() => {
            const match = text.match(/([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:Hospital|Medical Center|Clinic)/i);
            if (match) return cleanText(match[1]);
            return '';
        }, '');
    };

    const extractDoctor = (text) => {
        return safeGet(() => {
            const match = text.match(/Dr\.?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
            if (match) return `Dr. ${cleanText(match[1])}`;
            return '';
        }, '');
    };

    const extractInjuries = (text) => {
        return safeGet(() => {
            const match = text.match(/suffered\s+([^.]+[,.])/i);
            if (match) return cleanText(match[1].replace(/[,.]$/, ''));
            const match2 = text.match(/diagnosed with\s+([^.]+)/i);
            if (match2) return cleanText(match2[1]);
            return 'None reported';
        }, 'None reported');
    };

    const extractWitnesses = (text) => {
        return safeGet(() => {
            const patterns = [
                /witness(?:es)?\s*:?\s*(?:include\s*)?([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s*,\s*[A-Z][a-z]+\s+[A-Z][a-z]+)*)/i,
                /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:security guard|guard|colleague|friend|daughter|son|person)/i,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    const names = match[1].split(',').map(w => cleanText(w.trim()));
                    return names.filter(n => n.split(' ').length >= 2);
                }
            }
            return [];
        }, []);
    };

    const extractEvidence = (text) => {
        return safeGet(() => {
            const lower = text.toLowerCase();
            const evidence = [];
            if (lower.includes('cctv')) evidence.push('CCTV Footage');
            if (lower.includes('photographs') || lower.includes('photos')) evidence.push('Photographs');
            if (lower.includes('broken glass')) evidence.push('Broken Glass Pieces');
            if (lower.includes('samples')) evidence.push('Samples Collected');
            if (lower.includes('test reports')) evidence.push('Test Reports');
            if (lower.includes('statements')) evidence.push('Witness Statements');
            if (lower.includes('bank statements')) evidence.push('Bank Statements');
            if (lower.includes('sms') || lower.includes('alert')) evidence.push('SMS Alerts');
            if (lower.includes('call log')) evidence.push('Call Logs');
            return evidence;
        }, []);
    };

    // ==================== MAIN GENERATE FUNCTION ====================

    const handleGenerate = async () => {
        if (!inputText.trim()) {
            alert('Please describe your incident first');
            return;
        }

        setIsProcessing(true);
        setProgress(0);

        try {
            const steps = [
                { progress: 20, message: 'Analyzing text...' },
                { progress: 45, message: 'Extracting entities...' },
                { progress: 70, message: 'Structuring data...' },
                { progress: 90, message: 'Generating form...' },
                { progress: 100, message: 'Complete!' },
            ];

            for (const step of steps) {
                await new Promise(resolve => setTimeout(resolve, 600));
                setProgress(step.progress);
            }

            const now = new Date();
            const formattedDate = formatDate(now);
            const formattedTime = formatTime(now);

            const extractedData = {
                // Personal
                ownerName: extractName(inputText) || 'Not provided',
                age: extractAge(inputText) || 'Not provided',
                phone: extractPhone(inputText) || 'Not provided',
                email: extractEmail(inputText) || 'Not provided',
                address: extractAddress(inputText) || 'Not specified',
                occupation: extractOccupation(inputText) || 'Not specified',
                employer: extractEmployer(inputText) || 'Not specified',

                // Incident
                incidentType: detectIncidentType(inputText) || 'General Incident',
                date: extractDate(inputText) || formattedDate,
                time: extractTime(inputText) || formattedTime,
                location: extractLocation(inputText) || 'Not specified',
                severity: extractSeverity(inputText) || 'Medium',

                // Vehicle
                vehicle: extractVehicle(inputText) || 'Not specified',
                vehicleNumber: extractVehicleNumber(inputText) || 'Not provided',

                // Police
                policeReport: extractPoliceReport(inputText) || false,
                firNumber: extractFIRNumber(inputText) || 'Not provided',
                policeStation: extractPoliceStation(inputText) || 'Not specified',
                policeCharges: extractPoliceCharges(inputText) || 'Not specified',

                // Insurance
                insuranceCompany: extractInsurance(inputText) || 'Not specified',
                policyNumber: extractPolicyNumber(inputText) || 'Not provided',
                claimNumber: extractClaimNumber(inputText) || 'Not provided',
                claimType: extractClaimType(inputText) || 'Not specified',
                policyType: extractPolicyType(inputText) || 'Not specified',

                // Financial
                estimatedLoss: extractEstimatedLoss(inputText) || 'Not estimated',

                // Medical
                hospital: extractHospital(inputText) || 'Not specified',
                doctor: extractDoctor(inputText) || 'Not specified',
                injuries: extractInjuries(inputText) || 'None reported',

                // Witnesses & Evidence
                witnesses: extractWitnesses(inputText) || [],
                evidence: extractEvidence(inputText) || [],

                // Metadata
                description: inputText,
                extractedAt: `${formattedDate} at ${formattedTime}`,
            };

            setExtractedData(extractedData);
            generateFormConfig(extractedData);

            setTimeout(() => {
                navigate('/review');
            }, 500);

        } catch (error) {
            console.error('Processing Error:', error);
            alert('Error processing your request. Please try again.');
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
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 text-sm font-medium mb-4"
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
                    <Card className="p-6 bg-linear-to-r from-blue-600/5 to-cyan-500/5 border-blue-600/10">
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
                                className="h-full bg-linear-to-r from-blue-600 to-cyan-400 rounded-full"
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
