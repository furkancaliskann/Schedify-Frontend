import React from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Todo {
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
}

const Todos = ({
    todos,
    error,
    currentPage,
    totalPages,
    onPageChange,
}: TodosProps) => {
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
            <TableContainer component={Paper} sx={{ marginBottom: '16px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1" fontWeight="bold">ID</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1" fontWeight="bold">Title</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1" fontWeight="bold">Description</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1" fontWeight="bold">Created At</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1" fontWeight="bold">Due Date</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1" fontWeight="bold">Updated At</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1" fontWeight="bold">Status</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {todos.map((todo) => (
                            <TableRow key={todo.id}>
                                <TableCell>{todo.id}</TableCell>
                                <TableCell>{todo.title}</TableCell>
                                <TableCell>{todo.description}</TableCell>
                                <TableCell>{new Date(todo.createdAt).toLocaleString()}</TableCell>
                                <TableCell>{new Date(todo.dueDate).toLocaleString()}</TableCell>
                                <TableCell>{new Date(todo.updatedAt).toLocaleString()}</TableCell>
                                <TableCell>{getStatusLabel(todo.status)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: '8px' }}
                >
                    Previous
                </Button>
                <Typography variant="body1" component="span">
                    Page {currentPage} of {totalPages}
                </Typography>
                <Button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="contained"
                    color="primary"
                    sx={{ marginLeft: '8px' }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Todos;