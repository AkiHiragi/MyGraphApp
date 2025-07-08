import React, { useState } from 'react';
import './GraphForm.css';

interface GraphFormProps {
    onSubmit: (data: GraphRequest) => void;
    loading: boolean;
}

interface GraphRequest {
    function: string;
    minX: number;
    maxX: number;
    points: number;
}

const GraphForm: React.FC<GraphFormProps> = ({ onSubmit, loading }) => {
    const [function_, setFunction] = useState('x^2');
    const [minX, setMinX] = useState(-10);
    const [maxX, setMaxX] = useState(10);
    const [points, setPoints] = useState(100);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            function: function_,
            minX,
            maxX,
            points
        });
    };

    const quickFunctions = [
        { label: 'x²', value: 'x^2' },
        { label: 'sin(x)', value: 'sin(x)' },
        { label: 'cos(x)', value: 'cos(x)' },
        { label: '2x+3', value: '2*x + 3' },
    ];

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group function-input">
                    <label className="form-label">
                        📈 Функция
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
                    <label className="form-label">
                        ⬅️ Min X
                    </label>
                    <input
                        type="number"
                        value={minX}
                        onChange={(e) => setMinX(Number(e.target.value))}
                        className="form-input"
                        step="0.1"
                    />
                </div>

                <div className="form-group number-input">
                    <label className="form-label">
                        ➡️ Max X
                    </label>
                    <input
                        type="number"
                        value={maxX}
                        onChange={(e) => setMaxX(Number(e.target.value))}
                        className="form-input"
                        step="0.1"
                    />
                </div>

                <div className="form-group number-input">
                    <label className="form-label">
                        🔢 Точек
                    </label>
                    <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        min="10"
                        max="1000"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label invisible-label">
                        Кнопка
                    </label>
                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? (
                            <>
                                <span className="submit-button-loading" />
                                Вычисляем...
                            </>
                        ) : (
                            <>🚀 Построить график</>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default GraphForm;
