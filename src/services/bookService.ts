import axios from "axios";
import {Note} from "./noteService.ts";

const BASE_URL = 'http://localhost:8080';

export interface gBook {
    id: string;
    volumeInfo: {
        title: string;
        imageLinks?: {
            thumbnail?: string;
        };
        description?: string;
        pageCount?: number;
        publishedDate?: string;
        publisher?: string;
        industryIdentifiers: {
            identifier: string;
            type: string
        }[];
    };
}

export interface Book {
    gbId: string;
    isbn13: string;
    title: string;
    status: string;
    userRating: number;
    coverUrl: string;
    notes: Note[];
}

export interface BookUpdate {
    gbId: string;
    status: string;
    userRating: string;
    notes: Note[];
}

export const searchBooks = async (searchQuery : string) => {
    const response = await axios.post(`${BASE_URL}/gbooks`, searchQuery);
    return response.data;
};

export const getBooks = async (status: string) => {
    const response = await axios.get(`${BASE_URL}/books/all?status=${status}`);
    return response.data;
};

export const getBook = async (gbId: string | undefined) => {
    const response = await axios.get(`${BASE_URL}/books/${gbId}`);
    return response.data;
};

export const deleteBook = async (gbId: string | undefined) => {
    const response = await axios.delete(`${BASE_URL}/books/${gbId}`);
    return response.data;
};

export const getGBook = async (gbId: string | undefined) => {
    const response = await axios.get(`${BASE_URL}/gbooks/${gbId}`);
    return response.data;
};

export const addBook = async (book: gBook | undefined) => {
    let identifier = "";
    const identifiers = book?.volumeInfo.industryIdentifiers
    if (identifiers) {
        identifier = identifiers[1].identifier
    }

    const query = {
        "gbId": book?.id,
        "isbn13": Number(identifier),
        "title": book?.volumeInfo?.title,
        "coverUrl": book?.volumeInfo?.imageLinks?.thumbnail
    };

    console.log(query);

    const headers = { headers: {
            'Content-Type': 'application/json'
        }};

    const response = await axios.post(`${BASE_URL}/books`, query, headers);
    return response.data;
};

export const updateBookStatus = async (gbId: string | undefined, status: number) => {
    const query = {
        "status": status,
    };

    console.log(query);

    const headers = { headers: {
            'Content-Type': 'application/json'
        }};

    const response = await axios.put(`${BASE_URL}/books/${gbId}`, query, headers);
    return response.data;
};

export const updateBookRating = async (gbId: string | undefined, rating: number) => {
    const query = {
        "userRating": rating * 10,
    };

    console.log(query);

    const headers = { headers: {
            'Content-Type': 'application/json'
        }};

    const response = await axios.put(`${BASE_URL}/books/${gbId}`, query, headers);

    return rating;
};

export const checkEntity = async (gbId: string | undefined) => {
    try {
        const response = await fetch(`${BASE_URL}/books/checkEntity/${gbId}`);

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
