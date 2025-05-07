// /src/components/Signup.tsx
"use client";  

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/useTranslation';
import API_URL from '@/config/config';

const Signup = () => {
    const { t } = useTranslation();
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Error during signup');
            }

            const data = await response.json();

          if (data.token) {
            localStorage.setItem('token', data.token); // Store access token
            localStorage.setItem('refresh_token', data.refreshToken); // Store refresh token
            router.push("/home"); // Redirect after successful signup
          } else {
            setError("Signup failed. Please try again.");
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Something went wrong');
          }
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {t("auth.signupTitle")}
          </h1>
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">
                {t("auth.usernameLabel")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your username"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                {t("auth.emailLabel")}
              </label>
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
              <label className="block text-gray-700 mb-2">
                {t("auth.passwordLabel")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{t("auth.signupError")}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {t("auth.signupButton")}
            </button>
          </form>
        </div>
      </div>
    );
};

export default Signup;
