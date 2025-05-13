import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend} from 'recharts';
import {getStatusTranslation} from "../../utils/Enums.ts";

const CustomPieChart = ({ data, nameKey }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1', '#FF6F91'];
    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({
                                       cx, cy, midAngle, innerRadius, outerRadius, percent
                                   }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return percent > 0.05 ? (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    return (
        <ResponsiveContainer width="100%" height="95%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey={nameKey}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Книг']} />
                <Legend content={<CustomLegend/>} />
            </PieChart>
        </ResponsiveContainer>
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

export default CustomPieChart;
