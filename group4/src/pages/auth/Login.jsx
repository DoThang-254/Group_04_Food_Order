import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { login } from '../../services/users';
import * as Yup from "yup";
import { Link, useNavigate } from 'react-router-dom';
import { loginContext } from '../../context/LoginContext';
import { createFakeToken } from '../../data/token';
import { themeContext } from '../../context/ThemeContext';
const Login = () => {
    const LoginSchema = Yup.object().shape({
        password: Yup.string()
            .required('Required'),
        email: Yup.string()
            .email('Required email format!')
            .required('Required'),
    });

    const { theme } = useContext(themeContext);
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
        <div className={`container d-flex justify-content-center align-items-center min-vh-100 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <div className={`card shadow p-4 ${theme === 'dark' ? 'bg-secondary text-white' : 'bg-white text-dark'}`} style={{ width: '100%', maxWidth: '400px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0">Login</h3>
                </div>

                <Formik
                    initialValues={{ email: '', password: '', rememberMe: false }}
                    onSubmit={handleLogin}
                    validationSchema={LoginSchema}
                >
                    <Form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <Field name="email" type="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <Field name="password" type="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="form-check">
                                <Field type="checkbox" name="rememberMe" className="form-check-input" id="rememberMe" />
                                <label htmlFor="rememberMe" className="form-check-label">Remember me</label>
                            </div>
                            <Link to="/forgot-password" className="small">Forgot password?</Link>
                        </div>

                        {loginError && <div className="text-danger mb-3">{loginError}</div>}

                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>

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