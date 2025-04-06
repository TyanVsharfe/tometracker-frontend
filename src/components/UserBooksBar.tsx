import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {getStatusTranslation} from "../utils/Enums.ts";
import {UserBookCountInfo} from "../services/userBookService.ts";

interface UserBooksBarProps {
    userBookQuantity: UserBookCountInfo[];
}

const UserBooksBarChart = ({ userBookQuantity }: UserBooksBarProps) => {
    const translatedData = userBookQuantity.map((item) => ({
        ...item,
        category: getStatusTranslation(item.category),
    }));

    return (
        <div style={{ width: '40rem', height: '30rem' }}>
            <br/>
            <h2 style={{alignItems: 'center', textAlign: 'center'}}>Количество книг по статусам:</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={translatedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookQuantity" name="Количество" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserBooksBarChart;