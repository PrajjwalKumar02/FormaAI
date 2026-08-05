import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiArrowLeft, 
    FiUser, 
    FiMail, 
    FiCalendar, 
    FiEdit, 
    FiSave,
    FiFileText,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiShield,
    FiLock,
    FiBell,
    FiGlobe,
    FiLogOut,
    FiMapPin,
    FiPhone,
    FiBriefcase,
    FiTwitter,
    FiGithub,
    FiLinkedin,
    FiX,
    FiTrendingUp,
    FiActivity,
    FiAward,
    FiZap,
    FiCamera,
    FiTrash2
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        website: '',
        twitter: '',
        linkedin: '',
        github: '',
        company: '',
        jobTitle: '',
    });
    const [formsStats, setFormsStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        drafts: 0,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                website: user.website || '',
                twitter: user.twitter || '',
                linkedin: user.linkedin || '',
                github: user.github || '',
                company: user.company || '',
                jobTitle: user.jobTitle || '',
            });
            // Load profile image from localStorage
            const savedImage = localStorage.getItem('profileImage');
            if (savedImage) {
                setProfileImage(savedImage);
                setImagePreview(savedImage);
            }
        }

        const allForms = JSON.parse(localStorage.getItem('allForms') || '[]');
        const userForms = allForms.filter(f => f.userId === user?.id || !f.userId);
        setFormsStats({
            total: userForms.length,
            completed: userForms.filter(f => f.status === 'Completed').length,
            inProgress: userForms.filter(f => f.status === 'In Progress').length,
            drafts: userForms.filter(f => f.status === 'Draft').length,
        });
    }, [user]);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            location: user?.location || '',
            bio: user?.bio || '',
            website: user?.website || '',
            twitter: user?.twitter || '',
            linkedin: user?.linkedin || '',
            github: user?.github || '',
            company: user?.company || '',
            jobTitle: user?.jobTitle || '',
        });
        setIsEditing(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const index = registeredUsers.findIndex(u => u.id === user?.id);
            if (index !== -1) {
                registeredUsers[index] = { ...registeredUsers[index], ...formData };
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            }
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Error saving profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogout = () => { logout(); navigate('/'); };

    const handleChangePassword = () => {
        toast.info('Password reset link will be sent to your registered email address.');
    };

    // Profile Picture Functions
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file.');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result;
                setProfileImage(imageData);
                setImagePreview(imageData);
                localStorage.setItem('profileImage', imageData);
                toast.success('Profile picture updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        setImagePreview(null);
        localStorage.removeItem('profileImage');
        toast.info('Profile picture removed.');
    };

    const stats = [
        { label: 'Total Forms', value: formsStats.total, icon: FiFileText, color: 'from-blue-500 to-cyan-400', desc: 'All time' },
        { label: 'Completed', value: formsStats.completed, icon: FiCheckCircle, color: 'from-emerald-500 to-teal-400', desc: 'Success rate' },
        { label: 'In Progress', value: formsStats.inProgress, icon: FiClock, color: 'from-amber-500 to-orange-400', desc: 'Pending' },
        { label: 'Drafts', value: formsStats.drafts, icon: FiAlertCircle, color: 'from-purple-500 to-pink-400', desc: 'Saved' },
    ];

    const quickActions = [
        { label: 'New Form', icon: FiZap, path: '/ai-input', color: 'blue' },
        { label: 'All Forms', icon: FiFileText, path: '/forms', color: 'green' },
        { label: 'Dashboard', icon: FiTrendingUp, path: '/dashboard', color: 'purple' },
        { label: 'Analytics', icon: FiActivity, path: '/analytics', color: 'orange' },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FiArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage your personal information</p>
                    </div>
                </div>
                {isEditing ? (
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCancel}>
                            <FiX className="mr-1.5" />
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving}>
                            <FiSave className="mr-1.5" />
                            Save Changes
                        </Button>
                    </div>
                ) : (
                    <Button variant="primary" size="sm" onClick={handleEdit}>
                        <FiEdit className="mr-1.5" />
                        Edit Profile
                    </Button>
                )}
            </div>

            {/* Profile Header with Image Upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Profile Picture with Upload */}
                    <div className="relative group">
                        <div 
                            className="w-24 h-24 rounded-full bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/25 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                            onClick={handleImageClick}
                        >
                            {imagePreview ? (
                                <img 
                                    src={imagePreview} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user?.name?.charAt(0)?.toUpperCase() || 'U'
                            )}
                        </div>
                        {/* Camera Icon Overlay */}
                        <button
                            onClick={handleImageClick}
                            className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-lg"
                            title="Upload profile picture"
                        >
                            <FiCamera className="w-3.5 h-3.5" />
                        </button>
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {/* Remove image button */}
                        {imagePreview && (
                            <button
                                onClick={handleRemoveImage}
                                className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
                                title="Remove profile picture"
                            >
                                <FiTrash2 className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Guest'}</h2>
                            <span className="px-3 py-0.5 bg-green-100 text-green-700 text-xs rounded-full inline-flex items-center gap-1 w-fit">
                                <FiCheckCircle className="w-3 h-3" /> Verified
                            </span>
                        </div>
                        <p className="text-gray-500">{user?.email || 'guest@example.com'}</p>
                        {formData.location && (
                            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                                <FiMapPin className="w-3.5 h-3.5" />
                                {formData.location}
                            </p>
                        )}
                        {!isEditing && formData.bio && (
                            <p className="text-sm text-gray-600 mt-2 max-w-lg">{formData.bio}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            {imagePreview ? 'Click on avatar to change' : 'Click on avatar to upload'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{stat.desc}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-linear-to-r ${stat.color} shadow-lg shadow-${stat.color.split('-')[1]}/20`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Personal Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-blue-600/10">
                                <FiUser className="w-4 h-4 text-blue-600" />
                            </div>
                            Personal Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900 mt-1.5">{user?.name || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900 mt-1.5">{user?.email || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900 mt-1.5">{formData.phone || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="City, Country"
                                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900 mt-1.5">{formData.location || 'Not set'}</p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</label>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Tell us about yourself..."
                                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all resize-none"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600 mt-1.5">{formData.bio || 'No bio provided'}</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-purple-600/10">
                                <FiBriefcase className="w-4 h-4 text-purple-600" />
                            </div>
                            Work Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Company</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Company name"
                                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900 mt-1.5">{formData.company || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                        placeholder="Job title"
                                        className="w-full mt-1.5 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900 mt-1.5">{formData.jobTitle || 'Not set'}</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-orange-600/10">
                                <FiZap className="w-4 h-4 text-orange-600" />
                            </div>
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.label}
                                    to={action.path}
                                    className={`p-3 rounded-xl bg-${action.color}-50 hover:bg-${action.color}-100 transition-colors text-center group`}
                                >
                                    <action.icon className={`w-5 h-5 text-${action.color}-600 mx-auto mb-1 group-hover:scale-110 transition-transform`} />
                                    <span className={`text-xs font-medium text-${action.color}-700`}>{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </Card>

                    {/* Social Links */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-cyan-600/10">
                                <FiGlobe className="w-4 h-4 text-cyan-600" />
                            </div>
                            Social Links
                        </h3>
                        <div className="space-y-3">
                            {[
                                { key: 'website', icon: FiGlobe, label: 'Website', placeholder: 'https://yourwebsite.com' },
                                { key: 'twitter', icon: FiTwitter, label: 'Twitter', placeholder: '@username' },
                                { key: 'linkedin', icon: FiLinkedin, label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
                                { key: 'github', icon: FiGithub, label: 'GitHub', placeholder: 'github.com/username' },
                            ].map((field) => (
                                <div key={field.key}>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <field.icon className="w-3.5 h-3.5" />
                                        {field.label}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name={field.key}
                                            value={formData[field.key]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-sm"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600 mt-1">{formData[field.key] || 'Not set'}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Security */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-red-600/10">
                                <FiShield className="w-4 h-4 text-red-600" />
                            </div>
                            Security
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={handleChangePassword}
                                className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-amber-100">
                                        <FiLock className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900">Change Password</p>
                                        <p className="text-xs text-gray-500">Receive reset link via email</p>
                                    </div>
                                </div>
                                <span className="text-sm text-blue-600 group-hover:underline">Reset</span>
                            </button>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <FiBell className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                                        <p className="text-xs text-gray-500">Receive updates about your forms</p>
                                    </div>
                                </div>
                                <button 
                                    className="text-sm text-blue-600 hover:underline"
                                    onClick={() => toast.info('📧 Notification settings will be available soon.')}
                                >
                                    Manage
                                </button>
                            </div>
                        </div>
                    </Card>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200 hover:border-red-300"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
