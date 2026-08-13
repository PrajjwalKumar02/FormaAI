import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
    FiZap,
    FiShield,
    FiClock,
    FiUsers,
    FiArrowRight,
    FiStar,
    FiCheckCircle,
    FiEdit,
    FiSave,
    FiSend,
    FiGithub,
    FiTwitter,
    FiLinkedin,
    FiMail,
    FiMenu,
    FiX
} from 'react-icons/fi';
import { FaRobot, FaBrain, FaRocket } from 'react-icons/fa';
import Button from '../components/Button';
import Card from '../components/Card';

const Landing = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const navigate = useNavigate();

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const features = [
        {
            icon: <FaRobot className="w-6 h-6" />,
            title: 'AI-Powered Extraction',
            description: 'Advanced NLP extracts key information from natural language descriptions with 98% accuracy.',
            color: 'from-blue-500 to-cyan-400'
        },
        {
            icon: <FiShield className="w-6 h-6" />,
            title: 'Enterprise Security',
            description: 'Bank-grade encryption and security protocols protect your sensitive data at every step.',
            color: 'from-purple-500 to-pink-400'
        },
        {
            icon: <FiClock className="w-6 h-6" />,
            title: 'Real-time Processing',
            description: 'Lightning-fast AI processing delivers results in milliseconds, not minutes.',
            color: 'from-emerald-500 to-teal-400'
        },
        {
            icon: <FiUsers className="w-6 h-6" />,
            title: 'Team Collaboration',
            description: 'Seamlessly collaborate with your team on forms, drafts, and submissions in real-time.',
            color: 'from-orange-500 to-amber-400'
        },
        {
            icon: <FaBrain className="w-6 h-6" />,
            title: 'Smart Validation',
            description: 'Intelligent validation ensures data accuracy and completeness before submission.',
            color: 'from-indigo-500 to-blue-400'
        },
        {
            icon: <FiSave className="w-6 h-6" />,
            title: 'Auto-Save Drafts',
            description: 'Never lose your work with automatic draft saving and version history.',
            color: 'from-rose-500 to-pink-400'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Active Users' },
        { number: '98%', label: 'Accuracy Rate' },
        { number: '500K+', label: 'Forms Processed' },
        { number: '4.9★', label: 'User Rating' }
    ];

    const testimonials = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Chief Innovation Officer, HealthTech Corp',
            content: 'Forma AI has completely transformed our claims processing. We reduced processing time by 75% and improved accuracy by 40%.',
            rating: 5,
            image: 'SJ'
        },
        {
            name: 'Michael Chen',
            role: 'VP of Engineering, FinTech Solutions',
            content: 'The dynamic form generation is a game-changer. Our team saves hundreds of hours previously spent on manual form creation.',
            rating: 5,
            image: 'MC'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Operations Director, Global Insurance',
            content: 'The AI extraction accuracy is remarkable. This is the future of form processing and data management.',
            rating: 5,
            image: 'ER'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 shadow-lg shadow-blue-500/25">
                                <FiZap className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">
                                <span className="text-blue-600">Forma</span>
                                <span className="text-cyan-500">AI</span>
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</a>
                            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">How It Works</a>
                            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                Log In
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm" className="shadow-lg shadow-blue-500/25">
                                    Get Started Free
                                    <FiArrowRight className="ml-2" />
                                </Button>
                            </Link>
                        </div>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <a href="#features" className="block px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Features</a>
                            <a href="#how-it-works" className="block px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">How It Works</a>
                            <a href="#testimonials" className="block px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Testimonials</a>
                            <Link to="/login" className="block px-4 py-2 text-blue-600 font-medium">Log In</Link>
                            <Link to="/register" className="block px-4 py-2 bg-blue-600 text-white rounded-xl text-center font-medium">
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30" />
                <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 text-sm font-medium mb-6 border border-blue-600/10">
                                <FaRocket className="w-4 h-4" />
                                <span>🚀 AI-Powered Form Engine v2.0</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                                Transform Text into
                                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%] animate-gradient"> Intelligent Forms</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                                Describe any incident in natural language and watch as Forma AI automatically extracts, structures, and generates intelligent forms with unprecedented accuracy.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/register">
                                    <Button variant="primary" size="lg" className="shadow-xl shadow-blue-500/30 group">
                                        Start Free Trial
                                        <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => {
                                        console.log('Watch Demo clicked');
                                        alert('🎬 Demo video coming soon!\n\nWe\'re working on an amazing demo for you.');
                                    }}
                                >
                                    Watch Demo
                                </Button>
                            </div>

                            <div className="flex items-center space-x-8 mt-10">
                                <div className="flex -space-x-3">
                                    {['JD', 'MC', 'ER', 'AK'].map((initials, i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 border-2 border-white flex items-center justify-center text-white text-sm font-medium shadow-lg"
                                        >
                                            {initials}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Trusted by 10,000+ teams</p>
                                    <p className="text-xs text-gray-500">From startups to Fortune 500</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-3xl blur-2xl" />
                                <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">AI Processing</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/5 to-cyan-500/5 border border-blue-600/10">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 rounded-lg bg-blue-600/10">
                                                    <FiEdit className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Input Description</p>
                                                    <p className="text-xs text-gray-500">"Yesterday evening I was driving on NH-48 when..."</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-3 p-3 rounded-xl bg-green-50/50 border border-green-100">
                                                <FiCheckCircle className="w-5 h-5 text-green-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Extracted Information</p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">Date: 15/01/2026</span>
                                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">Location: NH-48</span>
                                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">Vehicle: Honda City</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white text-xs font-bold">
                                                    AI
                                                </div>
                                                <div>
                                                    <div className="h-2 bg-gray-200 rounded w-20"></div>
                                                    <div className="h-1 bg-gray-200 rounded w-12 mt-1"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-xs text-green-600 font-medium">Processing</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 bg-gradient-to-r from-blue-600/5 via-cyan-500/5 to-blue-600/5 border-y border-gray-100/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                    {stat.number}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Features</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
                            Everything You Need to
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> Streamline Forms</span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Powerful AI-driven features designed to transform how you handle form creation and data extraction.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <Card hoverable className="p-8 h-full group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/5 to-cyan-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} w-fit mb-4 shadow-lg`}>
                                        <div className="text-white">{feature.icon}</div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Process</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
                            How It
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> Works</span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Three simple steps from description to completed form
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600/30 via-cyan-500/30 to-blue-600/30 -translate-y-1/2" />

                        {[
                            {
                                step: '01',
                                title: 'Describe',
                                description: 'Write or paste your incident description in natural language. Our AI understands context and nuance.',
                                icon: <FiEdit className="w-8 h-8" />,
                                color: 'from-blue-600 to-cyan-500'
                            },
                            {
                                step: '02',
                                title: 'Extract',
                                description: 'Advanced AI automatically extracts and structures key information with high accuracy.',
                                icon: <FaRobot className="w-8 h-8" />,
                                color: 'from-cyan-500 to-blue-600'
                            },
                            {
                                step: '03',
                                title: 'Complete',
                                description: 'Review, edit, and submit your form. All data is validated and stored securely.',
                                icon: <FiSend className="w-8 h-8" />,
                                color: 'from-blue-600 to-cyan-500'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow duration-300 border border-gray-100/50 relative z-10">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                                        <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-lg`}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-blue-600 mb-2">Step {item.step}</div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Testimonials</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
                            Trusted by
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> Industry Leaders</span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            See what our customers say about their experience with Forma AI
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card hoverable className="p-8 h-full">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                                            {testimonial.image}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                            <p className="text-xs text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex mb-3">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <FiStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{testimonial.content}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Ready to Transform Your Forms?
                        </h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of teams using Forma AI to streamline their form processing and data extraction workflows.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button variant="ghost" size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl">
                                    Start Free Trial
                                    <FiArrowRight className="ml-2" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white/10"
                                onClick={() => {
                                    console.log('Schedule Demo clicked');
                                    alert('📅 Schedule a demo with our team!\n\nPlease email us at: demo@forma-ai.com');
                                }}
                            >
                                Schedule Demo
                            </Button>
                        </div>
                        <p className="text-blue-200 text-sm mt-6">🚀 No credit card required • Free forever plan available</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-4 bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400">
                                    <FiZap className="w-6 h-6 text-white" />
                                </div>
                                <span className="font-bold text-xl text-white">
                                    <span className="text-blue-400">Forma</span>
                                    <span className="text-cyan-400">AI</span>
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                                AI-Augmented Dynamic Form Engine. Transform natural language into intelligent forms instantly.
                            </p>
                            <div className="flex space-x-4 mt-4">
                                {[FiGithub, FiTwitter, FiLinkedin, FiMail].map((Icon, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
                        <p>© {new Date().getFullYear()} Forma AI. All rights reserved. Built with ❤️ for the future of forms.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
