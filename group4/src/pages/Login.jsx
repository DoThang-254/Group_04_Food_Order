import React from 'react';
import {Formik , Form , Field , ErrorMessage } from 'formik'
const Login = () => {

    const handleLogin = (value) => {
        console.log(value);
    }

    return (
        <Formik
        initialValues = {{username: '' , password: ''}}
        onSubmit = {value => handleLogin(value)}
        >
            <Form>
                <div>
                    <label htmlFor="username">Username:</label>
                    <Field name="username"/>
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <Field name="password"/>
                </div>

                <button type='submit'>Login</button>
            </Form>
        </Formik>
    );
};

export default Login;