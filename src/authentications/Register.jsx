import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../Redux/authSlice';

const Register = () => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [userType, setUserType] = useState('admin');  // Default to 'admin'
    const [branch, setBranch] = useState(null);
    const [branchName, setBranchName] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [formInvalid, setFormInvalid] = useState(false);
    const dispatch = useDispatch();
    const [userRole, setUserRole] = useState('');
    const auth = useSelector((state) => state.auth.value);

    const submit = async (e) => {
        e.preventDefault();

        if (!first_name || !last_name || !email || !password || !passwordConfirm) {
            setFormInvalid(true);
            return;
        }

        if (password !== passwordConfirm) {
            alert('Password and password confirmation do not match.');
            return;
        }
        try {
            await axios.post('http://192.168.0.110:8000/users/register', {
                first_name,
                last_name,
                email,
                password,
                password_confirm: passwordConfirm,
                role: userType,
                branch,
                branch_name: branchName
            });

            setRedirect(true);
        } catch (error) {
            console.error('Error registering user:', error);
            alert('An error occurred while registering the user.');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getCookie('token');
                if (!token) {
                    dispatch(setAuth(false));
                    return;
                }
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const { data } = await axios.get('http://192.168.0.110:8000/users/user');
                dispatch(setAuth(true));
            } catch (e) {
                dispatch(setAuth(false));
            }
        };
        const fetchUserRole = async () => {
            try {
                const { data } = await axios.get('http://192.168.0.110:8000/users/user');
                setUserRole(data.user.role);
            } catch (error) {
                console.error('Failed to fetch user role:', error);
            } finally {
            }
        };
        fetchData();
        fetchUserRole()
    }, [dispatch]);

    const getCookie = (name) => {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return '';
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                    <div className="col-md-6" style={{ margin: "10px auto" }}>
                        <form onSubmit={submit} className="mt-5">
                            <h1 className="h3 mb-3 fw-normal text-center">Please register</h1>
                            {formInvalid && (
                                <div className="alert alert-danger" role="alert">
                                    Please fill in all the required fields.
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="userType" className="form-label">User Type:</label>
                                <select
                                    className="form-select"
                                    id="userType"
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="accountant">Accountant</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <div className="form-floating">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="firstName" 
                                        placeholder="First Name"
                                        value={first_name}
                                        onChange={e => setFirstName(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="firstName">First Name</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-floating">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="lastName" 
                                        placeholder="Last Name"
                                        value={last_name}
                                        onChange={e => setLastName(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="lastName">Last Name</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-floating">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="email">Email address</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-floating">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="password" 
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="password">Password</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-floating">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="passwordConfirm" 
                                        placeholder="Password Confirm"
                                        value={passwordConfirm}
                                        onChange={e => setPasswordConfirm(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="passwordConfirm">Password Confirm</label>
                                </div>
                            </div>
                            <div className="mb-3">
                            </div>
                            <button className="w-100 btn btn-lg btn-primary mt-3" type="submit">Submit</button>
                        </form>
                        </div>
                        </div>
        </div>
    );
}

export default Register;