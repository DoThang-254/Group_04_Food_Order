import React, { useContext, useRef, useState } from 'react';
import { checkEmail, saveRequest } from '../../services/users';
import { Link, useNavigate } from 'react-router-dom';
import { themeContext } from '../../context/ThemeContext';

const ForgotPassword = () => {
    const [msg, setMsg] = useState('');
    const emailRef = useRef();
    const nav = useNavigate()
    const { theme } = useContext(themeContext)
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

    const containerStyle = {
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: theme === 'dark' ? '0 0 10px #aaa' : ''
    };
    const containerStyleBorder = {
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        borderRadius: '10px',
        padding: '30px',
    };

    return (
        <div className="container mt-5" style={containerStyleBorder}>
            <div style={containerStyle}>
                <h3>Forgot Password</h3>
                <div className="mb-3">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        ref={emailRef}
                        required
                        style={{
                            backgroundColor: theme === 'dark' ? '#333' : '#fff',
                            color: theme === 'dark' ? '#fff' : '#000',
                            border: theme === 'dark' ? '1px solid #555' : '1px solid #ccc',
                        }}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleForgotPassword}
                >
                    Send Reset Link
                </button>

                {msg && <div className="mt-3 text-info">{msg}</div>}
            </div>
        </div>
    );
};

export default ForgotPassword;