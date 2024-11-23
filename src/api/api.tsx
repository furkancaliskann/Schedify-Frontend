import axios from 'axios'

const API_URL = 'https://localhost:7128/api/todos';

export const getTodos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fecthing todos', error);
        throw error;
    }
}