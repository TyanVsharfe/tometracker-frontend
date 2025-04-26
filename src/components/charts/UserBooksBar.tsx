import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {getStatusTranslation} from "../../utils/Enums.ts";
import {GenreCountInfo, UserBookCountInfo} from "../../services/userBookService.ts";

export interface ChartProps {
    userBookQuantity: UserBookCountInfo[];
    genreQuantity: GenreCountInfo[];
    mode: number;
}

const UserBooksBarChart = ({ userBookQuantity, genreQuantity, mode }: ChartProps) => {
    const translatedData = userBookQuantity.map((item) => ({
        ...item,
        category: getStatusTranslation(item.category),
    }))

    const nameKey = mode == 0 ? 'category' : 'genre';

    return (
        <div style={{ width: '40rem', height: '30rem' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mode == 0 ? translatedData : genreQuantity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={nameKey} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Количество" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserBooksBarChart;