// const API_URL = "https://boukingolts.art"; //works with SSR
// // const API_URL = "http://localhost:5000"; // for testing on local node server
// // const API_URL = ""; //doesent work with SSR

const isProd = process.env.NODE_ENV === 'production';
const useLocalAPI = false;

let API_URL: string;

if (isProd) {
  API_URL = 'https://boukingolts.art';
} else if (useLocalAPI) {
  // Fetch from local API during development
  API_URL = 'http://localhost:5000';
} else {
  // Fetch from remote (optional)
  API_URL = 'https://boukingolts.art';
}

export default API_URL;