import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../Redux/authSlice";

// Function to get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

export const Forgot = () => {
    const [email, setEmail] = useState("");
    const [notify, setNotify] = useState({
        show: false,
        error: false,
        message: "",
    });
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getCookie("token");
                if (!token) {
                    dispatch(setAuth(false));
                    return;
                }
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                await axios.get("https://api.guryohub.com/users/user");
                dispatch(setAuth(true));
            } catch {
                dispatch(setAuth(false));
            }
        };
        fetchData();
    }, [dispatch]);

    const submit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://api.guryohub.com/users/forgot", { email });
            setNotify({
                show: true,
                error: false,
                message: "Please check your email!",
            });
        } catch {
            setNotify({
                show: true,
                error: true,
                message: "Error occurred!",
            });
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f2f5",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    maxWidth: "800px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div style={{ flex: 1 }}>
                    <img
                        src="/images/pos.jpg"
                        alt="Dugsi Manager Logo"
                        style={{
                            objectFit: "contain",
                            width: "100%",
                            height: "auto",
                        }}
                    />
                </div>
                <div style={{ flex: 1, padding: "2rem" }}>
                    {notify.show && (
                        <div
                            className={`alert ${
                                notify.error ? "alert-danger" : "alert-success"
                            }`}
                            role="alert"
                        >
                            {notify.message}
                        </div>
                    )}
                    <form onSubmit={submit}>
                        <h1 className="h3 mb-3 fw-normal text-center">
                            Forgot your password?
                        </h1>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingInput"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Email address</label>
                        </div>
                        <button
                            className="w-100 btn btn-lg btn-primary mt-3"
                            type="submit"
                            style={{
                                fontSize: "1rem",
                                padding: "0.75rem",
                                backgroundColor: "#007bff",
                                borderColor: "#007bff",
                            }}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};