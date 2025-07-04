import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTodos } from '../context/TodoContext';
import { useNavigate } from 'react-router-dom';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import TodoStats from './TodoStats';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { todos, loading, error, getTodos, getTodoStats, clearError } = useTodos();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        getTodos();
        getTodoStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateTodo = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    return (
        <div className="todo-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>📝 Todo Dashboard</h1>
                    <p>Welcome back, {user?.name}!</p>
                </div>
                <div className="header-right">
                    <button onClick={handleCreateTodo} className="create-todo-btn">
                        ➕ New Todo
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        🚪 Logout
                    </button>
                </div>
            </header>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={clearError} className="error-close">❌</button>
                </div>
            )}

            <div className="dashboard-content">
                <aside className="dashboard-sidebar">
                    <TodoStats />
                </aside>

                <main className="todo-main">
                    <div className="todo-list-header">
                        <h2>Your Todos</h2>
                        <div className="todo-count">
                            {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
                        </div>
                    </div>

                    {loading && !todos.length ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading your todos...</p>
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>No todos yet!</h3>
                            <p>Create your first todo to get started.</p>
                            <button onClick={handleCreateTodo} className="create-first-todo-btn">
                                ➕ Create Your First Todo
                            </button>
                        </div>
                    ) : (
                        <div className="todo-list">
                            {todos.map(todo => (
                                <TodoItem
                                    key={todo._id}
                                    todo={todo}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {showForm && (
                <TodoForm onClose={handleCloseForm} />
            )}
        </div>
    );
};

export default Dashboard;
