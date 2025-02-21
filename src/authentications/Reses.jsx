import React, { useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";

export const Reset = () => {
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [redirect, setRedirect] = useState(false);
    const { token } = useParams();

    const submit = async (e) => {
        e.preventDefault();
        await axios.post("api.guryohub.com/users/reset", {
            token,
            password,
            password_confirm: passwordConfirm,
        });
        setRedirect(true);
    };

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8f9fa",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "2rem",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
            >
                <form onSubmit={submit}>
                    <h1
                        style={{ color: "#333", textAlign: "center" }}
                        className="h3 mb-3 fw-normal"
                    >
                        Reset your password
                    </h1>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPasswordConfirm"
                            placeholder="Confirm Password"
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                        <label htmlFor="floatingPasswordConfirm">
                            Confirm Password
                        </label>
                    </div>
                    <button
                        className="w-100 btn btn-lg btn-primary"
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
    );
};