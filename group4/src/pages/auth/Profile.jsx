import React, { useContext, useEffect, useState } from 'react';
import { loginContext } from '../../context/LoginContext';
import { decodeFakeToken } from '../../data/token';
import { Button, Card, Col, Container, Form, Image, Row, Spinner } from 'react-bootstrap';
import { saveRequest, updateUser } from '../../services/users';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState();
    const { token } = useContext(loginContext);
    const [editMode, setEditMode] = useState(false);
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
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="shadow-sm p-3">
                        <div className="text-center mb-3">
                            <Image
                                src={user.picture || 'data:image/jpeg;base64,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'}
                                roundedCircle
                                width={100}
                                height={100}
                                alt="Avatar"
                            />
                        </div>
                        <Card.Body>

                            <Card.Text>
                                <strong>Full name:</strong><br />
                                {editMode ? (
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={user.name || ''}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    user.name || 'No Name'
                                )}<br /> <br />
                                <strong>Email:</strong><br />
                                {editMode ? (
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={user.email || ''}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    user.email || 'N/A'
                                )}
                                <br /><br />
                                <strong>Password:</strong><br />
                                <button onClick={async () => {
                                    await saveRequest(user.email);
                                    nav("/reset-password")
                                }}>Change Password</button>
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