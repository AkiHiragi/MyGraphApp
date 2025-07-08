import React, {useState} from 'react';
import './App.css';
import MultiGraphForm from './components/MultiGraphForm';
import MultiGraphChart from './components/GraphChart';
import {calculateGraph, GraphRequest, GraphData} from './services/api';

function App() {
    const [graphs, setGraphs] = useState<GraphData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Цвета для графиков
    const colors = [
        'rgb(102, 126, 234)',
        'rgb(220, 53, 69)',
        'rgb(40, 167, 69)',
        'rgb(255, 193, 7)',
        'rgb(111, 66, 193)',
        'rgb(23, 162, 184)',
        'rgb(253, 126, 20)',
        'rgb(108, 117, 125)'
    ];

    const handleAddGraph = async (request: GraphRequest) => {
        setLoading(true);
        setError(null);

        try {
            const response = await calculateGraph(request);

            if (response.success) {
                const newGraph: GraphData = {
                    id: Date.now().toString(),
                    function: request.function,
                    points: response.points,
                    color: colors[graphs.length % colors.length],
                    visible: true
                };

                setGraphs(prev => [...prev, newGraph]);
            } else {
                setError(response.error || 'Ошибка при вычислении графика');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveGraph = (id: string) => {
        setGraphs(prev => prev.filter(g => g.id !== id));
    };

    const handleToggleGraph = (id: string) => {
        setGraphs(prev => prev.map(g =>
            g.id === id ? {...g, visible: !g.visible} : g
        ));
    };

    const clearAllGraphs = () => {
        setGraphs([]);
        setError(null);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>📊 График функций</h1>
                <p>Создавайте и сравнивайте графики математических функций</p>
            </header>

            <main className="main-container">
                <div className="form-container">
                    <MultiGraphForm
                        onAddGraph={handleAddGraph}
                        onRemoveGraph={handleRemoveGraph}
                        onToggleGraph={handleToggleGraph}
                        graphs={graphs}
                        loading={loading}
                    />

                    {graphs.length > 0 && (
                        <div style={{marginTop: '1rem', textAlign: 'center'}}>
                            <button
                                onClick={clearAllGraphs}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(220, 53, 69, 0.1)',
                                    border: '1px solid rgba(220, 53, 69, 0.3)',
                                    borderRadius: '6px',
                                    color: '#dc3545',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                🗑️ Очистить все графики
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        <strong>Ошибка:</strong> {error}
                    </div>
                )}

                {graphs.length > 0 && (
                    <div className="chart-container">
                        <MultiGraphChart graphs={graphs}/>
                    </div>
                )}

                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Вычисляем график...</p>
                    </div>
                )}

                <div className="examples-section">
                    <h3>🧮 Примеры функций</h3>
                    <ul className="examples-grid">
                        <li className="example-item">
                            <span className="example-code">x^2</span> - парабола
                        </li>
                        <li className="example-item">
                            <span className="example-code">sin(x)</span> - синус
                        </li>
                        <li className="example-item">
                            <span className="example-code">cos(x)</span> - косинус
                        </li>
                        <li className="example-item">
                            <span className="example-code">2*x + 3</span> - прямая линия
                        </li>
                        <li className="example-item">
                            <span className="example-code">sqrt(x)</span> - квадратный корень
                        </li>
                        <li className="example-item">
                            <span className="example-code">x^3 - 2*x</span> - кубическая функция
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default App;
