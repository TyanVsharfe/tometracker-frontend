import axios from "axios";

const BASE_URL = 'http://localhost:8000';

export interface BookPriceInfo {
    title: string;
    price: string;
    url: string;
}

export interface BookPrice {
    shop: string;
    books: BookPriceInfo[];
}

export interface ShopBookPrice {
    shop: string;
    book: BookPriceInfo;
}

export const findBookPrices = async (searchQuery: string | undefined, author: string | undefined) => {
    const query = {
        "searchQuery": searchQuery,
        "author": author,
    };

    const headers = { headers: {
            'Content-Type': 'application/json'
        }};

    const response = await axios.post(`${BASE_URL}/find`, query, headers);
    return response.data;
};