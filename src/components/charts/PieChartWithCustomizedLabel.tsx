import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend} from 'recharts';
import {ChartProps} from "./UserBooksBar.tsx";
import {getStatusTranslation} from "../../utils/Enums.ts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1', '#FF6F91'];

const PieChartWithCustomizedLabel = ({ userBookQuantity, genreQuantity, mode }: ChartProps) => {
    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({
                                       cx, cy, midAngle, innerRadius, outerRadius, percent, index
                                   }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                {/*{`${(percent * 100).toFixed(0)}%`}*/}
            </text>
        );
    };

    const translatedData = userBookQuantity.map((item) => ({
        ...item,
        category: getStatusTranslation(item.category),
    }))

    const nameKey = mode == 1 ? 'category' : 'genre';

    return (
        <div style={{width: '40rem', height: '30rem'}}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={mode == 1 ? translatedData : genreQuantity}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey={nameKey}
                    >
                        {genreQuantity.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <br/>
                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const CustomLegend = ({ payload }) => {
    return (
        <div style={{ maxHeight: '185px', overflowY: 'auto', paddingTop: '20px' }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} style={{display: 'flex', alignItems: 'center', marginBottom: '5px'}}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: entry.color,
                            marginRight: '8px'
                        }}/>
                        {entry.value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PieChartWithCustomizedLabel;
