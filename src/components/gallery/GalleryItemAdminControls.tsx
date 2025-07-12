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

    useEffect(() => {
        if (!isAdmin) return;
        getMarqueeProductIds()
            .then((ids) => setInList(ids.includes(productId)))
            .catch(() => {});
    }, [isAdmin, productId]);
    
    if (!isAdmin) return null;


    const handleEdit = () => {
        router.push(`/gallery/edit/${productId}`);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?'))
            return;

        const res = await fetch(`${API_URL}/api/products/id/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (res.ok) {
            router.refresh(); // Reload the gallery page
        } else {
            alert('Failed to delete product');
        }
    };

    const toggleMarquee = async () => {
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
        className={`absolute top-2 right-2 flex flex-col gap-2 opacity-0 scale-75
                    transition-all duration-300 group-hover:opacity-100 group-hover:scale-100`}
        >
            <button
                onClick={handleEdit}
                className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
            >
                <EditIcon />
            </button>
            <button
                onClick={handleDelete}
                className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
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