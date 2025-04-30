// /src/components/Logout.tsx
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Remove tokens from storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Redirect to login page
    router.push('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
