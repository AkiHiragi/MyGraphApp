import './GraphForm.css'
import React, {useState} from "react";

interface MultiGraphFormProps {
    onAddGraph: (data: GraphRequest) => void;
    onRemoveGraph: (id: string) => void;
    onToggleGraph: (id: string) => void;
    graphs: GraphData[];
    loading: boolean;
}

interface GraphRequest {
    function: string;
    minX: number;
    maxX: number;
    points: number;
}

interface GraphData {
    id: string;
    function: string;
    points: any[];
    color: string;
    visible: boolean;
}

const MultiGraphForm: React.FC<MultiGraphFormProps> = ({
                                                           onAddGraph,
                                                           onRemoveGraph,
                                                           onToggleGraph,
                                                           graphs,
                                                           loading
                                                       }) => {
    const [function_, setFunction] = useState('x^2');
    const [minX, setMinX] = useState(-10);
    const [maxX, setMaxX] = useState(10);
    const [points, setPoints] = useState(100);

    // Вычисляем рекомендуемое количество точек
    const range = maxX - minX;
    const recommendedPoints = Math.ceil(range * 20);
    const actualPoints = Math.max(points, recommendedPoints);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddGraph({
            function: function_,
            minX,
            maxX,
            points
        });
        setFunction('');
    };

    const quickFunctions = [
        {label: 'x²', value: 'x^2'},
        {label: 'sin(x)', value: 'sin(x)'},
        {label: 'cos(x)', value: 'cos(x)'},
        {label: '2x+3', value: '2*x + 3'},
    ];

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group function-input">
                        <label className="form-label">
                            📈 Добавить функцию
                        </label>
                        <input
                            type="text"
                            value={function_}
                            onChange={(e) => setFunction(e.target.value)}
                            placeholder="Например: sin(x), x^2, 2*x + 3"
                            className="form-input"
                            required
                        />
                        <div className="quick-functions">
                            {quickFunctions.map((func) => (
                                <button
                                    key={func.value}
                                    type="button"
                                    onClick={() => setFunction(func.value)}
                                    className="quick-function-btn"
                                >
                                    {func.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group number-input">
                        <label className="form-label">⬅️ Min X</label>
                        <input
                            type="number"
                            value={minX}
                            onChange={(e) => setMinX(Number(e.target.value))}
                            className="form-input"
                            step="0.1"
                        />
                    </div>

                    <div className="form-group number-input">
                        <label className="form-label">➡️ Max X</label>
                        <input
                            type="number"
                            value={maxX}
                            onChange={(e) => setMaxX(Number(e.target.value))}
                            className="form-input"
                            step="0.1"
                        />
                    </div>

                    <div className="form-group number-input">
                        <label className="form-label">🔢 Точек</label>
                        <input
                            type="number"
                            value={points}
                            onChange={(e) => setPoints(Number(e.target.value))}
                            min="10"
                            max="2000"
                            className="form-input"
                        />
                        {actualPoints > points && (
                            <div className="points-info">
                                Будет использовано: {actualPoints} точек
                                <br/>
                                <small>(минимум для диапазона {range}: {recommendedPoints})</small>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label invisible-label">Кнопка</label>
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? (
                                <>
                                    <span className="submit-button-loading"/>
                                    Добавляем...
                                </>
                            ) : (
                                <>➕ Добавить график</>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Список добавленных графиков */}
            {graphs.length > 0 && (
                <div style={{marginTop: '1.5rem'}}>
                    <h4 style={{marginBottom: '1rem', color: '#333'}}>📊 Графики на диаграмме:</h4>
                    <div className="graphs-list">
                        {graphs.map((graph) => (
                            <div key={graph.id} className="graph-item">
                                <div className="graph-info">
                                    <div
                                        className="graph-color"
                                        style={{backgroundColor: graph.color}}
                                    ></div>
                                    <span className="graph-function">{graph.function}</span>
                                    <span className="graph-points">({graph.points.length} точек)</span>
                                </div>
                                <div className="graph-controls">
                                    <button
                                        onClick={() => onToggleGraph(graph.id)}
                                        className={`toggle-btn ${graph.visible ? 'visible' : 'hidden'}`}
                                    >
                                        {graph.visible ? '👁️' : '🙈'}
                                    </button>
                                    <button
                                        onClick={() => onRemoveGraph(graph.id)}
                                        className="remove-btn"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MultiGraphForm;
