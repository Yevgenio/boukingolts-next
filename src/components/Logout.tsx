// // /src/components/Logout.tsx
// import API_URL from '@/config/config';
// import { useRouter } from 'next/router';

// const Logout = () => {
//   const router = useRouter();

//   const handleLogout = async () => {
//     // Remove tokens from storage
//     try {
//       await fetch(`${API_URL}/api/auth/logout`, {             
//         method: 'GET',
//         credentials: 'include', 
//       });
//     } catch (err) {
//       console.error('Logout API failed', err);
//     }
  
//     router.push('/login');
//   };

//   return (
//     <button onClick={handleLogout}>Logout</button>
//   );
// };

// export default Logout;
