import axios from "axios";
import {Note} from "./noteService.ts";

const BASE_URL = 'http://localhost:8080';

export interface gBook {
    id: string;
    volumeInfo: {
        authors: string[];
        title: string;
        imageLinks?: {
            thumbnail?: string;
            smallThumbnail?: string;
            small?: string;
            medium?: string;
            large?: string;
            extraLarge?: string;
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

export const searchBooks = async (filter: string,searchQuery : string) => {
    const response = await axios.get(`${BASE_URL}/gbooks?q=${searchQuery}&filter=${filter}`);
    return response.data;
};

export const deleteBook = async (gbId: string | undefined) => {
    const headers = {withCredentials: true};
    const response = await axios.delete(`${BASE_URL}/books/${gbId}`, headers);
    return response.data;
};

export const getGBook = async (gbId: string | undefined) => {
    //const response = await axios.get(`${BASE_URL}/gbooks/${gbId}`);
    const response = await axios.get(`${BASE_URL}/gbooks/v2/${gbId}`);
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
        },
        withCredentials: true};

    const response = await axios.post(`${BASE_URL}/books`, query, headers);
    return response.data;
};




