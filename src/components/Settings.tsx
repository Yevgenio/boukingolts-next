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
      try {
        const response = await fetch(`${API_URL}/api/auth/settings`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        console.log(data);
        setEmail(data.email); // Assuming data contains email
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1>Settings</h1>
        <p>Email: {email}</p>
      {error && <p className="error">{error}</p>}
      {/* <form onSubmit={handleSaveChanges}>
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
      </form> */}
    </div>
  );
};

export default Settings;
