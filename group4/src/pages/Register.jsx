import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { register } from '../services/users';
import * as Yup from "yup";
const Register = () => {
    const RegisterSchema = Yup.object().shape({
        password: Yup.string()
            .required('Required'),
        email: Yup.string()
            .email('Required email format!')
            .required('Required'),
    });
    const handleSignUp = (value) => {
        const data = {
            name: "Do Thang",
            email: value.email,
            password: value.password,
            role: "customer",
            active: true
        }
        register(data).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        }

        )
    }

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={value => handleSignUp(value)}
            validationSchema={RegisterSchema}
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

                <button type='submit'>Sign Up</button>
            </Form>
        </Formik>
    );
};

export default Register;