import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowLeft,
    FiBarChart2,
    FiFileText,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiCalendar,
    FiFilter,
    FiDownload,
    FiTrendingUp,
    FiTrendingDown,
    FiActivity,
    FiPieChart,
    FiUsers,
    FiAward,
    FiZap,
    FiEye,
    FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const Analytics = () => {
    const { user } = useAuth();
    const [forms, setForms] = useState([]);
    const [filter, setFilter] = useState('all');
    const [period, setPeriod] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        drafts: 0,
    });
    const [monthlyData, setMonthlyData] = useState([]);
    const [statusDistribution, setStatusDistribution] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        loadAnalytics();
    }, [user]);

    const loadAnalytics = () => {
        const allForms = JSON.parse(localStorage.getItem('allForms') || '[]');
        const userForms = allForms.filter(f => f.userId === user?.id || !f.userId);
        setForms(userForms);

        setStats({
            total: userForms.length,
            completed: userForms.filter(f => f.status === 'Completed').length,
            inProgress: userForms.filter(f => f.status === 'In Progress').length,
            drafts: userForms.filter(f => f.status === 'Draft').length,
        });

        const months = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();

        for (let i = 0; i < 12; i++) {
            const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
            months[monthKey] = {
                month: monthNames[i],
                total: 0,
                completed: 0,
                fullMonth: monthNames[i]
            };
        }

        userForms.forEach(form => {
            const date = new Date(form.submittedAt || form.date);
            if (!isNaN(date) && date.getFullYear() === currentYear) {
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (months[monthKey]) {
                    months[monthKey].total++;
                    if (form.status === 'Completed') months[monthKey].completed++;
                }
            }
        });

        setMonthlyData(Object.values(months));

        const statuses = ['Completed', 'In Progress', 'Draft', 'Review'];
        setStatusDistribution(statuses.map(s => ({
            name: s,
            value: userForms.filter(f => f.status === s).length,
        })));

        const sorted = [...userForms].sort((a, b) =>
            new Date(b.submittedAt || b.date) - new Date(a.submittedAt || a.date)
        );
        setRecentActivity(sorted.slice(0, 5));
    };

    // ✅ Fixed: Refresh with bold text
    const handleRefresh = () => {
        loadAnalytics();
        toast.success(
            <div>
                <strong> Data refreshed successfully!</strong>
            </div>,
            {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            }
        );
    };

    const handleExportReport = () => {
        const allForms = JSON.parse(localStorage.getItem('allForms') || '[]');
        const userForms = allForms.filter(f => f.userId === user?.id || !f.userId);

        const reportData = {
            generatedAt: new Date().toISOString(),
            user: user?.name || 'Guest',
            totalForms: userForms.length,
            completed: userForms.filter(f => f.status === 'Completed').length,
            inProgress: userForms.filter(f => f.status === 'In Progress').length,
            drafts: userForms.filter(f => f.status === 'Draft').length,
            forms: userForms.map(f => ({
                title: f.title || 'Untitled',
                status: f.status || 'Draft',
                date: f.date || f.submittedAt,
                reference: f.reference || 'N/A',
            })),
        };

        let csv = 'Title,Status,Date,Reference\n';
        reportData.forms.forEach(f => {
            csv += `"${f.title}","${f.status}","${f.date}","${f.reference}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success(
            <div>
                <strong>✅ Report exported successfully!</strong>
            </div>,
            {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            }
        );
    };

    const getFilteredForms = () => {
        let filtered = [...forms];
        if (filter !== 'all') {
            filtered = filtered.filter(f => f.status === filter);
        }
        return filtered;
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            if (isNaN(date)) return dateStr;
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

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    const filteredForms = getFilteredForms();

    const statCards = [
        {
            label: 'Total Forms',
            value: stats.total,
            icon: FiFileText,
            color: 'from-blue-500 to-cyan-400',
            change: stats.total > 0 ? '+12%' : '0%'
        },
        {
            label: 'Completed',
            value: stats.completed,
            icon: FiCheckCircle,
            color: 'from-emerald-500 to-teal-400',
            change: stats.completed > 0 ? '+8%' : '0%'
        },
        {
            label: 'In Progress',
            value: stats.inProgress,
            icon: FiClock,
            color: 'from-amber-500 to-orange-400',
            change: stats.inProgress > 0 ? '+5%' : '0%'
        },
        {
            label: 'Drafts',
            value: stats.drafts,
            icon: FiAlertCircle,
            color: 'from-purple-500 to-pink-400',
            change: stats.drafts > 0 ? '-3%' : '0%'
        },
    ];

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FiArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Track your form performance</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Refresh data"
                    >
                        <FiRefreshCw className="w-5 h-5 text-gray-500" />
                    </button>
                    <Button variant="outline" size="sm" onClick={handleExportReport}>
                        <FiDownload className="mr-1.5" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                <div className={`inline-flex items-center gap-1 mt-1.5 text-xs font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : stat.change === '0%' ? 'text-gray-400' : 'text-red-500'}`}>
                                    <span>{stat.change}</span>
                                    <span className="text-gray-400">vs last month</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl bg-linear-to-r ${stat.color} shadow-lg`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Completion Rate */}
                <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiTrendingUp className="w-5 h-5 text-blue-600" />
                        Completion Rate
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="flex-1">
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1.5">
                                <span className="text-xs text-gray-400">0%</span>
                                <span className="text-xs text-gray-400">100%</span>
                            </div>
                        </div>
                        <div className="text-center min-w-20">
                            <p className="text-3xl font-bold text-blue-600">{completionRate}%</p>
                            <p className="text-xs text-gray-400">Success Rate</p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm font-bold text-gray-900">{stats.completed}</p>
                            <p className="text-xs text-gray-400">Completed</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm font-bold text-gray-900">{stats.total - stats.completed}</p>
                            <p className="text-xs text-gray-400">Pending</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm font-bold text-gray-900">{stats.total}</p>
                            <p className="text-xs text-gray-400">Total</p>
                        </div>
                    </div>
                </Card>

                {/* Status Distribution */}
                <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiPieChart className="w-5 h-5 text-purple-600" />
                        Status Distribution
                    </h3>
                    <div className="space-y-3">
                        {statusDistribution.map((item) => (
                            <div key={item.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">{item.name}</span>
                                    <span className="font-medium text-gray-900">{item.value}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${item.name === 'Completed' ? 'bg-emerald-500' :
                                                item.name === 'In Progress' ? 'bg-amber-500' :
                                                    item.name === 'Draft' ? 'bg-purple-500' :
                                                        'bg-blue-500'
                                            }`}
                                        style={{
                                            width: `${stats.total > 0 ? Math.min((item.value / stats.total) * 100, 100) : 0}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-gray-500">Total forms analyzed</span>
                        <span className="text-sm font-bold text-gray-900">{stats.total}</span>
                    </div>
                </Card>
            </div>

            {/* Monthly Activity */}
            <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiActivity className="w-5 h-5 text-indigo-600" />
                    Monthly Activity
                </h3>
                {monthlyData.length === 0 || monthlyData.every(d => d.total === 0) ? (
                    <div className="text-center py-8">
                        <FiBarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No data available yet</p>
                        <p className="text-sm text-gray-400 mt-1">Submit forms to see activity</p>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-end gap-2 h-48">
                            {monthlyData.map((item, index) => {
                                const maxTotal = Math.max(...monthlyData.map(d => d.total), 1);
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="flex items-end gap-1 w-full justify-center">
                                            <div
                                                className="w-7.5 bg-linear-to-t from-blue-600 to-cyan-400 rounded-t transition-all duration-1000 hover:scale-105"
                                                style={{
                                                    height: `${Math.max((item.total / maxTotal) * 140, 4)}px`,
                                                    minHeight: '4px'
                                                }}
                                                title={`${item.month}: ${item.total} total forms`}
                                            />
                                            <div
                                                className="w-7.5 bg-emerald-500 rounded-t transition-all duration-1000 hover:scale-105"
                                                style={{
                                                    height: `${Math.max((item.completed / maxTotal) * 140, 2)}px`,
                                                    minHeight: '2px'
                                                }}
                                                title={`${item.month}: ${item.completed} completed forms`}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 font-medium">{item.month}</p>
                                        <div className="flex gap-1 mt-0.5">
                                            <span className="text-[9px] text-blue-600 font-medium">{item.total}</span>
                                            <span className="text-[9px] text-emerald-600 font-medium">{item.completed}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-center gap-6 mt-4 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-linear-to-t from-blue-600 to-cyan-400" />
                                <span className="text-gray-500">Total Forms</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-emerald-500" />
                                <span className="text-gray-500">Completed</span>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Filters & Recent Forms */}
            <div className="grid lg:grid-cols-4 gap-6">
                <Card className="p-6 lg:col-span-1">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiFilter className="w-5 h-5 text-gray-600" />
                        Filters
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                                Status
                            </label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                            >
                                <option value="all">All Status</option>
                                <option value="Completed">Completed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Draft">Draft</option>
                                <option value="Review">Review</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                                Period
                            </label>
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                            >
                                <option value="all">All Time</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                                <option value="quarter">Last 90 Days</option>
                            </select>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                                Showing {filteredForms.length} of {forms.length} forms
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FiFileText className="w-5 h-5 text-gray-600" />
                            Recent Activity
                        </h3>
                        <Link to="/forms" className="text-sm text-blue-600 hover:underline">
                            View All
                        </Link>
                    </div>
                    {filteredForms.length === 0 ? (
                        <div className="text-center py-8">
                            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No forms to display</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredForms.slice(0, 5).map((form) => (
                                <div key={form.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${form.status === 'Completed' ? 'bg-emerald-50' :
                                                form.status === 'In Progress' ? 'bg-amber-50' :
                                                    'bg-purple-50'
                                            }`}>
                                            <FiFileText className={`w-4 h-4 ${form.status === 'Completed' ? 'text-emerald-600' :
                                                    form.status === 'In Progress' ? 'text-amber-600' :
                                                        'text-purple-600'
                                                }`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{form.title}</p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <span className={`text-xs font-medium ${form.status === 'Completed' ? 'text-emerald-600' :
                                                        form.status === 'In Progress' ? 'text-amber-600' :
                                                            'text-purple-600'
                                                    }`}>
                                                    {form.status}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {formatDateTime(form.submittedAt || form.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link to={`/form/${form.id}`} className="text-sm text-blue-600 hover:underline">
                                        View
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Avg. Completion Time', value: stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '0%', icon: FiClock, color: 'from-blue-500 to-cyan-400' },
                    {
                        label: 'Forms This Month', value: forms.filter(f => {
                            const date = new Date(f.submittedAt || f.date);
                            const now = new Date();
                            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                        }).length, icon: FiCalendar, color: 'from-emerald-500 to-teal-400'
                    },
                    { label: 'Success Rate', value: `${completionRate}%`, icon: FiAward, color: 'from-purple-500 to-pink-400' },
                    { label: 'Active Users', value: '1', icon: FiUsers, color: 'from-orange-500 to-amber-400' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                                <p className="text-lg font-bold text-gray-900 mt-0.5">{stat.value}</p>
                            </div>
                            <div className={`p-2.5 rounded-xl bg-linear-to-r ${stat.color}`}>
                                <stat.icon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Analytics;
