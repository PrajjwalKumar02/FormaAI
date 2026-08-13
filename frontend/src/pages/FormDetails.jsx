import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowLeft,
    FiFileText,
    FiCalendar,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiDownload,
    FiPrinter,
    FiShare2,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiEye,
    FiEyeOff
} from 'react-icons/fi';
import Button from '../components/Button';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const FormDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        console.log('🔍 FormDetails: Looking for form with ID:', id);

        const allForms = JSON.parse(localStorage.getItem('allForms') || '[]');
        console.log('📦 All forms in localStorage:', allForms);

        // ✅ FIXED: Find by string ID (not parseInt)
        const found = allForms.find(f => {
            const formId = f.id || f._id || '';
            return String(formId) === String(id);
        });

        console.log('📄 Found form:', found);
        setForm(found || null);
        setLoading(false);
    }, [id]);

    // ✅ PDF Download Function
    const handleDownloadPDF = () => {
        if (!form) {
            toast.error('No form data to download');
            return;
        }

        const content = generatePDFContent(form);

        try {
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Form_${form.reference || form.id || 'form'}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success('📄 PDF downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download PDF. Please try again.');
        }
    };

    const generatePDFContent = (formData) => {
        const currentDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const currentTime = new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const extracted = formData.extractedData || {};
        const excludedKeys = ['description', 'extractedAt', 'extractedAtFull'];

        const extractedFields = Object.entries(extracted)
            .filter(([key]) => !excludedKeys.includes(key))
            .filter(([key, value]) => value && value !== 'Not provided' && value !== 'Not specified' && value !== '');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Form Details - ${formData.reference || 'Form'}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', -apple-system, Arial, sans-serif; 
                        padding: 40px; 
                        max-width: 800px; 
                        margin: 0 auto;
                        color: #1E293B;
                        background: white;
                        line-height: 1.6;
                    }
                    .header {
                        border-bottom: 4px solid #2563EB;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #2563EB;
                        font-size: 28px;
                        font-weight: 700;
                    }
                    .header .reference {
                        color: #64748B;
                        font-size: 14px;
                        margin-top: 4px;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 4px 16px;
                        border-radius: 50px;
                        font-size: 13px;
                        font-weight: 600;
                        background: #10B981;
                        color: white;
                        margin-top: 8px;
                    }
                    .section {
                        margin: 24px 0;
                        padding: 20px;
                        background: #F8FAFC;
                        border-radius: 12px;
                        border-left: 4px solid #2563EB;
                    }
                    .section h3 {
                        margin: 0 0 12px 0;
                        color: #1E293B;
                        font-size: 16px;
                        font-weight: 600;
                    }
                    .section .description-text {
                        color: #475569;
                        font-size: 14px;
                        line-height: 1.8;
                        white-space: pre-wrap;
                    }
                    .field-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        border-bottom: 1px solid #E2E8F0;
                    }
                    .field-row:last-child { border-bottom: none; }
                    .field-label {
                        font-weight: 600;
                        color: #475569;
                        font-size: 14px;
                    }
                    .field-value {
                        color: #1E293B;
                        text-align: right;
                        max-width: 60%;
                        word-break: break-word;
                        font-size: 14px;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #E2E8F0;
                        text-align: center;
                        color: #94A3B8;
                        font-size: 13px;
                    }
                    .watermark {
                        position: fixed;
                        bottom: 30px;
                        right: 30px;
                        opacity: 0.05;
                        font-size: 50px;
                        font-weight: 800;
                        color: #2563EB;
                        pointer-events: none;
                        transform: rotate(-15deg);
                    }
                    @media print {
                        body { padding: 20px; }
                        .section { break-inside: avoid; }
                    }
                    @media (max-width: 600px) {
                        .field-row {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 4px;
                        }
                        .field-value {
                            text-align: left;
                            max-width: 100%;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="watermark">Forma AI</div>
                
                <div class="header">
                    <h1>📄 Form Details</h1>
                    <div class="reference">Reference: ${formData.reference || 'N/A'}</div>
                    <span class="status-badge">${formData.status || 'Draft'}</span>
                    <div style="font-size:12px; color:#94A3B8; margin-top:8px;">
                        Submitted: ${formData.date || 'N/A'}
                    </div>
                </div>

                ${extractedFields.length > 0 ? `
                <div class="section">
                    <h3>🤖 Extracted Information</h3>
                    ${extractedFields.map(([key, value]) => `
                        <div class="field-row">
                            <span class="field-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                            <span class="field-value">${typeof value === 'boolean' ? (value ? 'Yes ✅' : 'No ❌') : value}</span>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${extracted.description ? `
                <div class="section" style="border-left-color: #8B5CF6;">
                    <h3>📝 Original Description</h3>
                    <div class="description-text">${extracted.description}</div>
                </div>
                ` : ''}

                ${extracted.extractedAt ? `
                <div style="text-align:center; color:#94A3B8; font-size:13px; margin:20px 0;">
                    ⏱ Extracted on: ${extracted.extractedAt}
                </div>
                ` : ''}

                <div class="footer">
                    <p>Generated by Forma AI • ${new Date().getFullYear()}</p>
                    <p style="margin-top:4px;">This is a system-generated document. Please verify all information.</p>
                </div>
            </body>
            </html>
        `;
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 mt-4">Loading form details...</p>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="text-center py-12">
                <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Form not found</h2>
                <p className="text-gray-500 mt-2">The form you're looking for doesn't exist.</p>
                <Link to="/forms" className="mt-4 inline-block">
                    <Button variant="primary">Back to Forms</Button>
                </Link>
            </div>
        );
    }

    const extracted = form.extractedData || {};
    const excludedKeys = ['description', 'extractedAt', 'extractedAtFull'];

    const extractedFields = Object.entries(extracted)
        .filter(([key]) => !excludedKeys.includes(key))
        .filter(([key, value]) => value && value !== 'Not provided' && value !== 'Not specified' && value !== '');

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/forms" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FiArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Form Details</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Reference: {form.reference || 'N/A'} • {form.date || 'N/A'}
                        </p>
                    </div>
                </div>
                <Button variant="primary" size="sm" onClick={handleDownloadPDF}>
                    <FiDownload className="mr-1.5" />
                    Download PDF
                </Button>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${form.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        form.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                    }`}>
                    {form.status || 'Draft'}
                </span>
                <span className="text-sm text-gray-400">
                    Submitted: {form.date || 'N/A'}
                </span>
                {form.submittedAt && (
                    <span className="text-sm text-gray-400">
                        • {new Date(form.submittedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                )}
            </div>

            {/* Extracted Information */}
            <Card>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                    Extracted Information
                </h3>
                {extractedFields.length === 0 ? (
                    <p className="text-gray-500">No extracted information available</p>
                ) : (
                    <div className="space-y-3">
                        {extractedFields.map(([key, value]) => (
                            <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                <span className="text-sm text-gray-500">{formatLabel(key)}</span>
                                <span className="text-sm font-medium text-gray-900">{renderValue(value)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Original Description */}
            {extracted.description && (
                <Card>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiFileText className="w-5 h-5 text-purple-600" />
                        Original Description
                    </h3>
                    <div className="relative">
                        <p className={`text-gray-700 text-sm leading-relaxed whitespace-pre-wrap ${!showFullDescription ? 'max-h-48 overflow-hidden' : ''}`}>
                            {extracted.description}
                        </p>
                        {extracted.description.length > 300 && (
                            <button
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                                {showFullDescription ? (
                                    <>
                                        <FiEyeOff className="w-4 h-4" />
                                        Show Less
                                    </>
                                ) : (
                                    <>
                                        <FiEye className="w-4 h-4" />
                                        Show Full Description
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </Card>
            )}

            {/* Extracted At */}
            {extracted.extractedAt && (
                <div className="text-center text-sm text-gray-400">
                    <FiClock className="inline mr-2" />
                    Extracted on: {extracted.extractedAt}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate('/forms')}>
                    Back to Forms
                </Button>
                <div className="flex-1" />
                <Button variant="primary" onClick={handleDownloadPDF} className="shadow-lg shadow-blue-500/25">
                    <FiDownload className="mr-2" />
                    Download PDF
                </Button>
            </div>
        </div>
    );
};

// Helper functions
const formatLabel = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const renderValue = (value) => {
    if (typeof value === 'boolean') return value ? 'Yes ✅' : 'No ❌';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object' && value !== null) return JSON.stringify(value, null, 2);
    return value || 'Not provided';
};

export default FormDetails;
