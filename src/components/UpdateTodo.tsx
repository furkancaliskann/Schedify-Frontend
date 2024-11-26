import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Todo } from './Todos';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText, Typography } from '@mui/material';

interface UpdateTodoProps {
    todo: Todo;
    onUpdateTodo: (updatedTodo: Todo) => void;
    onCancel: () => void;
}

const UpdateTodo = ({ todo, onUpdateTodo, onCancel }: UpdateTodoProps) => {
    const formik = useFormik({
        initialValues: {
            title: todo.title,
            description: todo.description,
            dueDate: todo.dueDate,
            status: todo.status,
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .max(20, 'Title must be at most 20 characters')
                .required('Title is required'),
            description: Yup.string()
                .max(100, 'Description must be at most 100 characters')
                .required('Description is required'),
            status: Yup.number().oneOf([0, 1, 2, 3]).required('Status is required'),
        }),
        onSubmit: (values) => {
            const dueDate = new Date(values.dueDate);

            const utcDueDate = new Date(Date.UTC(
                dueDate.getFullYear(),
                dueDate.getMonth(),
                dueDate.getDate(),
                dueDate.getHours(),
                dueDate.getMinutes(),
                dueDate.getSeconds()
            ));

            onUpdateTodo({
                ...values,
                dueDate: utcDueDate.toISOString(),
                status: Number(values.status),
                id: todo.id,
                createdAt: todo.createdAt,
                updatedAt: new Date().toISOString(),
            });
        }
    });

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom style={{ marginBottom: '40px' }}>
                Update Todo
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <TextField
                        fullWidth
                        label="Title"
                        id="title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <TextField
                        fullWidth
                        label="Description"
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        multiline
                        rows={4}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <TextField
                        fullWidth
                        label="Due Date"
                        id="dueDate"
                        name="dueDate"
                        type="datetime-local"
                        value={formik.values.dueDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                        helperText={formik.touched.dueDate && formik.errors.dueDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)} sx={{ marginTop: '10px' }}>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label="Status"
                        >
                            <MenuItem value={0}>Pending</MenuItem>
                            <MenuItem value={1}>Completed</MenuItem>
                            <MenuItem value={2}>In Progress</MenuItem>
                            <MenuItem value={3}>Cancelled</MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
                    </FormControl>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                    >
                        Update Todo
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UpdateTodo;
