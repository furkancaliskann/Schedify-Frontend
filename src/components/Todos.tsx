import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from '@mui/icons-material/Edit';
import { TodoUpdate } from './Api';
import { useState } from 'react';
import UpdateTodo from './UpdateTodo';

export interface Todo {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    dueDate: string;
    updatedAt: string;
    status: number;
}

interface TodosProps {
    todos: Todo[];
    error: string | null;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onDeleteTodo: (todoId: number) => void;
    onUpdateTodo: (todoId: number, newTodo: TodoUpdate) => void;
}

const Todos = ({ todos, error, currentPage, totalPages, onPageChange, onDeleteTodo, onUpdateTodo }: TodosProps) => {

    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

    const handleUpdateTodo = (todoId: number, newTodo: TodoUpdate) => {
        onUpdateTodo(todoId, newTodo);
        setEditingTodo(null);
    };

    const handleCancel = () => {
        setEditingTodo(null);
    };
    if (error) {
        return (
            <Typography color="error" variant="h6" align="center">
                {error}
            </Typography>
        );
    }

    if (todos.length === 0) {
        return (
            <Typography variant="h6" align="center">
                No todos available
            </Typography>
        );
    }

    const getStatusLabel = (status: number): string => {
        switch (status) {
            case 0:
                return 'Pending';
            case 1:
                return 'Completed';
            case 2:
                return 'In Progress';
            case 3:
                return 'Cancelled';
            default:
                return 'Unknown';
        }
    };

    return (
        <div>
            {
                !editingTodo ? (
                    <div>

                        <div style={{ marginTop: '20px', textAlign: 'center', marginBottom: '50px' }}>
                            <Button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                variant="contained"
                                color="primary"
                                sx={{
                                    marginRight: '8px',
                                    width: '120px',
                                    minWidth: '120px',
                                }}
                            >
                                Previous
                            </Button>
                            <Typography variant="body1" component="span" sx={{ margin: '0 16px' }}>
                                Page {currentPage} of {totalPages}
                            </Typography>
                            <Button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                variant="contained"
                                color="primary"
                                sx={{
                                    marginLeft: '8px',
                                    width: '120px',
                                    minWidth: '120px',
                                }}
                            >
                                Next
                            </Button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <TableContainer component={Paper} sx={{ marginBottom: '16px', width: '800px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: '20px' }}><Typography variant="subtitle1"></Typography></TableCell>
                                            <TableCell sx={{ width: '20px' }}><Typography variant="subtitle1"></Typography></TableCell>
                                            {/* <TableCell><Typography variant="subtitle1" fontWeight="bold">ID</Typography></TableCell> */}
                                            <TableCell><Typography variant="subtitle1" fontWeight="bold">Title</Typography></TableCell>
                                            <TableCell><Typography variant="subtitle1" fontWeight="bold">Description</Typography></TableCell>
                                            {/* <TableCell><Typography variant="subtitle1" fontWeight="bold">Created At</Typography></TableCell> */}
                                            <TableCell><Typography variant="subtitle1" fontWeight="bold">Due Date</Typography></TableCell>
                                            {/* <TableCell><Typography variant="subtitle1" fontWeight="bold">Updated At</Typography></TableCell> */}
                                            <TableCell><Typography variant="subtitle1" fontWeight="bold">Status</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {todos.map((todo) => (
                                            <TableRow key={todo.id}>
                                                <TableCell>
                                                    <Button
                                                        variant='contained'
                                                        color='error'
                                                        onClick={() => onDeleteTodo(todo.id)}
                                                        sx={{
                                                            width: '35px',
                                                            height: '35px',
                                                            minWidth: 'unset',
                                                            padding: '0',
                                                            margin: '0 auto',
                                                            borderRadius: '50%'
                                                        }}
                                                    >
                                                        <RemoveCircleIcon style={{ width: '35px', height: '35px' }} />
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant='contained'
                                                        color='warning'
                                                        onClick={() => setEditingTodo(todo)}
                                                        sx={{
                                                            width: '35px',
                                                            height: '35px',
                                                            minWidth: 'unset',
                                                            padding: '0',
                                                            margin: '0 auto',
                                                            borderRadius: '50%'
                                                        }}
                                                    >
                                                        <EditIcon style={{ width: '35px', height: '35px' }} />
                                                    </Button>
                                                </TableCell>
                                                <TableCell sx={{ textDecoration: todo.status === 1 ? 'line-through' : 'none' }}>
                                                    {todo.title}
                                                </TableCell>
                                                <TableCell sx={{ textDecoration: todo.status === 1 ? 'line-through' : 'none' }}>
                                                    {todo.description}
                                                </TableCell>
                                                <TableCell sx={{ textDecoration: todo.status === 1 ? 'line-through' : 'none' }}>
                                                    {new Date(todo.dueDate).toLocaleString()}
                                                </TableCell>
                                                <TableCell sx={{ textDecoration: todo.status === 1 ? 'line-through' : 'none' }}>
                                                    {getStatusLabel(todo.status)}
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                    </div>

                ) : (
                    <UpdateTodo todo={editingTodo} onUpdateTodo={(updatedTodo) => handleUpdateTodo(editingTodo.id, updatedTodo)} onCancel={handleCancel} />
                )
            }
        </div>
    );
};

export default Todos;