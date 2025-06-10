import axios from "axios";
import {UserBook} from "./userBookService.ts";

const BASE_URL = 'http://localhost:8080/books/subscriptions';

export interface BookSubscription {
    id: number;
    userBook: UserBook;
    bookUrl: string;
    storeName: string;
    targetPrice: number;
    lastCheckedPrice: number;
}

export const createSubscription = async (bookId: string, bookUrl: string, storeName: string, targetPrice: number) => {
    const query = {
        "bookId": bookId,
        "bookUrl": bookUrl,
        "storeName": storeName,
        "targetPrice": targetPrice,
    };
    console.log(query);
    const headers = {withCredentials: true};

    const response = await axios.post(`${BASE_URL}`, query, headers);
    return response.data;
};

export const getSubscriptions = async () => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/all`, headers);
    return response.data;
};