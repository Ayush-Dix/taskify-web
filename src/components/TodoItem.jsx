import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';

const TodoItem = ({ todo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        category: todo.category || '',
        dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
    });

    const { updateTodo, deleteTodo, toggleTodo } = useTodos();

    const handleToggle = async () => {
        await toggleTodo(todo._id);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        const result = await updateTodo(todo._id, editForm);
        if (result.success) {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditForm({
            title: todo.title,
            description: todo.description || '',
            priority: todo.priority,
            category: todo.category || '',
            dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
        });
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            await deleteTodo(todo._id);
        }
    };

    const onChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ff6b6b';
            case 'medium': return '#ffa726';
            case 'low': return '#66bb6a';
            default: return '#757575';
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
    };

    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
            <div className="todo-header">
                <div className="todo-checkbox">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={handleToggle}
                        disabled={isEditing}
                    />
                </div>

                <div className="todo-priority" style={{ backgroundColor: getPriorityColor(todo.priority) }}>
                    {todo.priority}
                </div>

                {todo.category && (
                    <div className="todo-category">
                        {todo.category}
                    </div>
                )}
            </div>

            <div className="todo-content">
                {isEditing ? (
                    <div className="todo-edit-form">
                        <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={onChange}
                            placeholder="Todo title"
                            className="edit-title"
                        />
                        <textarea
                            name="description"
                            value={editForm.description}
                            onChange={onChange}
                            placeholder="Description (optional)"
                            className="edit-description"
                            rows="2"
                        />
                        <div className="edit-row">
                            <select
                                name="priority"
                                value={editForm.priority}
                                onChange={onChange}
                                className="edit-priority"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <input
                                type="text"
                                name="category"
                                value={editForm.category}
                                onChange={onChange}
                                placeholder="Category"
                                className="edit-category"
                            />
                            <input
                                type="date"
                                name="dueDate"
                                value={editForm.dueDate}
                                onChange={onChange}
                                className="edit-date"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="todo-display">
                        <h3 className="todo-title">{todo.title}</h3>
                        {todo.description && (
                            <p className="todo-description">{todo.description}</p>
                        )}
                        <div className="todo-meta">
                            {todo.dueDate && (
                                <span className={`todo-due-date ${isOverdue ? 'overdue' : ''}`}>
                                    📅 Due: {formatDate(todo.dueDate)}
                                </span>
                            )}
                            <span className="todo-created">
                                Created: {formatDate(todo.createdAt)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="todo-actions">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="save-btn">
                            ✅ Save
                        </button>
                        <button onClick={handleCancel} className="cancel-btn">
                            ❌ Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={handleEdit} className="edit-btn" disabled={todo.completed}>
                            ✏️ Edit
                        </button>
                        <button onClick={handleDelete} className="delete-btn">
                            🗑️ Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TodoItem;
