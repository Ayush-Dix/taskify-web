import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const { register, error, loading, isAuthenticated, clearErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        clearErrors();
    }, []);

    const { name, email, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (name === '' || email === '' || password === '' || confirmPassword === '') {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }

        setPasswordsMatch(true);
        register({ name, email, password });
    };

    // Check if passwords match in real-time
    useEffect(() => {
        if (password && confirmPassword) {
            setPasswordsMatch(password === confirmPassword);
        }
    }, [password, confirmPassword]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join us today</p>

                {error && <div className="error-message">{error}</div>}
                {!passwordsMatch && <div className="error-message">Passwords do not match</div>}

                <form onSubmit={onSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={onChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="Create a password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        <small className="password-hint">
                            Must be at least 6 characters with uppercase, lowercase, and number
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={onChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading || !passwordsMatch}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account?{' '}
                    <Link to="/login">Sign in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
