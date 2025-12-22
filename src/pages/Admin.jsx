import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText, BookOpen, Layers, Hash, Moon, Sun, Link as LinkIcon } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditional classes
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const CLASS_STANDARDS = ['5', '6', '7', '8', '9', '10'];
const SUBJECTS = ['Science', 'Maths', 'English', 'Social Science'];

const Admin = () => {
    const [formData, setFormData] = useState({
        standard: '', // Changed from array to string
        subject: '',
        title: '',
        filename: ''
    });
    const [copied, setCopied] = useState(false);
    const [jsonOutput, setJsonOutput] = useState('');
    const { theme, toggleTheme } = useTheme();

    // Update JSON whenever form data changes
    useEffect(() => {
        if (!formData.title && !formData.filename && !formData.standard && !formData.subject) {
            setJsonOutput('');
            return;
        }

        const cleanFilename = formData.filename.endsWith('.pdf') ? formData.filename : (formData.filename ? `${formData.filename}.pdf` : '');
        // Construct URL based on user's folder pattern: /materials/class10/science/file.pdf
        const urlPath = `/materials/class${formData.standard || 'XX'}/${(formData.subject || 'general').toLowerCase()}/${cleanFilename}`;

        const entry = {
            id: Date.now(), // User used timestamp format
            title: formData.title,
            standard: formData.standard,
            subject: formData.subject,
            type: 'PDF',
            date: new Date().toISOString().split('T')[0],
            url: urlPath
        };

        setJsonOutput(JSON.stringify(entry, null, 2));
    }, [formData]);

    const copyToClipboard = () => {
        if (!jsonOutput) return;
        navigator.clipboard.writeText(jsonOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen p-6 lg:p-12 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/android-chrome-192x192.png" alt="Logo" className="w-12 h-12 rounded-xl" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Create new material entries.</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative items-start">

                    {/* Left Column: Form */}
                    <div className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-6 transition-colors">

                        {/* Class Standard (Single Select) */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                <Layers size={18} className="text-primary" />
                                Class Standard
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {CLASS_STANDARDS.map(std => (
                                    <button
                                        key={std}
                                        onClick={() => setFormData(prev => ({ ...prev, standard: std === prev.standard ? '' : std }))}
                                        className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 border-2",
                                            formData.standard === std
                                                ? "bg-primary text-white border-primary shadow-md transform scale-105"
                                                : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                                        )}
                                    >
                                        {std}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                <BookOpen size={18} className="text-primary" />
                                Subject
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {SUBJECTS.map(sub => (
                                    <button
                                        key={sub}
                                        onClick={() => setFormData(prev => ({ ...prev, subject: sub }))}
                                        className={cn(
                                            "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 text-left",
                                            formData.subject === sub
                                                ? "bg-primary/10 text-primary border-primary dark:bg-primary/20 dark:text-blue-300"
                                                : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                                        )}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Document Title */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                <Hash size={18} className="text-primary" />
                                Document Title
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Science 1 Question papers"
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                            />
                        </div>

                        {/* Filename */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                <LinkIcon size={18} className="text-primary" />
                                Filename (for URL)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="e.g. Science 1 Question papers.pdf"
                                    value={formData.filename}
                                    onChange={e => setFormData(prev => ({ ...prev, filename: e.target.value }))}
                                    className="w-full pl-4 pr-16 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 ml-1">
                                Will generate: /materials/class{formData.standard || '10'}/{formData.subject ? formData.subject.toLowerCase() : 'science'}/{formData.filename || 'file.pdf'}
                            </p>
                        </div>

                    </div>

                    {/* Right Column: JSON Output */}
                    <div className="sticky top-8 space-y-4">
                        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800">
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                                <span className="text-xs font-mono text-gray-400">JSON Preview</span>
                                <button
                                    onClick={copyToClipboard}
                                    disabled={!jsonOutput}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                                        copied
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-white/10 text-white hover:bg-white/20"
                                    )}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy Code'}
                                </button>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <pre className="font-mono text-sm text-green-400 leading-relaxed min-h-[200px]">
                                    {jsonOutput || <span className="text-gray-600">// Fill the form to generate JSON...</span>}
                                </pre>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl text-sm border border-blue-100 dark:border-blue-800 flex gap-3 items-start">
                            <div className="mt-1 bg-blue-200 dark:bg-blue-800 p-1 rounded-full text-blue-600 dark:text-blue-300">
                                <FileText size={14} />
                            </div>
                            <div>
                                <p className="font-semibold">Tip for Admins</p>
                                <p className="opacity-90 mt-1">Copy the generated JSON and append it to the <code className="bg-white/50 dark:bg-black/30 px-1 rounded">materials.json</code> file in the GitHub repository.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Admin;
