import axios from "axios";

const BASE_URL = 'http://localhost:8000';

export interface BookPriceList {
    bookPriceList: BookPrice[];
}

export interface BookPrice {
    shop: string;
    title: string;
    price: string;
    url: string;
}

export const findBookPrices = async (searchQuery: string | undefined) => {
    const query = {
        "searchQuery": searchQuery,
    };

    const headers = { headers: {
            'Content-Type': 'application/json'
        }};

    const response = await axios.post(`${BASE_URL}/find`, query, headers);
    return response.data;
};