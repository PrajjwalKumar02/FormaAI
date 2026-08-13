import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFileText, FiArrowLeft, FiSearch, FiFilter, FiClock, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';

const Forms = () => {
    const { user } = useAuth();
    const [forms, setForms] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadForms();
    }, [user]);

    const loadForms = () => {
        const allForms = JSON.parse(localStorage.getItem('allForms') || '[]');
        const userForms = allForms.filter(f => f.userId === user?.id || !f.userId);

        // ✅ SORT BY DATE - NEWEST FIRST
        const sorted = [...userForms].sort((a, b) => {
            const dateA = new Date(a.submittedAt || a.date || 0);
            const dateB = new Date(b.submittedAt || b.date || 0);
            return dateB - dateA;
        });

        setForms(sorted);
    };

    const filteredForms = forms.filter(f => {
        const matchesSearch = f.title?.toLowerCase().includes(search.toLowerCase()) ||
            f.reference?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || f.status?.toLowerCase() === filter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

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

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'in progress': return 'bg-amber-100 text-amber-700';
            case 'review': return 'bg-blue-100 text-blue-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <FiArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Forms</h1>
                    <p className="text-sm text-gray-500 mt-1">{forms.length} forms total</p>
                </div>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search forms..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-600 outline-none bg-white"
                >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            {/* Form List */}
            {filteredForms.length === 0 ? (
                <div className="text-center py-12">
                    <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                        {search ? 'No forms match your search' : 'No forms created yet'}
                    </p>
                    {!search && (
                        <Link to="/ai-input" className="mt-3 inline-block">
                            <Button variant="primary" size="sm">Create First Form</Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredForms.map((form) => (
                        <motion.div
                            key={form.id || form._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-lg bg-blue-600/10">
                                        <FiFileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{form.title || 'Untitled Form'}</p>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <FiCalendar className="w-3 h-3" />
                                                {formatDateTime(form.submittedAt || form.date)}
                                            </span>
                                            {form.reference && (
                                                <span className="text-xs text-gray-400">Ref: {form.reference}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(form.status)}`}>
                                        {form.status || 'Draft'}
                                    </span>
                                    {/* ✅ FIXED: Use form._id or form.id */}
                                    <Link to={`/form/${form._id || form.id}`} className="text-sm text-blue-600 hover:underline">
                                        View
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Forms;
