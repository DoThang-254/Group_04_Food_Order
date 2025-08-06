import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import * as Yup from "yup";
import { getStoreByOwnerId, postStore } from '../../services/stores';
import { decodeFakeToken } from '../../data/token';
import { loginContext } from '../../context/LoginContext';
import { updateUser } from '../../services/users';
const RegisterStore = () => {
    const RegisterStoreSchema = Yup.object().shape({
        storeName: Yup.string()
            .required('Required'),
        storeAddress: Yup.string()
            .required('Required'),
    });
    const [loading, setLoading] = useState(true);
    const [info, setinfo] = useState();
    const [msg, setMsg] = useState();
    const { token } = useContext(loginContext);
    useEffect(() => {
        const decode = async () => {
            const info = await decodeFakeToken(token);
            if (info) {
                setinfo(info);
            }
            setLoading(false);
        };
        decode();
    }, [token]);

    if (loading) return null;
    const handleRegisterStore = async (data) => {
        data.state = false;
        
        data.ownerId = info?.id;
        let newStore;
        try {
            const store = await getStoreByOwnerId(info?.id);
            if (!store) {
                newStore = await postStore(data);
            }
        } catch (error) {
            setMsg('Something went wrong')
            console.log(error)
        }

        try {
            if (newStore) {
                const check = await updateUser(info?.id, { role : 'owner' , storeId: newStore.id });
                if (check) {
                    setMsg('Send store request successfully!!!');
                }
                else {
                    setMsg('Please Login');
                }
            }
            else {
                setMsg('You owned a store');
            }

        } catch (error) {
            setMsg('Something went wrong')
            console.log(error)
        }
    }
    return (
        <div>
            <Formik
                initialValues={{ storeName: '', storeAddress: '' }}
                onSubmit={data => handleRegisterStore(data)}
                validationSchema={RegisterStoreSchema}
            >
                <Form>
                    <div className="mb-3">
                        <label htmlFor="storeName" className="form-label">Store Name</label>
                        <Field name="storeName" type="text" className="form-control" />
                        <ErrorMessage name="storeName" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="storeAddress" className="form-label">Store Address</label>
                        <Field name="storeAddress" type="text" className="form-control" />
                        <ErrorMessage name="storeAddress" component="div" className="text-danger" />
                    </div>

                    <div className="d-grid mb-3">
                        <button type="submit" className="btn btn-primary">Register Store</button>
                    </div>
                    {msg}
                </Form>
            </Formik>
        </div>
    );
};

export default RegisterStore;