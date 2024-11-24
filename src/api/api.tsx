import axios from 'axios';

// Define the expected return type for fetchTodos
interface TodoResponse {
    data: any[];  // Array of todos
    totalPages: number; // Total pages count
}

export const fetchTodos = async (token: string, page: number, pageSize: number): Promise<TodoResponse> => {
    try {
        const response = await axios.get('https://localhost:7128/api/todos', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                pageNumber: page,       // Sayfa numarası
                pageSize: pageSize,     // Sayfa başına öğe sayısı
            },
        });
        console.log(response.data);
        return response.data; // Veriyi döndürüyoruz
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

export const addTodo = async (token: string, todo: any) => {
    const response = await axios.post('https://localhost:7128/api/todos', todo, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
