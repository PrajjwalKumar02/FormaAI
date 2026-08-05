import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiArrowLeft, 
    FiBell, 
    FiLock, 
    FiGlobe, 
    FiShield,
    FiTrash2,
    FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('notifications');
    const [settings, setSettings] = useState({
        // Notifications
        emailNotifications: true,
        pushNotifications: true,
        formUpdates: true,
        securityAlerts: true,
        marketingEmails: false,
        
        // Privacy
        profileVisibility: 'public',
        showEmail: true,
        showPhone: false,
        showLocation: true,
        activityStatus: true,
        
        // Security
        twoFactorAuth: false,
        sessionTimeout: '30',
        loginAlerts: true,
        
        // Preferences
        language: 'English',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
    });

    // Load saved settings on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    }, []);

    // Auto-save function
    const autoSave = (newSettings) => {
        try {
            localStorage.setItem('userSettings', JSON.stringify(newSettings));
            // Show a subtle success toast (optional - you can remove this if you want)
            // toast.success('Settings saved!', { autoClose: 1000 });
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        }
    };

    // Handle select/input changes
    const handleChange = (key, value) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };
            autoSave(newSettings);
            return newSettings;
        });
    };

    // Handle toggle changes
    const handleToggle = (key) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: !prev[key] };
            autoSave(newSettings);
            return newSettings;
        });
    };

    const tabs = [
        { id: 'notifications', label: 'Notifications', icon: FiBell },
        { id: 'privacy', label: 'Privacy', icon: FiShield },
        { id: 'security', label: 'Security', icon: FiLock },
        { id: 'preferences', label: 'Preferences', icon: FiGlobe },
    ];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header - Removed Save button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FiArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Changes are saved automatically</p>
                    </div>
                </div>
                {/* Auto-save indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Auto-save enabled</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                        <p className="text-sm text-gray-500 mb-4">Toggle any option to save instantly</p>
                        <div className="space-y-3">
                            {[
                                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                                { key: 'formUpdates', label: 'Form Updates', desc: 'Get notified about form status changes' },
                                { key: 'securityAlerts', label: 'Security Alerts', desc: 'Receive important security notifications' },
                                { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional emails and updates' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(item.key)}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                            settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                        <p className="text-sm text-gray-500 mb-4">Changes are saved automatically</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Profile Visibility</label>
                                <select
                                    value={settings.profileVisibility}
                                    onChange={(e) => handleChange('profileVisibility', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="contacts">Contacts Only</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { key: 'showEmail', label: 'Show Email Address' },
                                    { key: 'showPhone', label: 'Show Phone Number' },
                                    { key: 'showLocation', label: 'Show Location' },
                                    { key: 'activityStatus', label: 'Show Activity Status' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                                        <button
                                            onClick={() => handleToggle(item.key)}
                                            className={`w-12 h-6 rounded-full transition-colors ${
                                                settings[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                                settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
                        <p className="text-sm text-gray-500 mb-4">Changes are saved automatically</p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                                </div>
                                <button
                                    onClick={() => handleToggle('twoFactorAuth')}
                                    className={`w-12 h-6 rounded-full transition-colors ${
                                        settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                        settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Session Timeout</label>
                                <select
                                    value={settings.sessionTimeout}
                                    onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="120">2 hours</option>
                                    <option value="240">4 hours</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Login Alerts</p>
                                    <p className="text-xs text-gray-500">Get notified of new logins</p>
                                </div>
                                <button
                                    onClick={() => handleToggle('loginAlerts')}
                                    className={`w-12 h-6 rounded-full transition-colors ${
                                        settings.loginAlerts ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                        settings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>
                            <button className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5">
                                <FiTrash2 className="w-4 h-4" />
                                Delete Account
                            </button>
                        </div>
                    </Card>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Language & Region</h3>
                        <p className="text-sm text-gray-500 mb-4">Changes are saved automatically</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Language</label>
                                <select
                                    value={settings.language}
                                    onChange={(e) => handleChange('language', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="German">German</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Timezone</label>
                                <select
                                    value={settings.timezone}
                                    onChange={(e) => handleChange('timezone', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                >
                                    <option value="Asia/Kolkata">Asia/Kolkata (UTC +5:30)</option>
                                    <option value="Asia/Dubai">Asia/Dubai (UTC +4:00)</option>
                                    <option value="America/New_York">America/New_York (UTC -5:00)</option>
                                    <option value="Europe/London">Europe/London (UTC +0:00)</option>
                                    <option value="Australia/Sydney">Australia/Sydney (UTC +11:00)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Date Format</label>
                                <select
                                    value={settings.dateFormat}
                                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                >
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                    <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                )}
            </motion.div>
        </div>
    );
};

export default Settings;
