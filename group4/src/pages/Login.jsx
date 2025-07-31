import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { login } from '../services/users';
import * as Yup from "yup";
import { Link, useNavigate } from 'react-router-dom';
import { loginContext } from '../context/LoginContext';
const Login = () => {
    const LoginSchema = Yup.object().shape({
        password: Yup.string()
            .required('Required'),
        email: Yup.string()
            .email('Required email format!')
            .required('Required'),
    });


    const { setIsLogin } = useContext(loginContext)
    const [loginError, setLoginError] = useState('');
    const navToHome = useNavigate();
    const handleLogin = (value) => {
        const data = value
        login(data).then(res => {
            if (res) {
                if (!res.msg) {
                    setIsLogin(true);
                    navToHome('/home');
                }
                else {
                    setIsLogin(false);
                    setLoginError(res.msg);
                }

            }
            else {
                setIsLogin(false);
                setLoginError(res.msg);
            }
        }).catch(err => {
            console.log(err)
            setLoginError('Something went wrong.')
        }

        )
    }

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={value => handleLogin(value)}
            validationSchema={LoginSchema}
        >
            <Form>
                <div>
                    <label htmlFor="email">Email:</label>
                    <Field name="email" />
                    <ErrorMessage name="email" component={'div'} className='text-danger' />

                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <Field name="password" />
                    <ErrorMessage name="password" type="password" component={'div'} className='text-danger' />
                </div>
                {loginError && <div className="text-danger">{loginError}</div>}
                <button type='submit'>Login</button>
                <div>
                    Don't have account , <Link to="/register">Sign Up Now</Link>
                </div>
            </Form>
        </Formik>
    );
};

export default Login;