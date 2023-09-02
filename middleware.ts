import { withAuth } from 'next-auth/middleware';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log(req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (pathname === '/x/review-words') {
          return token !== null && token.email === 'xmliszt@gmail.com';
        } else {
          return token !== null;
        }
      },
    },
  }
);

export const config = {
  matcher: ['/x/:path*'],
};
