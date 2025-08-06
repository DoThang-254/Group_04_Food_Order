import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from "yup";
const RegisterStore = () => {
    const RegisterStoreSchema = Yup.object().shape({
        password: Yup.string()
            .required('Required'),
        email: Yup.string()
            .email('Required email format!')
            .required('Required'),
    });

    const handleRegisterStore = async (value) => {
        const data = value
        console.log(data);
    }
    return (
        <div>
            <Formik
                initialValues={{ storeName: '', storeAddress: '' }}
                onSubmit={handleRegisterStore}
                validationSchema={RegisterStoreSchema}
            >
                <Form>
                    <div className="mb-3">
                        <label htmlFor="storeName" className="form-label">Email</label>
                        <Field name="storeName" type="email" className="form-control" />
                        <ErrorMessage name="storeName" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="storeAddress" className="form-label">Password</label>
                        <Field name="storeAddress" type="text" className="form-control" />
                        <ErrorMessage name="storeAddress" component="div" className="text-danger" />
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default RegisterStore;