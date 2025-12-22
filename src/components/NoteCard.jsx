import React from 'react';
import { FileText, Download, ExternalLink, Calendar } from 'lucide-react';

const NoteCard = ({ note }) => {
    const getSubjectColor = (subject) => {
        switch (subject.toLowerCase()) {
            case 'science': return 'bg-purple-100 text-purple-700';
            case 'maths': return 'bg-blue-100 text-blue-700';
            case 'english': return 'bg-pink-100 text-pink-700';
            case 'social science': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSubjectColor(note.subject)}`}>
                    {note.subject}
                </span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                    <Calendar size={12} />
                    {note.date || note.dateAdded}
                </span>
            </div>

            <div className="flex-1 mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                    {note.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
                        Class {note.standard || (note.class && note.class.join(', '))}
                    </span>
                    <span className="text-xs text-gray-400 border border-gray-200 dark:border-gray-600 px-1.5 py-0.5 rounded">
                        {note.type || 'PDF'}
                    </span>
                </p>
            </div>

            <div className="flex gap-3 mt-auto">
                <a
                    href={note.url || `/materials/${note.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                    <ExternalLink size={16} />
                    View
                </a>
                <a
                    href={note.url || `/materials/${note.filename}`}
                    download
                    className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
                >
                    <Download size={16} />
                    Download
                </a>
            </div>
        </div>
    );
};

export default NoteCard;
