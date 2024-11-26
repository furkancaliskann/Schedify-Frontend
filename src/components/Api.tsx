import axios from 'axios';

interface TodoResponse {
    data: any[];
    totalPages: number;
}

export interface TodoUpdate {
    title: string;
    description: string;
    dueDate: string;
    status: number;
}

export const fetchTodos = async (token: string, page: number, pageSize: number): Promise<TodoResponse> => {
    try {
        const response = await axios.get('https://localhost:7128/api/todos', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                pageNumber: page,
                pageSize: pageSize,
            },
        });
        // console.log(response.data);
        return response.data;
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

    console.log(todo.dueDate);
    return response.data;
};

export const deleteTodo = async (token: string, todoId: number) => {
    await axios.delete('https://localhost:7128/api/todos/' + todoId, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const updateTodo = async (token: string, todoId: number, newTodo: TodoUpdate) => {
    await axios.put(`https://localhost:7128/api/todos/${todoId}`, newTodo, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

