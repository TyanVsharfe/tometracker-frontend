import React from 'react';
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell} from 'recharts';
import {getStatusTranslation} from "../../utils/Enums.ts";
import {GenreCountInfo, UserBookCountInfo} from "../../services/userBookService.ts";

const CustomBarChart = ({ data, nameKey }) => {
    const generateUniqueColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 360) / count;
            colors.push(`hsl(${hue}, 70%, 50%)`);
        }
        return colors;
    };

    const COLORS = generateUniqueColors(data.length);
    //const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1', '#FF6F91'];

    return (
        <ResponsiveContainer width="100%" height="95%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={nameKey} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, 'Книг']} />
                <Bar dataKey="count" name="Количество" fill="#8884d8">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CustomBarChart;