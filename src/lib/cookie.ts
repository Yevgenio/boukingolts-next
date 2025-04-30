// import { parse, serialize } from 'cookie';

// // Get the language from cookies
// export function getLanguageCookie(req: any) {
//   const cookies = req ? parse(req.headers.cookie || '') : parse(document.cookie);
//   return cookies.lang || 'en'; // Default to 'en' if no language is set
// }

// // Set the language cookie
// export function setLanguageCookie(res: any, lang: string) {
//   const cookie = serialize('lang', lang, {
//     maxAge: 60 * 60 * 24 * 365, // 1 year
//     path: '/',
//   });
//   res.setHeader('Set-Cookie', cookie);
// }
