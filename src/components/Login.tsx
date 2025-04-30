// src/components/Login.tsx
"use client";  

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/useTranslation';
import API_URL from '@/config/config';

const Login = () => {
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // this tells fetch to accept cookies from server
            });

            
            if (!response.ok) {
                throw new Error('Error during signup');
            }
            router.push('/home'); // Redirect after login
        } catch (err) {
        setError('An error occurred during login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-6">{t('auth.loginTitle')}</h1>
            <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block text-gray-700 mb-2">{t('auth.emailLabel')}</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
                />
            </div>
            <div>
                <label className="block text-gray-700 mb-2">{t('auth.passwordLabel')}</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                />
            </div>
            {error && <p className="text-red-500 text-sm">{t("auth.loginError")}</p>}
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
                {t('auth.loginButton')}
            </button>
            </form>
        </div>
        </div>
    );
      
};

export default Login;
