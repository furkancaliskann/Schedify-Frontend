import { useFormik } from 'formik';
import * as Yup from 'yup';

interface AddTodoProps {
    onAddTodo: (todo: { title: string; description: string; dueDate: string; status: number }) => void;
    onCancel: () => void;
}

const AddTodo = ({ onAddTodo, onCancel }: AddTodoProps) => {
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            dueDate: '',
            status: 0,  // status sayısal olarak 0
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
            // Due date'i dönüştürme
            const dueDate = new Date(values.dueDate).toISOString(); // ISO 8601 formatına dönüştürme: YYYY-MM-DDTHH:MM:SSZ
            console.log(values);
            // Sunucuya gönderilecek veri
            onAddTodo({
                ...values,
                dueDate: dueDate, // Dönüştürülmüş tarih
                status: Number(values.status), // Status'u sayısal formatta gönder
            });
        },
    });

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Add New Todo</h2>
            <form onSubmit={formik.handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                    {formik.touched.title && formik.errors.title && (
                        <div style={{ color: 'red' }}>{formik.errors.title}</div>
                    )}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                    {formik.touched.description && formik.errors.description && (
                        <div style={{ color: 'red' }}>{formik.errors.description}</div>
                    )}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="dueDate">Due Date:</label>
                    <input
                        type="datetime-local"
                        id="dueDate"
                        name="dueDate"
                        value={formik.values.dueDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                    {formik.touched.dueDate && formik.errors.dueDate && (
                        <div style={{ color: 'red' }}>{formik.errors.dueDate}</div>
                    )}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    >
                        <option value={0}>Pending</option>
                        <option value={1}>Completed</option>
                        <option value={2}>In Progress</option>
                        <option value={3}>Cancelled</option>
                    </select>
                    {formik.touched.status && formik.errors.status && (
                        <div style={{ color: 'red' }}>{formik.errors.status}</div>
                    )}
                </div>
                <button
                    type="submit"
                    style={{ padding: '10px 20px', cursor: 'pointer', marginRight: '10px' }}
                    disabled={!formik.isValid || formik.isSubmitting}
                >
                    Add Todo
                </button>
                <button
                    type="button"
                    style={{ padding: '10px 20px', cursor: 'pointer' }}
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AddTodo;
