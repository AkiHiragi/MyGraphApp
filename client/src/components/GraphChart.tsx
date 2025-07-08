import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './GraphChart.css';

const axesPlugin = {
    id: 'axes',
    afterDraw: (chart: any) => {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const scales = chart.scales;

        ctx.save();

        const yZero = scales.y.getPixelForValue(0);
        if (yZero >= chartArea.top && yZero <= chartArea.bottom) {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(chartArea.left, yZero);
            ctx.lineTo(chartArea.right, yZero);
            ctx.stroke();
        }

        const xZero = scales.x.getPixelForValue(0);
        if (xZero >= chartArea.left && xZero <= chartArea.right) {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(xZero, chartArea.top);
            ctx.lineTo(xZero, chartArea.bottom);
            ctx.stroke();
        }

        ctx.restore();
    }
};

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    axesPlugin
);

interface GraphPoint {
    x: number;
    y: number;
}

interface GraphData {
    id: string;
    function: string;
    points: GraphPoint[];
    color: string;
    visible: boolean;
}

interface MultiGraphChartProps {
    graphs: GraphData[];
}

const MultiGraphChart: React.FC<MultiGraphChartProps> = ({ graphs }) => {
    const [normalizeMode, setNormalizeMode] = useState(false);
    const [autoScale, setAutoScale] = useState(true);

    const visibleGraphs = graphs.filter(g => g.visible && g.points.length > 0);

    if (visibleGraphs.length === 0) {
        return (
            <div className="chart-wrapper">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#666',
                    fontSize: '1.2rem'
                }}>
                    📈 Добавьте функции для отображения графиков
                </div>
            </div>
        );
    }

    const allXValues = visibleGraphs.flatMap(g => g.points.map(p => p.x));
    const minX = Math.min(...allXValues);
    const maxX = Math.max(...allXValues);

    const step = (maxX - minX) / 200;
    const commonXValues: number[] = [];
    for (let x = minX; x <= maxX; x += step) {
        commonXValues.push(x);
    }

    // Улучшенная функция интерполяции
    const interpolateValue = (points: GraphPoint[], targetX: number): number => {
        const sortedPoints = [...points].sort((a, b) => a.x - b.x);

        if (targetX <= sortedPoints[0].x) return sortedPoints[0].y;
        if (targetX >= sortedPoints[sortedPoints.length - 1].x) return sortedPoints[sortedPoints.length - 1].y;

        for (let i = 0; i < sortedPoints.length - 1; i++) {
            const p1 = sortedPoints[i];
            const p2 = sortedPoints[i + 1];

            if (targetX >= p1.x && targetX <= p2.x) {
                const ratio = (targetX - p1.x) / (p2.x - p1.x);
                return p1.y + ratio * (p2.y - p1.y);
            }
        }

        return points.reduce((prev, curr) =>
            Math.abs(curr.x - targetX) < Math.abs(prev.x - targetX) ? curr : prev
        ).y;
    };

    const normalizeData = (values: number[]) => {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;
        if (range === 0) return values;
        return values.map(v => (v - min) / range * 2 - 1);
    };

    const datasets = visibleGraphs.map((graph) => {
        const rawData = commonXValues.map(x => interpolateValue(graph.points, x));
        const processedData = normalizeMode ? normalizeData(rawData) : rawData;

        return {
            label: `f(x) = ${graph.function}${normalizeMode ? ' (нормализовано)' : ''}`,
            data: processedData,
            borderColor: graph.color,
            backgroundColor: graph.color + '20',
            pointRadius: 0,
            pointHoverRadius: 6,
            borderWidth: 3,
            fill: false,
            tension: 0.1,
            originalData: rawData,
        };
    });

    const data = {
        labels: commonXValues.map(x => x.toFixed(2)),
        datasets: datasets,
    };

    let yMin: number | undefined;
    let yMax: number | undefined;

    if (!autoScale) {
        const allYValues = datasets.flatMap(d => d.data);
        yMin = Math.min(...allYValues);
        yMax = Math.max(...allYValues);

        const padding = (yMax - yMin) * 0.1;
        yMin -= padding;
        yMax += padding;
    }

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 600,
                    },
                    color: '#333',
                    usePointStyle: true,
                    pointStyle: 'line',
                    padding: 20,
                }
            },
            title: {
                display: true,
                text: `📊 Графики функций (${visibleGraphs.length})${normalizeMode ? ' - Нормализованные' : ''}`,
                font: {
                    size: 18,
                    weight: 700,
                },
                color: '#333',
                padding: 20,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    title: function (context) {
                        return `x = ${context[0].label}`;
                    },
                    label: function (context) {
                        const dataset = context.dataset as any;
                        const originalValue = dataset.originalData ? dataset.originalData[context.dataIndex] : context.parsed.y;
                        const displayValue = normalizeMode ? originalValue : context.parsed.y;
                        return `${context.dataset.label}: ${displayValue.toFixed(4)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                min: minX,
                max: maxX,
                display: true,
                title: {
                    display: true,
                    text: 'X',
                    font: {
                        size: 16,
                        weight: 700,
                    },
                    color: '#333',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    lineWidth: 1,
                },
                ticks: {
                    color: '#666',
                    font: {
                        size: 12,
                        weight: 600,
                    },
                    padding: 5, // Добавляем отступ для меток
                    callback: function (value) {
                        return Number(value).toFixed(1);
                    }
                }
            },
            y: {
                type: 'linear',
                display: true,
                min: yMin,
                max: yMax,
                title: {
                    display: true,
                    text: normalizeMode ? 'Y (нормализовано)' : 'Y',
                    font: {
                        size: 16,
                        weight: 700,
                    },
                    color: '#333',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    lineWidth: 1,
                },
                ticks: {
                    color: '#666',
                    font: {
                        size: 12,
                        weight: 600,
                    },
                    padding: 8, // Увеличиваем отступ для меток Y
                    callback: function (value) {
                        return Number(value).toFixed(1);
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    return (
        <div className="chart-wrapper">
            <div className="chart-controls">
                <div className="control-group">
                    <label className="control-label">
                        <input
                            type="checkbox"
                            checked={normalizeMode}
                            onChange={(e) => setNormalizeMode(e.target.checked)}
                        />
                        🔧 Нормализовать графики
                    </label>
                    <span className="control-hint">
                    Приводит все функции к одному масштабу [-1, 1]
                </span>
                </div>

                <div className="control-group">
                    <label className="control-label">
                        <input
                            type="checkbox"
                            checked={autoScale}
                            onChange={(e) => setAutoScale(e.target.checked)}
                        />
                        📏 Автомасштабирование
                    </label>
                    <span className="control-hint">
                    Автоматически подбирает масштаб по оси Y
                </span>
                </div>
            </div>

            <Line data={data} options={options} />
        </div>
    );
};

export default MultiGraphChart;
