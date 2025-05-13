import axios from "axios";
import {Note} from "./noteService.ts";
import {apiRequest} from "./authService.ts";

const BASE_URL = 'http://localhost:8080/users';

export interface UserBook {
    book: Book;
    status: string;
    userRating: number;
    review: string;
    notes: Note[];
}

export interface Book {
    coverUrl: string;
    gbId: string;
    isbn13: string;
    title: string;
    description: string;
    pageCount: number;
    publisher: string;
    publishedDate: string;
    genres: string[];
    authors: string[];
}

export interface BookReview {
    id: number;
    username: string;
    review: string;
    userRating: number;
}

export interface ReviewProps {
    bookReview: BookReview;
}

export interface UserInfo {
    username: string;
    subscription: string;
    allBookQuantity: number;
    userBookQuantity: UserBookCountInfo[];
    bookCountByGenre: GenreCountInfo[];
}

export interface UserBookCountInfo {
    category: string;
    count: number;
}

export interface GenreCountInfo {
    genre: string;
    count: number;
}

export const getBooks = async (status: string) => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/books/all?status=${status}`, headers);

    await apiRequest(response)

    return response.data;
};

export const getAllBooksInfo = async () => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/info`, headers);

    await apiRequest(response)

    return response.data;
};

export const getAllBooksGenres = async () => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/books/all-genres`, headers);

    await apiRequest(response)

    return response.data;
};

export const getAllBooksAuthors = async () => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/books/all-authors`, headers);

    await apiRequest(response)

    return response.data;
};

export const getAllBookReviews = async (gbId: string | undefined) => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/books/${gbId}/reviews`, headers);

    await apiRequest(response)

    return response.data;
};

export const getUserBook = async (gbId: string | undefined) => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/books/${gbId}`, headers);

    await apiRequest(response)

    console.log(response.data);
    return response.data;
};

export const deleteUserBook = async (gbId: string | undefined) => {
    const headers = {withCredentials: true};

    const response = await axios.delete(`${BASE_URL}/books/${gbId}`, headers);

    await apiRequest(response)

    console.log(response.data);
    return response.data;
};

export const addUserBook = async (gbId: string | undefined) => {
    const headers = {withCredentials: true};

    const response = await axios.post(`${BASE_URL}/books/${gbId}`, {}, headers);

    await apiRequest(response)

    console.log(response.data);
    return response.data;
};

export const updateBookStatus = async (gbId: string | undefined, status: number) => {
    const query = {
        "status": status,
    };

    console.log(query);

    const headers = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const response = await axios.put(`${BASE_URL}/books/${gbId}`, query, headers);

    await apiRequest(response)

    return response.data;
};

export const updateBookRating = async (gbId: string | undefined, rating: number) => {
    const query = {
        "userRating": rating * 10,
    };

    console.log(query);

    const headers = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const response = await axios.put(`${BASE_URL}/books/${gbId}`, query, headers);

    await apiRequest(response)

    return rating;
};

export const updateBookReview = async (gbId: string | undefined, review: string) => {
    const query = {
        "review": review,
    };

    const headers = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const response = await axios.put(`${BASE_URL}/books/${gbId}`, query, headers);

    await apiRequest(response)

    return review;
};

export const deleteBookReview = async (gbId: string | undefined, review: string) => {
    const query = {
        "review": "",
    };

    const headers = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const response = await axios.put(`${BASE_URL}/books/${gbId}`, query, headers);

    await apiRequest(response)

    return review;
};

export const checkEntity = async (gbId: string | undefined) => {
    try {
        const response = await fetch(`${BASE_URL}/books/check-entity/${gbId}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            return result;
        } else {
            console.error('entity validation error:', response.status);
            return null;
        }
    } catch (error) {
        console.error('an error occurred:', error);
        return null;
    }
};