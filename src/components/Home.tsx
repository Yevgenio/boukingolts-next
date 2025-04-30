// pages/home.tsx
import { GetServerSideProps } from 'next';
import nookies from 'nookies'; // Helps easily read cookies in Next.js

const Home = () => {
  return (
    <section className="p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to my art portfolio.</h1>
        <p className="text-lg text-gray-600">
          Explore the beauty and creativity captured through art. Dive into the gallery to find inspiration.
        </p>
      </section>
  );
};

export default Home;