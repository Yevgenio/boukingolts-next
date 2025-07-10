import React from 'react';
import API_URL from '@/config/config';

export interface ImageItem {
  file?: File;
  url?: string;
  id?: string;
  isNew?: boolean;
}

interface Props {
  images: ImageItem[];
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
}

export default function ImageUploadList({ images, setImages }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(file => ({ file, isNew: true }));
      setImages(prev => [...prev, ...files]);
    }
  };

  const remove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={handleChange} className="w-full mt-1" />
      {images.length > 0 && (
        <ul className="mt-2 space-y-2">
          {images.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.isNew && item.file ? URL.createObjectURL(item.file) : `${API_URL}/api/uploads/${item.url}`}
                alt="preview"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 text-sm">
                <p>{item.isNew ? item.file?.name : item.url}</p>
                {item.isNew && item.file && (
                  <p className="text-xs text-gray-500">{(item.file.size / 1024).toFixed(1)} KB</p>
                )}
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="px-2 py-1 text-xs border rounded">
                  ↑
                </button>
                <button type="button" onClick={() => move(index, index + 1)} disabled={index === images.length - 1} className="px-2 py-1 text-xs border rounded">
                  ↓
                </button>
                <button type="button" onClick={() => remove(index)} className="px-2 py-1 text-xs border rounded text-red-600">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}