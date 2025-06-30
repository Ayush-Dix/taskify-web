import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';

const TodoForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        dueDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { createTodo } = useTodos();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Please enter a title');
            return;
        }

        setIsSubmitting(true);

        const result = await createTodo(formData);

        setIsSubmitting(false);

        if (result.success) {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                category: '',
                dueDate: ''
            });
            if (onClose) onClose();
        } else {
            alert(result.error || 'Failed to create todo');
        }
    };

    return (
        <div className="todo-form-overlay">
            <div className="todo-form-container">
                <div className="todo-form-header">
                    <h2>Create New Todo</h2>
                    <button onClick={onClose} className="close-btn">❌</button>
                </div>

                <form onSubmit={onSubmit} className="todo-form">
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={onChange}
                            placeholder="Enter todo title"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={onChange}
                            placeholder="Enter description (optional)"
                            rows="3"
                            maxLength={500}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={onChange}
                            >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={onChange}
                                placeholder="e.g., Work, Personal"
                                maxLength={50}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={onChange}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-button"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : '✅ Create Todo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoForm;
