import React, { useContext, useEffect, useState } from 'react';
import { loginContext } from '../../context/LoginContext';
import { decodeFakeToken } from '../../data/token';
import { Button, Card, Col, Container, Form, Image, Row, Spinner } from 'react-bootstrap';
import { saveRequest, updateUser } from '../../services/users';
import { useNavigate } from 'react-router-dom';
import { themeContext } from '../../context/ThemeContext';

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

    const handleChange = (e) => {
        setUser(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSave = async () => {
        setUser(user);
        setEditMode(false);
        await updateUser(user.id, user);
    };

    const handleCancel = () => {
        setUser(user);
        setEditMode(false);
    };

    return (
        <Container className="mt-5" data-bs-theme={theme}
            style={{
                backgroundColor: theme === 'dark' ? '#000' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
                minHeight: '100vh',
                padding: '2rem',
            }}>
            <Row className="justify-content-center">
                <Col md={6} >
                    <Card className="shadow-sm p-3 bg-body text-body" >
                        <div className="text-center mb-3">
                            <Image
                                src={user.picture || '...'}
                                roundedCircle
                                width={100}
                                height={100}
                                alt="Avatar"
                            />
                        </div>
                        <Card.Body>
                            <Card.Text style={{
                                color: theme === 'dark' ? '#fff' : '#000'
                            }}>
                                <strong>Full name:</strong><br />
                                {editMode ? (
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={user.name || ''}
                                        onChange={handleChange}
                                        className="bg-body text-body"
                                    />
                                ) : (
                                    user.name || 'No Name'
                                )}
                                <br /><br />

                                <strong>Email:</strong><br />
                                {editMode ? (
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={user.email || ''}
                                        onChange={handleChange}
                                        className="bg-body text-body"
                                    />
                                ) : (
                                    user.email || 'N/A'
                                )}
                                <br /><br />

                                <strong>Password:</strong><br />
                                <Button variant="warning" onClick={async () => {
                                    await saveRequest(user.email);
                                    nav("/reset-password")
                                }}>
                                    Change Password
                                </Button>
                                <br /><br />

                                <strong>Role:</strong><br />
                                {user.role || 'customer'}
                                <br /><br />

                                <strong>Phone:</strong><br />
                                {editMode ? (
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        value={user.phone || ''}
                                        onChange={handleChange}
                                        className="bg-body text-body"
                                    />
                                ) : (
                                    user.phone || 'N/A'
                                )}
                                <br /><br />

                                <strong>Gender:</strong><br />
                                {editMode ? (
                                    <>
                                        <Form.Check
                                            type="radio"
                                            label="Male"
                                            name="gender"
                                            value="Male"
                                            checked={user.gender === 'Male'}
                                            onChange={handleChange}
                                            inline
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Female"
                                            name="gender"
                                            value="Female"
                                            checked={user.gender === 'Female'}
                                            onChange={handleChange}
                                            inline
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Other"
                                            name="gender"
                                            value="Other"
                                            checked={user.gender === 'Other'}
                                            onChange={handleChange}
                                            inline
                                        />
                                    </>
                                ) : (
                                    user.gender || 'N/A'
                                )}
                                <br /><br />

                                <strong>Birth Date:</strong><br />
                                {editMode ? (
                                    <Form.Control
                                        type="date"
                                        name="birthDate"
                                        value={user.birthDate || ''}
                                        onChange={handleChange}
                                        className="bg-body text-body"
                                    />
                                ) : (
                                    user.birthDate || 'N/A'
                                )}
                                <br /><br />

                                <strong>Address:</strong><br />
                                {editMode ? (
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={user.address || ''}
                                        onChange={handleChange}
                                        className="bg-body text-body"
                                    />
                                ) : (
                                    user.address || 'N/A'
                                )}
                            </Card.Text>

                            <div className="text-center">
                                {editMode ? (
                                    <>
                                        <Button variant="success" className="me-2" onClick={handleSave}>
                                            Save
                                        </Button>
                                        <Button variant="secondary" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="primary" onClick={() => setEditMode(true)}>
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );

};

export default Profile;