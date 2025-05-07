// src/utils/withAuth.ts
import { GetServerSideProps } from 'next';
import nookies from 'nookies';

export function withAuth(gssp: GetServerSideProps) {
  return async (context: Parameters<GetServerSideProps>[0]) => {
    const { access_token } = nookies.get(context);

    if (!access_token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return await gssp(context);
  };
}
