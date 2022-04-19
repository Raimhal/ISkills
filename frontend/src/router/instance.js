import axios from "axios";

export const instance = axios.create({
    baseURL: "https://localhost:44343/api",
});

instance.interceptors.request.use((config) => {
    const token = `Bearer ${localStorage.getItem('accessToken')}`;
    if(config && config.headers)
        config.headers.Authorization = token ? token : '';
    return config;
});
