import React, { useContext, useEffect, useState } from 'react';
import { loginContext } from '../../context/LoginContext';
import { decodeFakeToken } from '../../data/token';
import { Button, Card, Col, Container, Form, Image, Row, Spinner } from 'react-bootstrap';
import { checkEmail, saveRequest, updateUser } from '../../services/users';
import { useNavigate } from 'react-router-dom';
import { themeContext } from '../../context/ThemeContext';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState();
    const { token } = useContext(loginContext);
    const [editMode, setEditMode] = useState(false);
    const { theme } = useContext(themeContext);
    const nav = useNavigate();

    useEffect(() => {
        const decode = async () => {
            const info = await decodeFakeToken(token);
            const { iat, exp, ...userWithoutTokenMeta } = info;
            if (userWithoutTokenMeta) {
                setUser(userWithoutTokenMeta);
            }
            setLoading(false);
        };
        decode();
    }, [token]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" />
            </div>
        );
    }

    const originalEmail = user.email;

    const validationSchema = Yup.object({
        name: Yup.string().required('Full name is required'),
        email: Yup.string()
            .email('Invalid email')
            .required('Email is required')
            .test(
                'unique-email',
                'Email already exists',
                async function (value) {
                    if (!value) return false;

                    if (value === originalEmail) return true;

                    const isUnique = await checkEmail(value);
                    return isUnique.length === 0;
                }
            ),
        phone: Yup.string()
            .matches(/^[0-9]+$/, 'Phone must be numeric')
            .min(10, 'Phone must be at least 10 digits')
            .max(11, 'Phone must be at most 11 digits')
            .required('Phone is required'),
        birthDate: Yup.date().nullable(),
        address: Yup.string().nullable()
    });

    const handleSave = async (values) => {
        await updateUser(user.id, values);
        setUser(values);
        setEditMode(false);
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    return (
        <Container
            className="mt-5"
            data-bs-theme={theme}
            style={{
                backgroundColor: theme === 'dark' ? '#000' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
                minHeight: '100vh',
                padding: '2rem',
            }}
        >
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="shadow-sm p-3 bg-body text-body">

                        <Card.Body>
                            {editMode ? (
                                <Formik
                                    enableReinitialize
                                    initialValues={user}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSave}
                                >
                                    {({ handleSubmit }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <Card.Text>
                                                <strong>Full name:</strong><br />
                                                <Field name="name" type="text" className="form-control bg-body text-body" />
                                                <ErrorMessage name="name" component="div" className="text-danger" />
                                                <br /><br />

                                                <strong>Email:</strong><br />
                                                <Field name="email" type="email" className="form-control bg-body text-body" />
                                                <ErrorMessage name="email" component="div" className="text-danger" />
                                                <br /><br />

                                                <strong>Password:</strong><br />
                                                <Button
                                                    variant="warning"
                                                    onClick={async () => {
                                                        await saveRequest(user.email);
                                                        nav("/reset-password");
                                                    }}
                                                >
                                                    Change Password
                                                </Button>
                                                <br /><br />

                                                <strong>Role:</strong><br />
                                                {user.role || 'customer'}
                                                <br /><br />

                                                <strong>Phone:</strong><br />
                                                <Field name="phone" type="text" className="form-control bg-body text-body" />
                                                <ErrorMessage name="phone" component="div" className="text-danger" />
                                                <br /><br />

                                                <strong>Gender:</strong><br />
                                                <div>
                                                    <label className="me-2">
                                                        <Field type="radio" name="gender" value="Male" /> Male
                                                    </label>
                                                    <label className="me-2">
                                                        <Field type="radio" name="gender" value="Female" /> Female
                                                    </label>
                                                    <label>
                                                        <Field type="radio" name="gender" value="Other" /> Other
                                                    </label>
                                                </div>
                                                <br /><br />

                                                <strong>Birth Date:</strong><br />
                                                <Field name="birthDate" type="date" className="form-control bg-body text-body" />
                                                <ErrorMessage name="birthDate" component="div" className="text-danger" />
                                                <br /><br />

                                                <strong>Address:</strong><br />
                                                <Field name="address" type="text" className="form-control bg-body text-body" />
                                                <ErrorMessage name="address" component="div" className="text-danger" />
                                            </Card.Text>

                                            <div className="text-center mt-3">
                                                <Button type="submit" variant="success" className="me-2">
                                                    Save
                                                </Button>
                                                <Button variant="secondary" onClick={handleCancel}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            ) : (
                                <>
                                    <Card.Text>
                                        <strong>Full name:</strong><br /> {user.name || 'No Name'}<br /><br />
                                        <strong>Email:</strong><br /> {user.email || 'N/A'}<br /><br />
                                        <strong>Password:</strong><br />
                                        <Button
                                            variant="warning"
                                            onClick={async () => {
                                                await saveRequest(user.email);
                                                nav("/reset-password");
                                            }}
                                        >
                                            Change Password
                                        </Button>
                                        <br /><br />
                                        <strong>Role:</strong><br /> {user.role || 'customer'}<br /><br />
                                        <strong>Phone:</strong><br /> {user.phone || 'N/A'}<br /><br />
                                        <strong>Gender:</strong><br /> {user.gender || 'N/A'}<br /><br />
                                        <strong>Birth Date:</strong><br /> {user.birthDate || 'N/A'}<br /><br />
                                        <strong>Address:</strong><br /> {user.address || 'N/A'}
                                    </Card.Text>

                                    <div className="text-center">
                                        <Button variant="primary" onClick={() => setEditMode(true)}>
                                            Edit Profile
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
