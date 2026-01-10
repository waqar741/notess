import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Search, FileText, Moon, Sun, Filter, MessageCircle, Settings } from 'lucide-react';
import Admin from './pages/Admin';

// --- CONFIG ---
// TODO: User to update this number
const WHATSAPP_NUMBER = "7021396917";
const APP_TITLE = "Notes";

// --- COMPONENTS ---

const MobileCard = ({ note }) => {
  const getSubjectColor = (subject) => {
    const sub = subject?.toLowerCase() || '';
    if (sub.includes('science')) return 'bg-purple-100 text-purple-600';
    if (sub.includes('math')) return 'bg-blue-100 text-blue-600';
    if (sub.includes('english')) return 'bg-pink-100 text-pink-600';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <a
      href={note.url || `/materials/${note.filename}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center group"
    >
      <div className={`w-14 h-14 mb-2 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/10 ${getSubjectColor(note.subject)}`}>
        <div className="flex flex-col items-center justify-center">
          <FileText size={20} strokeWidth={2} className="opacity-90" />
          <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5">{note.type || 'PDF'}</span>
        </div>
      </div>
      <div className="w-full px-0.5 text-center">
        <p className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 min-h-[2.5em]">
          {note.title}
        </p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 truncate">
          {note.subject} • {note.date?.split('-')[0]}
        </p>
      </div>
    </a>
  );
};

// --- HOME PAGE (Mobile Grid) ---
const Home = () => {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStd, setSelectedStd] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [darkMode, setDarkMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(21);

  useEffect(() => {
    fetch('/materials.json')
      .then(res => res.json())
      .then(data => setMaterials(data))
      .catch(err => console.error("Err:", err));

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(21);
  }, [searchQuery, selectedStd, sortBy]);

  const { filtered, classes } = useMemo(() => {
    let res = materials;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(item =>
        item.title?.toLowerCase().includes(q) ||
        item.subject?.toLowerCase().includes(q)
      );
    }

    // Filter by Class
    if (selectedStd !== 'All') {
      res = res.filter(item => {
        const std = item.standard || (Array.isArray(item.class) ? item.class[0] : item.class);
        return String(std) === selectedStd;
      });
    }

    // Sorting Logic
    res.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.date) - new Date(a.date);
        case 'oldest': return new Date(a.date) - new Date(b.date);
        case 'a-z': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

    const uniqueClasses = ['All', ...new Set(materials.map(m =>
      m.standard || (Array.isArray(m.class) ? m.class[0] : m.class)
    ))].filter(Boolean).sort((a, b) => {
      if (a === 'All') return -1;
      if (b === 'All') return 1;
      return parseInt(b) - parseInt(a);
    });

    return { filtered: res, classes: uniqueClasses };
  }, [materials, searchQuery, selectedStd, sortBy]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 pb-20 font-sans">

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-white/5 pb-2 transition-colors">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/android-chrome-192x192.png" className="w-8 h-8 rounded-lg" alt="Logo" />
            <h1 className="text-xl font-bold tracking-tight">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin" className="p-2 text-gray-400 hover:text-primary">
              <Settings size={18} />
            </Link>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-300">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Search & Sort Row */}
        <div className="px-4 pb-2 flex gap-2">
          <div className="flex-1 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center px-3 py-2 border border-transparent focus-within:border-primary/50 transition-colors">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              className="bg-transparent w-full outline-none text-sm placeholder-gray-500 text-gray-900 dark:text-white"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-full px-3 pl-8 rounded-xl bg-gray-100 dark:bg-white/5 text-xs font-semibold appearance-none outline-none border border-transparent focus:border-primary/50 text-gray-700 dark:text-gray-300"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="a-z">A-Z</option>
            </select>
            <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Horizontal Class Filter */}
        <div className="px-4 overflow-x-auto no-scrollbar flex gap-2 pb-1 pt-1">
          {classes.map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedStd(cls)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${selectedStd === cls
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                : 'bg-gray-50 text-gray-600 border border-gray-100 dark:bg-white/5 dark:text-gray-400 dark:border-white/5'
                }`}
            >
              {cls === 'All' ? 'All' : `Class ${cls}`}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN GRID CONTENT */}
      <main className="px-4 py-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {selectedStd === 'All' ? 'Recent Files' : `Class ${selectedStd}`}
          </h2>
          <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">{filtered.length} docs</span>
        </div>

        {/* 3-COLUMN GRID */}
        <div className="grid grid-cols-3 gap-3">
          {filtered.slice(0, visibleCount).map(item => (
            <MobileCard key={item.id || Math.random()} note={item} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filtered.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount(prev => prev + 21)}
              className="px-6 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-full text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              Load More
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 opacity-50 flex flex-col items-center">
            <Search size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No notes found</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 text-center border-t border-gray-100 dark:border-white/5 mt-auto">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors mb-4"
        >
          <MessageCircle size={18} />
          Chat on WhatsApp
        </a>
        <p className="text-gray-500 dark:text-gray-400 text-xs text-opacity-60">
          © {new Date().getFullYear()} {APP_TITLE}
        </p>
      </footer>

    </div>
  );
};

// --- APP ROUTER ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
