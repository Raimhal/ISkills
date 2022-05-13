import axios from "axios";

export const instance = axios.create({
    baseURL: "https://localhost:44343/api",
});

instance.interceptors.request.use((config) => {
    if((JSON.parse(localStorage.getItem('isAuth')))) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        const token = `Bearer ${currentUser.jwtToken}`;
        if (config && config.headers)
            config.headers.Authorization = token ? token : '';
    }
    return config;
});
