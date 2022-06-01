import axios from "axios";

export const instance = axios.create({
    baseURL: `./api`,
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
