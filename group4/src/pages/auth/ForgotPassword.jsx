import React, { useContext, useState } from 'react';
import { checkEmail, saveRequest } from '../../services/users';
import { useNavigate } from 'react-router-dom';
import { themeContext } from '../../context/ThemeContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ForgotPassword = () => {
    const [msg, setMsg] = useState('');
    const nav = useNavigate();
    const { theme } = useContext(themeContext);

    const ForgotSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
    });

    const handleForgotPassword = async (values) => {
        try {
            const res = await checkEmail(values.email);
            if (!res || res.length === 0) {
                setMsg('Email does not exist');
            } else {
                await saveRequest(values.email);
                nav("/reset-password");
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
    const inputStyle = {
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        border: theme === 'dark' ? '1px solid #555' : '1px solid #ccc',
    };

    return (
        <div className="container mt-5" style={containerStyleBorder}>
            <div style={containerStyle}>
                <h3>Forgot Password</h3>
                <Formik
                    initialValues={{ email: '' }}
                    validationSchema={ForgotSchema}
                    onSubmit={handleForgotPassword}
                >
                    <Form>
                        <div className="mb-3">
                            <label>Email *</label>
                            <Field
                                type="email"
                                name="email"
                                className="form-control"
                                style={inputStyle}
                            />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Send Reset Link
                        </button>
                    </Form>
                </Formik>

                {msg && <div className="mt-3 text-info">{msg}</div>}
            </div>
        </div>
    );
};

export default ForgotPassword;
