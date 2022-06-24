import axios from 'axios'
export const apiFetcher = axios.create({
    baseURL:'http://localhost:5555/api',
    withCredentials:'include'
})