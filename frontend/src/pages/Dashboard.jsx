import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiFileText, 
    FiPlus, 
    FiClock, 
    FiCheckCircle, 
    FiAlertCircle,
    FiArrowRight,
    FiTrendingUp,
    FiCalendar
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';

const Dashboard = () => {
    const { user } = useAuth();
    const [recentForms, setRecentForms] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, drafts: 0 });

    useEffect(() => {
        // Load forms from localStorage
        const allForms = JSON.parse(localStorage.getItem('allForms') || '[]');
        const userForms = allForms.filter(f => f.userId === user?.id || !f.userId);
        
        setStats({
            total: userForms.length,
            completed: userForms.filter(f => f.status === 'Completed').length,
            inProgress: userForms.filter(f => f.status === 'In Progress').length,
            drafts: userForms.filter(f => f.status === 'Draft').length,
        });

        // ✅ Sort by date - NEWEST FIRST
        const sorted = [...userForms].sort((a, b) => {
            const dateA = new Date(a.submittedAt || a.date || 0);
            const dateB = new Date(b.submittedAt || b.date || 0);
            return dateB - dateA;
        });
        
        // Get recent forms (last 5)
        setRecentForms(sorted.slice(0, 5));
    }, [user]);

    // ✅ Format date and time
    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${day}/${month}/${year} at ${hours}:${minutes} ${ampm}`;
        } catch {
            return dateStr;
        }
    };

    const statCards = [
        { label: 'Total Forms', value: stats.total, icon: FiFileText, color: 'from-blue-500 to-cyan-400' },
        { label: 'Completed', value: stats.completed, icon: FiCheckCircle, color: 'from-emerald-500 to-teal-400' },
        { label: 'In Progress', value: stats.inProgress, icon: FiClock, color: 'from-amber-500 to-orange-400' },
        { label: 'Drafts', value: stats.drafts, icon: FiAlertCircle, color: 'from-purple-500 to-pink-400' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user?.name || 'Guest'}! 👋
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {stats.total === 0 ? 'Start creating your first form today!' : `You have ${stats.total} forms processed.`}
                    </p>
                </div>
                <Link to="/ai-input" className="mt-4 md:mt-0">
                    <Button variant="primary" className="shadow-lg shadow-blue-500/25">
                        <FiPlus className="mr-2" />
                        New Form
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="card"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-linear-to-r ${stat.color}`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="quick-action">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                            <p className="text-sm text-gray-500 mt-1">Start a new form</p>
                            <Link to="/ai-input" className="mt-4 inline-block">
                                <Button variant="primary" size="sm">New Form</Button>
                            </Link>
                        </div>
                        <div className="p-3 bg-linear-to-br from-blue-600 to-cyan-400 rounded-xl">
                            <FiPlus className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="quick-action">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                            <p className="text-sm text-gray-500 mt-1">Let AI help you</p>
                            <Link to="/ai-input" className="mt-4 inline-block">
                                <Button variant="secondary" size="sm">
                                    Try AI Assistant
                                    <FiArrowRight className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                        <div className="p-3 bg-linear-to-br from-purple-600 to-pink-400 rounded-xl">
                            <FiTrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Recent Forms - With Date & Time, Newest First */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Forms</h2>
                    <Link to="/forms" className="text-sm text-blue-600 hover:underline">
                        View All ({stats.total})
                    </Link>
                </div>

                {recentForms.length === 0 ? (
                    <div className="text-center py-12">
                        <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No forms yet</p>
                        <Link to="/ai-input" className="mt-3 inline-block">
                            <Button variant="primary" size="sm">Create First Form</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentForms.map((form) => (
                            <div key={form.id} className="recent-item flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-lg bg-blue-600/10">
                                        <FiFileText className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{form.title}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <FiCalendar className="w-3 h-3" />
                                            {formatDateTime(form.submittedAt || form.date)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-medium ${
                                        form.status === 'Completed' ? 'status-completed' :
                                        form.status === 'In Progress' ? 'status-inprogress' :
                                        'status-draft'
                                    }`}>
                                        {form.status}
                                    </span>
                                    <Link to={`/form/${form.id}`} className="text-sm text-blue-600 hover:underline">
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
