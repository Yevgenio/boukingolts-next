// /src/components/Settings.tsx
import { useState, useEffect } from 'react';
import API_URL from '@/config/config';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Fetch user data on component mount
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Not authenticated');
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/auth/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setEmail(data.email); // Assuming data contains email
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Not authenticated');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/updateProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Error updating profile');
      }

      alert('Profile updated successfully!');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSaveChanges}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Settings;
