import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { login } from '../../services/users';
import * as Yup from "yup";
import { Link, useNavigate } from 'react-router-dom';
import { loginContext } from '../../context/LoginContext';
import { createFakeToken } from '../../data/token';
const Login = () => {
    const LoginSchema = Yup.object().shape({
        password: Yup.string()
            .required('Required'),
        email: Yup.string()
            .email('Required email format!')
            .required('Required'),
    });


    const { setToken } = useContext(loginContext)
    const [loginError, setLoginError] = useState('');
    const navToHome = useNavigate();
    const handleLogin = async (value) => {
        const data = value
        login(data).then(async (res) => {
            if (res) {
                if (!res.msg) {
                    const fakeToken = await createFakeToken(res)
                    setToken(fakeToken);
                    switch (res.user.role) {
                        case 'customer': {
                            navToHome('/home');
                            break;
                        }
                        case 'admin': {
                            navToHome('/admin');
                            break;
                        }
                        case 'owner': {
                            navToHome('/owner-dashboard');
                            break;
                        }
                    }
                }
                else {
                    setToken('');
                    setLoginError(res.msg);
                }
            }
        }).catch(err => {
            console.log(err)
            setLoginError('Something went wrong.')
        }

        )
    }

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">Login</h3>

                <Formik
                    initialValues={{ email: '', password: '', rememberMe: false }}
                    onSubmit={value => handleLogin(value)}
                    validationSchema={LoginSchema}
                >
                    <Form>
                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <Field name="email" type="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <Field name="password" type="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>

                        {/* Remember Me + Forgot Password */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="form-check">
                                <Field type="checkbox" name="rememberMe" className="form-check-input" id="rememberMe" />
                                <label htmlFor="rememberMe" className="form-check-label">Remember me</label>
                            </div>
                            <Link to="/forgot-password" className="small">Forgot password?</Link>
                        </div>

                        {/* Error Message */}
                        {loginError && <div className="text-danger mb-3">{loginError}</div>}

                        {/* Submit */}
                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>

                        {/* Google Login */}
                        <div className="d-grid mb-3">
                            <button type="button" className="btn btn-outline-danger">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS60QdtjCrts2iWAX83BB_EgJiBLSCn1-9Nag&s"
                                    alt="Google"
                                    style={{ width: '20px', marginRight: '8px' }}
                                />
                                Login with Google
                            </button>
                        </div>

                        {/* Sign Up */}
                        <div className="text-center">
                            <span>Don't have an account? </span>
                            <Link to="/register">Sign Up Now</Link>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default Login;