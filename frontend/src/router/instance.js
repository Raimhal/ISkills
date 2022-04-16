import axios from "axios";
import {useSelector} from "react-redux";

export const instance = axios.create({
    baseURL: "https://localhost:44343/api",
});

export const getAuthHeader = (token) => `Authorization: Bearer ${token}`