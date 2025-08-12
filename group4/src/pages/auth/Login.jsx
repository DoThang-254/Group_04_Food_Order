import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { login, loginByGoogle } from '../../services/users';
import * as Yup from "yup";
import { Link, useNavigate } from 'react-router-dom';
import { loginContext } from '../../context/LoginContext';
import { createFakeToken } from '../../data/token';
import { themeContext } from '../../context/ThemeContext';
import { getStoreByOwnerIdAndChecking } from '../../services/stores';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';
import '../auth/Login.css'
const Login = () => {
    const LoginSchema = Yup.object().shape({
        password: Yup.string()
            .required('Required'),
        email: Yup.string()
            .email('Required email format!')
            .required('Required'),
    });

    const { theme } = useContext(themeContext);
    const { setToken, setRemember } = useContext(loginContext)
    const [loginError, setLoginError] = useState('');
    const navToHome = useNavigate();
    const authorize = (role, state) => {
        switch (role) {
            case 'customer': {
                navToHome('/home');
                break;
            }
            case 'admin': {
                navToHome('/admin');
                break;
            }
            case 'owner': {
                if (state) {
                    navToHome('/owner-dashboard');
                }
                else {
                    navToHome('/home')
                }
                break;
            }
        }
    }
    const handleLogin = async (value) => {
        const data = value
        login(data).then(async (res) => {
            console.log(res);

            if (res) {
                if (!res.msg) {
                    const checkStore = await getStoreByOwnerIdAndChecking(res.user.id);
                    console.log(checkStore)
                    const fakeToken = await createFakeToken(res)
                    setRemember(data.rememberMe);
                    setToken(fakeToken);
                    if (data.rememberMe) {
                        localStorage.setItem("savedEmail", data.email);
                    } else {
                        localStorage.removeItem("savedEmail");
                    }
                    if (checkStore?.state) {
                        authorize(res.user.role, checkStore?.state);
                    }
                    else {
                        authorize(res.user.role, false)
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
        <div className={`login-bg d-flex justify-content-center align-items-center min-vh-100`}>
            <div className={`card shadow p-4 ${theme === 'dark' ? 'bg-secondary text-white' : 'bg-white text-dark'}`}
                style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 2 }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0">Login</h3>
                </div>

                <Formik
                    initialValues={{
                        email: localStorage.getItem("savedEmail") || ""
                        , password: ''
                        , rememberMe: localStorage.getItem("savedEmail") ? true : false
                    }}
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
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        // Giải mã thông tin Google
                                        const decoded = jwtDecode(credentialResponse.credential);
                                        console.log("Google user:", decoded);

                                        // Giả sử bạn có API backend để login/register user Google
                                        const res = await loginByGoogle({
                                            email: decoded.email,
                                            googleId: decoded.sub,
                                            name: decoded.name,
                                            avatar: decoded.picture,
                                            loginType: "google"
                                        });

                                        if (res && !res.msg) {
                                            const fakeToken = await createFakeToken(res);
                                            setRemember(true);
                                            setToken(fakeToken);
                                            localStorage.setItem("savedEmail", decoded.email);

                                            const checkStore = await getStoreByOwnerIdAndChecking(res.user.id);
                                            if (checkStore?.state) {
                                                authorize(res.user.role, checkStore?.state);
                                            } else {
                                                authorize(res.user.role, false);
                                            }
                                        } else {
                                            setLoginError(res.msg || "Google login failed");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        setLoginError("Google login failed");
                                    }
                                }}
                                onError={() => {
                                    console.log("Google Login Failed");
                                    setLoginError("Google login failed");
                                }}
                            />
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