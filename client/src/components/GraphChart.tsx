import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface GraphPoint {
    x: number;
    y: number;
}

interface GraphChartProps {
    points: GraphPoint[];
    functionName: string;
}

const GraphChart: React.FC<GraphChartProps> = ({ points, functionName }) => {
    const data = {
        labels: points.map(p => p.x.toFixed(2)),
        datasets: [
            {
                label: `f(x) = ${functionName}`,
                data: points.map(p => p.y),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                pointRadius: 1,
                pointHoverRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `График функции: ${functionName}`,
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'X'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Y'
                }
            }
        },
    };

    return <Line data={data} options={options} />;
};

export default GraphChart;
