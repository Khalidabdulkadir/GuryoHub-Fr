import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './Loging.css'; // Import a CSS file for additional styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://192.168.0.110:8000/users/login', {
                email,
                password
            }, { withCredentials: true });
            document.cookie = `token=${data.token}; path=/`;
            setUserName(`${data.first_name} ${data.last_name}`);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            fetchUserRole(); // Fetch user role after successful login
        } catch (error) {
            setError('Login failed: Invalid credentials');
        }
    };

    const fetchUserRole = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://192.168.0.110:8000/users/user');
            setUserRole(data.user.role); // Ensure you access the role correctly from the response
            console.log('User role:', data.user.role); // Verify role in console
            setAuthenticated(true); // Set authenticated to true after successful login
        } catch (error) {
            console.error('Failed to fetch user role:', error);
            setError('Failed to fetch user role');
        } finally {
            setLoading(false);
        }
    };

    if (authenticated) {
        return <Navigate to="/dashboard" />; // Navigate to dashboard if authenticated
    }

    return (
        <div className="login-container">
            <div className="row rows g-0 rounded-lg border bg-white overflow-hidden shadow login-form-container">
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <img
                        src="../images/guri2.jpg"
                        alt="Logo"
                        className="img-fluid rounded login-image"
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                <div className="col-md-6 p-4">
                    <div className="text-center mb-4">
                        <h1 className="h3 mt-2 mb-3 fw-normal"><b>Welcome</b></h1>
                        <p style={{color: "darkblue"}}>To login, enter your email and password</p>
                    </div>
                    <form onSubmit={submit}>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control form-control-sm"
                                id="floatingInput"
                                placeholder="name@example.com"
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingInput">Email address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control form-control-sm"
                                id="floatingPassword"
                                placeholder="Password"
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        <div className="mb-3">
                            <Link to="/forgot">Forgot Password?</Link>
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">Login</button>
                    </form>
                    {loading && (
                        <div className="d-flex justify-content-center mt-3">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;