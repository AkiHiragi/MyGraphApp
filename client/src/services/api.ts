import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface GraphRequest {
    function: string;
    minX: number;
    maxX: number;
    points: number;
}

export interface GraphPoint {
    x: number;
    y: number;
}

export interface GraphResponse {
    points: GraphPoint[];
    success: boolean;
    error?: string;
}

export const calculateGraph = async (request: GraphRequest): Promise<GraphResponse> => {
    try {
        const response = await axios.post<GraphResponse>(`${API_BASE_URL}/Graph/calculate`, request);
        return response.data;
    } catch (error) {
        throw new Error('Ошибка при вычислении графика');
    }
};
