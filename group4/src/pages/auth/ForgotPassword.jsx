import React, { useRef, useState } from 'react';
import { checkEmail, saveRequest } from '../../services/users';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [msg, setMsg] = useState('');
    const emailRef = useRef();
    const nav = useNavigate()
    const handleForgotPassword = async () => {
        try {
            const email = emailRef.current.value;
            const res = await checkEmail(email);
            if (!res) {
                setMsg('Email is not exist');
            }
            else {
                await saveRequest(email);
                nav("/reset-password")
                setMsg("Password reset request saved.");
            }

        } catch (err) {
            setMsg("Something went wrong.");
        }
    };

    return (
        <div className="container mt-5">
            <h3>Forgot Password</h3>
            <div className="mb-3">
                <label>Email address</label>
                <input
                    type="email"
                    className="form-control"
                    ref={emailRef}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary"
                onClick={handleForgotPassword}
            >Send Reset Link</button>

            {msg && <div className="mt-3 text-info">{msg}</div>}

        </div>
    );
};

export default ForgotPassword;