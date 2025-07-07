import React, {useState} from "react";

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

const GraphForm: React.FC<GraphFormProps> = ({onSubmit, loading}) => {
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

    return (
        <form onSubmit={handleSubmit} style={{marginBottom: '20px'}}>
            <div style={{marginBottom: '10px'}}>
                <label>
                    Функция:
                    <input
                        type={"text"}
                        value={function_}
                        onChange={(e) => setFunction(e.target.value)}
                        style={{marginLeft: '10px', padding: '5px', width: '200px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '10px'}}>
                <label>
                    Min X:
                    <input
                        type="number"
                        value={minX}
                        onChange={(e) => setMinX(Number(e.target.value))}
                        style={{marginLeft: '10px', padding: '5px', width: '80px'}}
                    />
                </label>

                <label style={{marginLeft: '20px'}}>
                    Max X:
                    <input
                        type="number"
                        value={maxX}
                        onChange={(e) => setMaxX(Number(e.target.value))}
                        style={{marginLeft: '10px', padding: '5px', width: '80px'}}
                    />
                </label>

                <label style={{marginLeft: '20px'}}>
                    Точек:
                    <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        min="10"
                        max="1000"
                        style={{marginLeft: '10px', padding: '5px', width: '80px'}}
                    />
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Вычисляем...' : 'Построить график'}
            </button>
        </form>
    )
}

export default GraphForm;