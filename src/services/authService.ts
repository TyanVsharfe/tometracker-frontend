import axios from "axios";

const BASE_URL = 'http://localhost:8080';

export interface UserLogin {
    username: string;
    password: string;
}

export interface User {
    username: string;
    password: string;
}

export const logoutUser = async () => {
    const headers = {withCredentials: true};

    const response = await axios.post(`${BASE_URL}/users/logout`, {}, headers);
    return response.data;
};

export const loginUser = async (user: UserLogin | undefined) => {
    const query = {
        "username": user?.username,
        "password": user?.password,
    };

    const headers = { headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true};

    const response = await axios.post(`${BASE_URL}/users/login`, query, headers);
    return response.data;
};

export const registerUser = async (user: UserLogin | undefined) => {
    const query = {
        "username": user?.username,
        "password": user?.password,
    };

    const headers = { headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true};

    const response = await axios.post(`${BASE_URL}/users/registration`, query, headers);
    return response.data;
};

export const checkSession = async () => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/check-session`, headers);

    return response.status === 200;
};