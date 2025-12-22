import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Layers, X, Moon, Sun } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import useTheme from '../hooks/useTheme';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const CLASS_STANDARDS = ['5', '6', '7', '8', '9', '10'];
const SUBJECTS = ['Science', 'Maths', 'English', 'Social Science'];

const Home = () => {
    const [materials, setMaterials] = useState([]);
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter toggle
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        // Fetch materials
        fetch('/materials.json')
            .then(res => res.json())
            .then(data => {
                setMaterials(data);
                setFilteredMaterials(data);
            })
            .catch(err => console.error("Failed to load materials", err));
    }, []);

    useEffect(() => {
        let result = materials;

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.subject.toLowerCase().includes(lowerQuery)
            );
        }

        if (selectedClass) {
            result = result.filter(item => {
                // Support both new "standard": "10" and old "class": ["10"] formats for robustness
                if (item.standard) return item.standard === selectedClass;
                if (item.class && Array.isArray(item.class)) return item.class.includes(selectedClass);
                return false;
            });
        }

        if (selectedSubject) {
            result = result.filter(item => item.subject === selectedSubject);
        }

        setFilteredMaterials(result);
    }, [searchQuery, selectedClass, selectedSubject, materials]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedClass(null);
        setSelectedSubject(null);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 font-sans transition-colors duration-200">

            {/* Navbar */}
            <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 px-6 py-4 transition-colors">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
                        <div className="flex items-center gap-2">
                            <img src="/android-chrome-192x192.png" alt="Logo" className="w-10 h-10 rounded-xl" />
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                SmartNotes
                            </span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 md:hidden"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>

                    <div className="w-full md:w-auto flex-1 max-w-lg relative flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search for notes, chapters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700/50 dark:text-white border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            />
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hidden md:flex hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        <button
                            className="md:hidden p-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <Filter size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Filters */}
                <aside className={cn(
                    // Mobile: Modal style without slide
                    "fixed inset-0 z-40 bg-white dark:bg-gray-800 p-6 overflow-y-auto transition-opacity duration-200",
                    // Desktop: sticky sidebar
                    "lg:static lg:bg-transparent lg:dark:bg-transparent lg:p-0 lg:overflow-visible lg:block lg:w-auto lg:inset-auto lg:z-auto",
                    isFilterOpen ? "opacity-100 visible" : "opacity-0 invisible lg:opacity-100 lg:visible"
                )}>
                    <div className="lg:sticky lg:top-28 space-y-8">
                        <div className="flex items-center justify-between lg:hidden mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Filters</h2>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                            >
                                <X />
                            </button>
                        </div>

                        {/* Class Filter */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Layers size={16} /> Class
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {CLASS_STANDARDS.map(std => (
                                    <button
                                        key={std}
                                        onClick={() => setSelectedClass(selectedClass === std ? null : std)}
                                        className={cn(
                                            "py-2 rounded-lg text-sm font-medium transition-all border",
                                            selectedClass === std
                                                ? "bg-primary text-white border-primary shadow-lg shadow-blue-200 dark:shadow-none"
                                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        {std}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject Filter */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <BookOpen size={16} /> Subject
                            </h3>
                            <div className="space-y-2">
                                {SUBJECTS.map(sub => (
                                    <button
                                        key={sub}
                                        onClick={() => setSelectedSubject(selectedSubject === sub ? null : sub)}
                                        className={cn(
                                            "w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group",
                                            selectedSubject === sub
                                                ? "bg-white dark:bg-gray-800 border-l-4 border-l-primary shadow-sm text-primary dark:text-blue-400"
                                                : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm text-left"
                                        )}
                                    >
                                        {sub}
                                        {selectedSubject === sub && <CheckIcon />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(selectedClass || selectedSubject || searchQuery) && (
                            <button
                                onClick={clearFilters}
                                className="w-full py-3 text-sm text-gray-500 hover:text-red-500 transition-colors border-t border-gray-100 dark:border-gray-700 mt-4"
                            >
                                Clear all filters
                            </button>
                        )}

                        {/* Mobile Actions */}
                        <div className="mt-8 lg:hidden">
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full bg-primary text-white py-3 rounded-xl font-semibold"
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Grid */}
                <div className="lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {filteredMaterials.length} {filteredMaterials.length === 1 ? 'Note' : 'Notes'} Found
                        </h2>
                        {/* Sorting dropdown could go here */}
                    </div>

                    {filteredMaterials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredMaterials.map(note => (
                                <NoteCard key={note.id} note={note} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Search size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No notes found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
                            <button onClick={clearFilters} className="mt-6 text-primary font-medium hover:underline">Clear Filters</button>
                        </div>
                    )}
                </div>

            </div>

            {/* Footer */}
            <footer className="border-t border-gray-100 dark:border-gray-700 mt-12 bg-white dark:bg-gray-800 transition-colors">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        Built with ❤️ by <span className="text-primary font-bold">Ahmed</span>
                    </p>
                    <a
                        href="/admin"
                        className="text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
                    >
                        Admin Portal
                    </a>
                </div>
            </footer>
        </div >
    );
};

// Simple check icon component
const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default Home;
