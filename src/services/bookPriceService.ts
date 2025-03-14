import axios from "axios";

const BASE_URL = 'http://localhost:8000';

export interface BookPrice {
    shop: string;
    title: string;
    price: string;
    url: string;
}

export const findBookPrices = async (isbn: string | undefined) => {
    const query = {
        "isbn": Number(isbn),
    };

    const headers = { headers: {
            'Content-Type': 'application/json'
        }};

    const response = await axios.post(`${BASE_URL}/find`, query, headers);
    console.log(isbn)
    return response.data;
};