import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiArrowLeft, 
    FiEdit, 
    FiTrash2, 
    FiMapPin, 
    FiCalendar,
    FiUser,
    FiClock,
    FiAlertCircle,
    FiCheckCircle,
    FiMessageSquare,
    FiSend,
    FiSave,
    FiX,
    FiRefreshCw,
    FiClipboard,
    FiTag,
    FiMail,
    FiPhone,
    FiPaperclip,
    FiDownload,
    FiEye,
    FiEyeOff,
    FiMoreVertical,
    FiShare2,
    FiBookmark
} from 'react-icons/fi';
import { useIncidents } from '../hooks/useIncidents';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import Card from '../components/Card'; 
import Button from '../components/Button'; 
import Loader from '../components/Loader'; 
import { formatDate, formatTimeAgo, getSeverityColor, getStatusColor } from '../utils/formatters';

const IncidentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { 
        selectedIncident, 
        loading, 
        getIncident, 
        deleteIncident,
        updateIncident 
    } = useIncidents();
    const { showSuccess, showError } = useNotifications();
    
    const [comment, setComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showTimeline, setShowTimeline] = useState(true);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        if (id) {
            getIncident(id);
        }
    }, [id]);

    useEffect(() => {
        if (selectedIncident) {
            setEditData({
                type: selectedIncident.type || '',
                severity: selectedIncident.severity || '',
                status: selectedIncident.status || '',
                location: selectedIncident.location?.address || '',
                description: selectedIncident.description || '',
                parties: selectedIncident.parties?.involved || []
            });
        }
    }, [selectedIncident]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this incident?')) {
            const result = await deleteIncident(id);
            if (result.success) {
                showSuccess('Incident deleted successfully');
                navigate('/dashboard');
            } else {
                showError('Failed to delete incident');
            }
        }
    };

    const handleUpdate = async () => {
        setIsSubmitting(true);
        const result = await updateIncident(id, editData);
        setIsSubmitting(false);
        
        if (result.success) {
            showSuccess('Incident updated successfully');
            setIsEditing(false);
        } else {
            showError('Failed to update incident');
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) {
            showError('Please enter a comment');
            return;
        }
        
        // Add comment logic here
        // await addComment(id, comment);
        setComment('');
        showSuccess('Comment added');
    };

    const handleCancelEdit = () => {
        setEditData({
            type: selectedIncident?.type || '',
            severity: selectedIncident?.severity || '',
            status: selectedIncident?.status || '',
            location: selectedIncident?.location?.address || '',
            description: selectedIncident?.description || '',
            parties: selectedIncident?.parties?.involved || []
        });
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleRefresh = () => {
        getIncident(id);
        showSuccess('Refreshed');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Incident: ${selectedIncident?.type}`,
                text: `Check out this incident report: ${selectedIncident?.type}`,
                url: window.location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            showSuccess('Link copied to clipboard');
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!selectedIncident) {
        return (
            <div className="text-center py-12">
                <FiAlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Incident Not Found</h2>
                <p className="text-gray-500 mb-4">The incident you're looking for doesn't exist.</p>
                <Link to="/dashboard">
                    <Button variant="primary">Go to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FiArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Edit Incident' : selectedIncident.type || 'Incident Detail'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            ID: {selectedIncident._id?.slice(-8)}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                    >
                        <FiRefreshCw className="mr-1.5" />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                    >
                        <FiShare2 className="mr-1.5" />
                        Share
                    </Button>
                    {!isEditing && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <FiEdit className="mr-1.5" />
                            Edit
                        </Button>
                    )}
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={handleDelete}
                    >
                        <FiTrash2 className="mr-1.5" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getSeverityColor(selectedIncident.severity)}-100 text-${getSeverityColor(selectedIncident.severity)}-700`}>
                    {selectedIncident.severity || 'N/A'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getStatusColor(selectedIncident.status)}-100 text-${getStatusColor(selectedIncident.status)}-700`}>
                    {selectedIncident.status || 'N/A'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    {selectedIncident.type || 'N/A'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    {formatTimeAgo(selectedIncident.createdAt)}
                </span>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Incident Details</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                        activeTab === 'details' 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('timeline')}
                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                        activeTab === 'timeline' 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    Timeline
                                </button>
                            </div>
                        </div>

                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                {isEditing ? (
                                    // Edit Mode
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Type</label>
                                            <select
                                                name="type"
                                                value={editData.type}
                                                onChange={handleInputChange}
                                                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                            >
                                                <option value="Accident">Accident</option>
                                                <option value="Fire Incident">Fire Incident</option>
                                                <option value="Theft">Theft</option>
                                                <option value="Injury">Injury</option>
                                                <option value="Property Damage">Property Damage</option>
                                                <option value="Natural Disaster">Natural Disaster</option>
                                                <option value="Harassment">Harassment</option>
                                                <option value="General Incident">General Incident</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Severity</label>
                                            <select
                                                name="severity"
                                                value={editData.severity}
                                                onChange={handleInputChange}
                                                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                                <option value="Critical">Critical</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                name="status"
                                                value={editData.status}
                                                onChange={handleInputChange}
                                                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                            >
                                                <option value="Reported">Reported</option>
                                                <option value="Under Review">Under Review</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                                <option value="Closed">Closed</option>
                                                <option value="Draft">Draft</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={editData.location}
                                                onChange={handleInputChange}
                                                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                name="description"
                                                value={editData.description}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all resize-none"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <Button variant="primary" onClick={handleUpdate} isLoading={isSubmitting}>
                                                <FiSave className="mr-1.5" />
                                                Save Changes
                                            </Button>
                                            <Button variant="outline" onClick={handleCancelEdit}>
                                                <FiX className="mr-1.5" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Type</p>
                                                <p className="text-sm text-gray-900">{selectedIncident.type || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Severity</p>
                                                <p className="text-sm text-gray-900">{selectedIncident.severity || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Status</p>
                                                <p className="text-sm text-gray-900">{selectedIncident.status || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Location</p>
                                                <p className="text-sm text-gray-900">{selectedIncident.location?.address || 'Not specified'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Description</p>
                                            <p className="text-sm text-gray-600 mt-1">{selectedIncident.description || 'No description provided'}</p>
                                        </div>
                                        {selectedIncident.parties?.involved?.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Parties Involved</p>
                                                <div className="mt-2 space-y-1">
                                                    {selectedIncident.parties.involved.map((party, index) => (
                                                        <div key={index} className="text-sm text-gray-600">
                                                            • {party.name} {party.role && `(${party.role})`}
                                                            {party.contact && ` - ${party.contact}`}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="space-y-4">
                                {selectedIncident.timeline?.length > 0 ? (
                                    selectedIncident.timeline.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="relative">
                                                <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5"></div>
                                                {index < selectedIncident.timeline.length - 1 && (
                                                    <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-200"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 pb-6">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {item.event || 'Update'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatTimeAgo(item.timestamp)}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {item.description || 'No description'}
                                                </p>
                                                {item.user && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        By: {item.user.name || 'Unknown'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No timeline events</p>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Comments Section */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FiMessageSquare className="w-5 h-5" />
                            Comments
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                ({selectedIncident.comments?.length || 0})
                            </span>
                        </h3>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {selectedIncident.comments?.length > 0 ? (
                                selectedIncident.comments.map((comment, index) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                                                    {comment.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {comment.user?.name || 'Unknown'}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {formatTimeAgo(comment.createdAt)}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 ml-8">{comment.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No comments yet</p>
                            )}
                        </div>

                        {/* Add Comment */}
                        <div className="flex gap-2 mt-4">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            <Button variant="primary" onClick={handleAddComment}>
                                <FiSend className="mr-1.5" />
                                Send
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                                <FiClipboard className="w-5 h-5 text-blue-600" />
                                <span className="text-sm text-gray-700">Copy Incident ID</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                                <FiDownload className="w-5 h-5 text-blue-600" />
                                <span className="text-sm text-gray-700">Export Report</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                                <FiBookmark className="w-5 h-5 text-blue-600" />
                                <span className="text-sm text-gray-700">Save for Later</span>
                            </button>
                        </div>
                    </Card>

                    {/* Incident Info */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Incident Info</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <FiUser className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Reported By</p>
                                    <p className="text-sm text-gray-900">{selectedIncident.user?.name || 'Unknown'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiCalendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Reported On</p>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(selectedIncident.createdAt, 'MMM DD, YYYY HH:mm A')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiClock className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Last Updated</p>
                                    <p className="text-sm text-gray-900">
                                        {formatTimeAgo(selectedIncident.updatedAt)}
                                    </p>
                                </div>
                            </div>
                            {selectedIncident.location?.address && (
                                <div className="flex items-start gap-3">
                                    <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Location</p>
                                        <p className="text-sm text-gray-900">{selectedIncident.location.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Tags */}
                    {selectedIncident.tags?.length > 0 && (
                        <Card className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiTag className="w-4 h-4" />
                                Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedIncident.tags.map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IncidentDetail;