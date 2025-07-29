import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { checkEmail, register } from '../services/users';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const RegisterSchema = Yup.object().shape({
        password: Yup.string()
            .required('Required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
        ,
        email: Yup.string()
            .email('Required email format!')
            .required('Required')
            .test(
                'checkUsernameUnique',
                'email already exists',
                async function (value) {
                    if (!value) return false;
                    const exists = await checkEmail(value);
                    return !exists;
                }
            ),
    });


    const navToHome = useNavigate();
    const handleSignUp = (value) => {
        const data = {
            name: `${value.firstname} ${value.lastname}`,
            email: value.email,
            password: value.password,
            role: "customer",
            active: true
        }
        register(data).then(res => {
            console.log(res)
            navToHome('/login');
        }).catch(err => {
            console.log(err)
        }

        )
    }

    return (
        <Formik
            initialValues={{
                email: '', password: '', firstname: '',
                lastname: ''
            }}
            onSubmit={value => handleSignUp(value)}
            validationSchema={RegisterSchema}
        >
            <Form>
                <div>
                    <label htmlFor="firstname">First Name:</label>
                    <Field name="firstname" />
                    <ErrorMessage name="firstname" component={'div'} className='text-danger' />
                </div>

                <div>
                    <label htmlFor="lastname">Last Name:</label>
                    <Field name="lastname" />
                    <ErrorMessage name="lastname" component={'div'} className='text-danger' />
                </div>

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