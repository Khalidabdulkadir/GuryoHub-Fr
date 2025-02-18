import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../Redux/authSlice";

const UserAccount = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redirectForgot, setRedirectForgot] = useState(false);
    const auth = useSelector((state) => state.auth.value);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getCookie('token');
                if (!token) {
                    dispatch(setAuth(false));
                    return;
                }
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await axios.get('https://api.guryohub.com/users/user');
                setUserData(response.data.user);
                dispatch(setAuth(true));
            } catch (error) {
                dispatch(setAuth(false));
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
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
    };

    if (redirectForgot) {
        return <Navigate to="/forgot" />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="card shadow-lg p-4" style={{ borderRadius: "12px", maxWidth: "500px", width: "100%" }}>
                {auth ? (
                    <>
                        <h4 className="text-center mb-4" style={{ color: "#333" }}>User Information</h4>
                        {userData ? (
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>Email:</strong> {userData.email}</li>
                                <li className="list-group-item"><strong>First Name:</strong> {userData.first_name}</li>
                                <li className="list-group-item"><strong>Last Name:</strong> {userData.last_name}</li>
                                <li className="list-group-item"><strong>Role:</strong> {userData.role}</li>
                                <li className="list-group-item"><strong>Branch Name:</strong> {userData.branch_name}</li>
                            </ul>
                        ) : (
                            <div className="text-center">No user data available</div>
                        )}
                        <div className="text-center mt-4">
                            <button
                                className="btn btn-primary"
                                style={{ padding: "10px 30px", fontWeight: "bold", fontSize: "16px" }}
                                onClick={() => setRedirectForgot(true)}
                            >
                                Update Info
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <h4 style={{ color: "#555", marginTop: "20px" }}>You are not authenticated</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserAccount;