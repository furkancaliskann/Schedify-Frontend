import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TodoUpdate } from './Api';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText, Typography } from '@mui/material';

interface AddTodoProps {
    onAddTodo: (addedTodo: TodoUpdate) => void;
    onCancel: () => void;
}

const AddTodo = ({ onAddTodo, onCancel }: AddTodoProps) => {
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            dueDate: '',
            status: 0,
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

            console.log(utcDueDate.toISOString());

            onAddTodo({
                ...values,
                dueDate: utcDueDate.toISOString(),
                status: Number(values.status),
            });
        },
    });

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '10px auto' }}>
            <Typography variant="h4" gutterBottom style={{ marginBottom: '40px' }}>
                Add New Todo
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <TextField
                        fullWidth
                        id="title"
                        name="title"
                        label="Title"
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
                        id="description"
                        name="description"
                        label="Description"
                        multiline
                        rows={4}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <TextField
                        fullWidth
                        id="dueDate"
                        name="dueDate"
                        label="Due Date"
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
                    <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
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
                        Add Todo
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

export default AddTodo;
