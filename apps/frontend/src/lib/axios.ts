



import axios from 'axios';


const api = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
headers: {
'Content-Type': 'application/json',
},
withCredentials: true, // if you use cookies for auth
});


export default api;