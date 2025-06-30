import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    error: null
};

// Action types
const AUTH_ACTIONS = {
    USER_LOADED: 'USER_LOADED',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    AUTH_ERROR: 'AUTH_ERROR',
    LOGOUT: 'LOGOUT',
    CLEAR_ERRORS: 'CLEAR_ERRORS',
    SET_LOADING: 'SET_LOADING'
};

// Reducer function
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload,
                error: null
            };
        case AUTH_ACTIONS.REGISTER_SUCCESS:
        case AUTH_ACTIONS.LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
                user: action.payload.user,
                error: null
            };
        case AUTH_ACTIONS.AUTH_ERROR:
        case AUTH_ACTIONS.LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload
            };
        case AUTH_ACTIONS.CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Set auth token in axios header
    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    // Load user
    const loadUser = async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get('http://localhost:5000/api/auth/me');
            dispatch({
                type: AUTH_ACTIONS.USER_LOADED,
                payload: res.data.user
            });
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.AUTH_ERROR,
                payload: error.response?.data?.message || 'Authentication failed'
            });
        }
    };

    // Register user
    const register = async (userData) => {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', userData);
            dispatch({
                type: AUTH_ACTIONS.REGISTER_SUCCESS,
                payload: res.data
            });
            loadUser();
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.AUTH_ERROR,
                payload: error.response?.data?.message || 'Registration failed'
            });
        }
    };

    // Login user
    const login = async (userData) => {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', userData);
            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: res.data
            });
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.AUTH_ERROR,
                payload: error.response?.data?.message || 'Login failed'
            });
        }
    };

    // Logout
    const logout = () => {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // Clear errors
    const clearErrors = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERRORS });
    };

    // Load user when component mounts
    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                register,
                login,
                logout,
                clearErrors,
                loadUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
