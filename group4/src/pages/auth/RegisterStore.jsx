import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import * as Yup from "yup";
import { getStoreByOwnerId, postStore } from '../../services/stores';
import { decodeFakeToken } from '../../data/token';
import { loginContext } from '../../context/LoginContext';
import { updateUser } from '../../services/users';
import '../customerstyle/RegisterStore.css';
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
    <div className="register-store-container">
        <h2 className="register-store-title">Đăng Ký Cửa Hàng</h2>
        <Formik
            initialValues={{ storeName: '', storeAddress: '' }}
            onSubmit={data => handleRegisterStore(data)}
            validationSchema={RegisterStoreSchema}
        >
            <Form>
                <div className="mb-3">
                    <label htmlFor="storeName" className="form-label">Tên Cửa Hàng</label>
                    <Field name="storeName" type="text" className="form-control" />
                    <ErrorMessage name="storeName" component="div" className="text-danger" />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="storeAddress" className="form-label">Địa Chỉ Cửa Hàng</label>
                    <Field name="storeAddress" type="text" className="form-control" />
                    <ErrorMessage name="storeAddress" component="div" className="text-danger" />
                </div>
                
                <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary">
                        Đăng Ký Cửa Hàng
                    </button>
                </div>
                {msg && <div className="message">{msg}</div>}
            </Form>
        </Formik>
    </div>
);
};

export default RegisterStore;