import React, { useState, useEffect } from 'react';
import { SecretPhoto } from '../../types';
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';

const PHOTOS_KEY = 'calcvault_photos';

const SecretPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<SecretPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<SecretPhoto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PHOTOS_KEY);
      if (stored) {
        setPhotos(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load photos", e);
      setError("Could not load photos.");
    }
  }, []);

  const savePhotos = (newPhotos: SecretPhoto[]) => {
    try {
      localStorage.setItem(PHOTOS_KEY, JSON.stringify(newPhotos));
      setPhotos(newPhotos);
      setError(null);
    } catch (e) {
      setError("Storage full! Delete some items to add more.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size to ~500KB for LocalStorage sanity
    if (file.size > 500000) {
        setError("File too large. Please select an image under 500KB.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newPhoto: SecretPhoto = {
        id: crypto.randomUUID(),
        dataUrl: base64String,
        name: file.name,
        createdAt: Date.now(),
      };
      savePhotos([newPhoto, ...photos]);
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this photo permanently?')) {
      const updated = photos.filter(p => p.id !== id);
      savePhotos(updated);
      setSelectedPhoto(null);
    }
  };

  return (
    <div className="h-full flex flex-col relative bg-slate-900">
       <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-100">Private Gallery</h2>
        <span className="text-xs text-slate-400">{photos.length} items</span>
      </div>

      {error && (
        <div className="bg-red-900/50 p-2 text-center text-red-200 text-sm">
            {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {photos.length === 0 ? (
           <div className="text-center text-slate-500 mt-20 flex flex-col items-center">
            <ImageIcon size={48} className="mb-4 opacity-50"/>
            <p>No photos hidden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {photos.map(photo => (
              <div 
                key={photo.id} 
                onClick={() => setSelectedPhoto(photo)}
                className="aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700 relative cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img src={photo.dataUrl} alt="Secret" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Button Wrapper for Input */}
      <label className="absolute bottom-6 right-6 h-14 w-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-900/50 hover:bg-purple-500 transition-colors cursor-pointer">
        <Plus size={28} />
        <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileSelect}
            className="hidden" 
        />
      </label>

      {/* Full Screen View */}
      {selectedPhoto && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col justify-center items-center animate-fade-in">
           <button 
             onClick={() => setSelectedPhoto(null)}
             className="absolute top-4 right-4 text-white p-2 bg-slate-800/50 rounded-full"
           >
             <X size={24} />
           </button>
           <img 
             src={selectedPhoto.dataUrl} 
             alt="Full view" 
             className="max-h-[80%] max-w-full object-contain" 
           />
           <div className="absolute bottom-8 flex gap-4">
             <button 
               onClick={() => handleDelete(selectedPhoto.id)}
               className="flex items-center gap-2 bg-red-600/80 text-white px-6 py-3 rounded-full hover:bg-red-600"
             >
                <Trash2 size={20} /> Delete
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default SecretPhotos;