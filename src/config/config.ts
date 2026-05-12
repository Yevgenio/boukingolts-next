const isProd = process.env.NODE_ENV === 'production';
const isServer = typeof window === 'undefined';

let API_URL: string;

if (isProd) {
  // Server-side: use internal k8s service URL injected at runtime via API_URL env var.
  // Client-side (browser): empty string so calls become relative paths like /api/...
  API_URL = isServer ? (process.env.API_URL ?? '') : '';
} else {
  API_URL = 'http://localhost:5001';
}

export default API_URL;