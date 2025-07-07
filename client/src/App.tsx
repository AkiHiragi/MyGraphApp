import React, { useState } from 'react';
import './App.css';
import GraphForm from './components/GraphForm';
import GraphChart from './components/GraphChart';
import { calculateGraph, GraphRequest, GraphPoint } from './services/api';

function App() {
    const [points, setPoints] = useState<GraphPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentFunction, setCurrentFunction] = useState<string>('');

    const handleFormSubmit = async (request: GraphRequest) => {
        setLoading(true);
        setError(null);

        try {
            const response = await calculateGraph(request);

            if (response.success) {
                setPoints(response.points);
                setCurrentFunction(request.function);
            } else {
                setError(response.error || 'Ошибка при вычислении графика');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>График функций</h1>
                <p>Введите математическую функцию для построения графика</p>
            </header>

            <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <GraphForm onSubmit={handleFormSubmit} loading={loading} />

                {error && (
                    <div style={{
                        color: 'red',
                        backgroundColor: '#ffe6e6',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '20px'
                    }}>
                        Ошибка: {error}
                    </div>
                )}

                {points.length > 0 && !loading && (
                    <div style={{ marginTop: '20px' }}>
                        <GraphChart points={points} functionName={currentFunction} />
                        <p style={{ marginTop: '10px', color: '#666' }}>
                            Построено {points.length} точек для функции: {currentFunction}
                        </p>
                    </div>
                )}

                {loading && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>Вычисляем график...</p>
                    </div>
                )}
            </main>

            <footer style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                <h3>Примеры функций:</h3>
                <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                    <li><code>x^2</code> - парабола</li>
                    <li><code>sin(x)</code> - синус</li>
                    <li><code>cos(x)</code> - косинус</li>
                    <li><code>2*x + 3</code> - прямая линия</li>
                    <li><code>sqrt(x)</code> - квадратный корень</li>
                    <li><code>x^3 - 2*x</code> - кубическая функция</li>
                </ul>
            </footer>
        </div>
    );
}

export default App;
