import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ isOpen, onClose }) => {
    const { login, register, error, setError } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            if (isRegister) {
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match.");
                    setSubmitting(false);
                    return;
                }
                await register(formData.username, formData.email, formData.password);
            } else {
                await login(formData.email, formData.password);
            }
            // Reset and close
            setFormData({ username: "", email: "", password: "", confirmPassword: "" });
            onClose();
        } catch (err) {
            setSubmitting(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary/40 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-primary rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 text-gray-400 hover:text-primary dark:hover:text-white transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8 md:p-12 relative z-10">
                            {/* Header */}
                            <div className="mb-10 text-center">
                                <h2 className="text-4xl font-black text-primary dark:text-white mb-2 tracking-tighter">
                                    {isRegister ? "Join the Story" : "Welcome Back"}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                    {isRegister ? "Start your journey across India's archive." : "Access your curated travel archive."}
                                </p>
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-8"
                                    >
                                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold">
                                            <AlertCircle size={18} />
                                            {error}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {isRegister && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Username</label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input
                                                type="text"
                                                name="username"
                                                required
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                placeholder="e.g. wanderer_09"
                                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-transparent text-primary dark:text-white transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-transparent text-primary dark:text-white transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-transparent text-primary dark:text-white transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {isRegister && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-transparent text-primary dark:text-white transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-5 bg-primary dark:bg-accent text-white dark:text-primary font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            {isRegister ? "Create Account" : "Access Archive"} <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-10 text-center">
                                <p className="text-sm text-gray-400 font-bold">
                                    {isRegister ? "Already part of the story?" : "New to States?"}{" "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setError(null);
                                            setIsRegister(!isRegister);
                                        }}
                                        className="text-accent hover:underline ml-1"
                                    >
                                        {isRegister ? "Sign In" : "Sign Up"}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
