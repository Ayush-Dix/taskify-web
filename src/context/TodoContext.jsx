import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
    todos: [],
    stats: {
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0
    },
    loading: false,
    error: null
};

// Action types
const TODO_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_TODOS: 'SET_TODOS',
    ADD_TODO: 'ADD_TODO',
    UPDATE_TODO: 'UPDATE_TODO',
    DELETE_TODO: 'DELETE_TODO',
    SET_STATS: 'SET_STATS',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const todoReducer = (state, action) => {
    switch (action.type) {
        case TODO_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case TODO_ACTIONS.SET_TODOS:
            return {
                ...state,
                todos: action.payload,
                loading: false,
                error: null
            };
        case TODO_ACTIONS.ADD_TODO:
            return {
                ...state,
                todos: [action.payload, ...state.todos],
                loading: false,
                error: null
            };
        case TODO_ACTIONS.UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo._id === action.payload._id ? action.payload : todo
                ),
                loading: false,
                error: null
            };
        case TODO_ACTIONS.DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo._id !== action.payload),
                loading: false,
                error: null
            };
        case TODO_ACTIONS.SET_STATS:
            return {
                ...state,
                stats: action.payload,
                error: null
            };
        case TODO_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case TODO_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Create context
const TodoContext = createContext();

// TodoProvider component
export const TodoProvider = ({ children }) => {
    const [state, dispatch] = useReducer(todoReducer, initialState);

    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    // Get todo statistics
    const getTodoStats = async () => {
        try {
            const token = localStorage.getItem('token');
            setAuthToken(token);

            const res = await axios.get('http://localhost:5000/api/todos/stats');
            dispatch({
                type: TODO_ACTIONS.SET_STATS,
                payload: res.data.data
            });
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.SET_ERROR,
                payload: error.response?.data?.message || 'Failed to fetch stats'
            });
        }
    };

    // Get all todos
    const getTodos = async () => {
        dispatch({ type: TODO_ACTIONS.SET_LOADING, payload: true });

        try {
            const token = localStorage.getItem('token');
            setAuthToken(token);

            const res = await axios.get(`http://localhost:5000/api/todos`);
            dispatch({
                type: TODO_ACTIONS.SET_TODOS,
                payload: res.data.data
            });
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.SET_ERROR,
                payload: error.response?.data?.message || 'Failed to fetch todos'
            });
        }
    };

    // Create new todo
    const createTodo = async (todoData) => {
        dispatch({ type: TODO_ACTIONS.SET_LOADING, payload: true });

        try {
            const token = localStorage.getItem('token');
            setAuthToken(token);

            const res = await axios.post('http://localhost:5000/api/todos', todoData);
            dispatch({
                type: TODO_ACTIONS.ADD_TODO,
                payload: res.data.data
            });
            getTodoStats();
            return { success: true };
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.SET_ERROR,
                payload: error.response?.data?.message || 'Failed to create todo'
            });
            return { success: false, error: error.response?.data?.message };
        }
    };

    // Update todo
    const updateTodo = async (id, todoData) => {
        dispatch({ type: TODO_ACTIONS.SET_LOADING, payload: true });

        try {
            const token = localStorage.getItem('token');
            setAuthToken(token);

            const res = await axios.put(`http://localhost:5000/api/todos/${id}`, todoData);
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO,
                payload: res.data.data
            });
            getTodoStats();
            return { success: true };
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.SET_ERROR,
                payload: error.response?.data?.message || 'Failed to update todo'
            });
            return { success: false, error: error.response?.data?.message };
        }
    };

    // Delete todo
    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            setAuthToken(token);

            await axios.delete(`http://localhost:5000/api/todos/${id}`);
            // Remove the todo from state immediately
            dispatch({
                type: TODO_ACTIONS.DELETE_TODO,
                payload: id
            });
            // Also refresh stats
            getTodoStats();
            return { success: true };
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.SET_ERROR,
                payload: error.response?.data?.message || 'Failed to delete todo'
            });
            return { success: false, error: error.response?.data?.message };
        }
    };

    // Toggle todo completion
    const toggleTodo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            setAuthToken(token);

            const res = await axios.patch(`http://localhost:5000/api/todos/${id}/toggle`);
            // Update the todo in state immediately
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO,
                payload: res.data.data
            });
            // Also refresh stats
            getTodoStats();
            return { success: true };
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.SET_ERROR,
                payload: error.response?.data?.message || 'Failed to toggle todo'
            });
            return { success: false };
        }
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: TODO_ACTIONS.CLEAR_ERROR });
    };

    return (
        <TodoContext.Provider
            value={{
                ...state,
                getTodos,
                createTodo,
                updateTodo,
                deleteTodo,
                toggleTodo,
                getTodoStats,
                clearError
            }}
        >
            {children}
        </TodoContext.Provider>
    );
};

// Custom hook to use todo context
export const useTodos = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodos must be used within a TodoProvider');
    }
    return context;
};
