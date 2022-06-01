import axios from "axios";

export const instance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL | "https://localhost:5001"}/api`,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if(token) {
        const token = `Bearer ${localStorage.getItem('accessToken')}`;
        if (config && config.headers)
            config.headers.Authorization = token ? token : '';
    }
    return config;
});
