'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import API_URL from '@/config/config';
import { useEffect, useState } from 'react';
import {
  EditIcon,
  DeleteIcon,
  AddIcon,
  RemoveIcon,
} from '@/components/icons';
import {
  getMarqueeProductIds,
  updateMarqueeProductIds,
} from '@/api/marquee';

export default function GalleryItemAdminControls({ productId }: { productId: string }) {

    const router = useRouter();
    const { isAdmin } = useAuth();
    const [inList, setInList] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (!isAdmin) return;
        getMarqueeProductIds()
            .then((ids) => setInList(ids.includes(productId)))
            .catch(() => {});
    }, [isAdmin, productId]);
    
    if (!isAdmin) return null;


    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(`/gallery/edit/${productId}`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!confirmDelete) {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
            return;
        }
        const res = await fetch(`${API_URL}/api/products/id/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (res.ok) {
            router.refresh();
        } else {
            setConfirmDelete(false);
        }
    };

    const toggleMarquee = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const ids = await getMarqueeProductIds().catch(() => [] as string[]);
        let updated: string[];
        if (ids.includes(productId)) {
            updated = ids.filter((id: string) => id !== productId);
            setInList(false);
        } else {
            updated = [...ids, productId];
            setInList(true);
        }
        await updateMarqueeProductIds(updated);
    };
    

    return (
        <div
        className={`absolute top-2 right-2 flex flex-col gap-2 opacity-0 scale-75 pointer-events-none
                    transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto`}
        >
            <button
                onClick={handleEdit}
                className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
            >
                <EditIcon />
            </button>
            <button
                onClick={handleDelete}
                className={`text-sm px-3 py-3 rounded-full border-1 transition-colors ${
                    confirmDelete
                        ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                        : 'bg-gray-200 hover:bg-gray-300 text-black border-black'
                }`}
            >
                <DeleteIcon />
            </button>
            <button
                onClick={toggleMarquee}
                className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
            >
                {inList ? <RemoveIcon /> : <AddIcon />}
            </button>
        </div>
    );
}