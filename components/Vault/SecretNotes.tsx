import React, { useState, useEffect } from 'react';
import { SecretNote } from '../../types';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';

const NOTES_KEY = 'calcvault_notes';

const SecretNotes: React.FC = () => {
  const [notes, setNotes] = useState<SecretNote[]>([]);
  const [activeNote, setActiveNote] = useState<SecretNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(NOTES_KEY);
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, []);

  const saveNotesToStorage = (updatedNotes: SecretNote[]) => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleCreateNew = () => {
    setIsEditing(true);
    setActiveNote(null);
    setTitle('');
    setContent('');
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    if (activeNote) {
      // Update existing
      const updated = notes.map(n => 
        n.id === activeNote.id 
          ? { ...n, title, content, createdAt: Date.now() }
          : n
      );
      saveNotesToStorage(updated);
    } else {
      // Create new
      const newNote: SecretNote = {
        id: crypto.randomUUID(),
        title: title || 'Untitled Note',
        content,
        createdAt: Date.now(),
      };
      saveNotesToStorage([newNote, ...notes]);
    }
    setIsEditing(false);
    setActiveNote(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this secret note?')) {
      const updated = notes.filter(n => n.id !== id);
      saveNotesToStorage(updated);
      if (activeNote?.id === id) {
        setIsEditing(false);
        setActiveNote(null);
      }
    }
  };

  const handleOpenNote = (note: SecretNote) => {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-100 animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-800 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold">{activeNote ? 'Edit Secret' : 'New Secret'}</span>
          <button onClick={handleSave} className="p-2 text-green-400 hover:bg-slate-800 rounded-full">
            <Save size={20} />
          </button>
        </div>
        <div className="p-4 flex-1 flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-xl font-bold border-b border-slate-700 p-2 focus:outline-none focus:border-blue-500"
          />
          <textarea 
            placeholder="Write your secret here..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-transparent resize-none p-2 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative bg-slate-900">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-100">Hidden Notes</h2>
        <span className="text-xs text-slate-400">{notes.length} notes</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notes.length === 0 ? (
          <div className="text-center text-slate-500 mt-20">
            <p>No secrets yet.</p>
            <p className="text-sm">Tap + to add one.</p>
          </div>
        ) : (
          notes.map(note => (
            <div 
              key={note.id} 
              onClick={() => handleOpenNote(note)}
              className="bg-slate-800 p-4 rounded-xl active:scale-98 transition-transform cursor-pointer border border-slate-700 hover:border-slate-500 group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-100 truncate pr-4">{note.title}</h3>
                <button 
                  onClick={(e) => handleDelete(note.id, e)}
                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2">{note.content}</p>
              <span className="text-xs text-slate-600 mt-2 block">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={handleCreateNew}
        className="absolute bottom-6 right-6 h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-colors"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default SecretNotes;