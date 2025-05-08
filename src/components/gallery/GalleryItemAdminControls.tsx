'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import API_URL from '@/config/config';

export default function GalleryItemAdminControls({ productId }: { productId: string }) {
    const { isAdmin } = useAuth();
    if (!isAdmin) return null;

    const router = useRouter();

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
    

    return (
        <div
        className={`absolute top-2 right-2 flex flex-col gap-2 opacity-0 scale-75 
                    transition-all duration-300 group-hover:opacity-100 group-hover:scale-100`}
        >
            <button
                onClick={handleEdit}
                className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
            >
                <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            </button>
            <button
                onClick={handleDelete}
                className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <line
                        x1="8"
                        y1="8"
                        x2="16"
                        y2="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <line
                        x1="16"
                        y1="8"
                        x2="8"
                        y2="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
        </div>
    );
}
