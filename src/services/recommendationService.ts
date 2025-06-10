import axios from "axios";
import {apiRequest} from "./authService.ts";
import {Book} from "./userBookService.ts";

const BASE_URL = 'http://localhost:8080/recommendations';

export const getRecommendationsForUser = async () => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/content-based`, headers);

    await apiRequest(response)

    return response.data;
};

export const getPopulars = async () => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/populars`, headers);

    await apiRequest(response)

    return response.data;
};

export const getBookRecommendationByGenre = async (genre: string | undefined) => {
    const response = await axios.get(`${BASE_URL}/genre/${genre}`);
    return response.data;
};