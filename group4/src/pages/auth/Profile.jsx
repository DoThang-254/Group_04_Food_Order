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
                                src={user.picture || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAACUCAMAAADF0xngAAAAY1BMVEXZ3OFwd3/c3+Rxd31weHtyd3tydn/f4ufZ3eDT1tttcnZsdnhpc3VweH3W2d5rcnvIzNDAxMh2foGjqKySmJ59g4u2ur59hIdobXGws7idoqaIjpGpr7SOk5d3f4ZkbnBgaHFQZIxaAAAEvUlEQVR4nO2c7ZabIBBA4yAS0AiKX1Hz8f5PWTW77Ta7JiAItsf7p82PnnMPyDAMQw+HnZ2dnZ2dnZ2dnZ2dnZ2dnZ1/CIBDmlJK0+mvmwSAZn1RnpIbC8qiz+gGRYHQtkSc82Bk+BPVrSAb8wRxYQwFX8GMXcSWNIHKE0Pob8vhN0OSbsaTiJIHP8NqQXzrfXBOwhnJAGF29q03QVqETrOWw7S3GxhNkA2ac3ysokZ6/zZBMvzGEjPfmqR6rfiYdlZ5nXQQsYolZl4DZ9rFswvnqybqqD9J6Ofi5DNJ720wQTBFyeDkb87JRd0yuXhaQCAwVrVEYehrMAumsMA/LVnhR1JcVR0nci+DCb3yVzmRnH1Yklp5vifC2oMl0JtKQP8DbjxEdlJpW3rYzUnB9CwRK9xbQv0mY/tO6dwSaK5teXX+YYJYYCmOri0zrG0ZZEfHmv+rZRQFGeyW9izdSi77Lp1nRcsikXNL7aiOTrWHdEN3hwzDOnUuSTpty85HTpTo5UQR95ATkbNmfhnxs4fMTTdXR3cf1WsI9b7LmHk5Q6pXNiaSwotlpVrK+rCsvBQ3RKllWQsfkodjqzOYvPVTJ9KqZmHsq5pFOuX1g5mHjefBkSpbIubvqg9kEqqFdq+XKVSt+h9wn9X/MctU2YBOJ79XuyRDCuEozDxfRUJ2fafJr85PZd8gombzcRNjzOotdBwAbZvZiIRw026k3YCI7uevE3HcbafFBCBr8ySJw98MinGS5G22qXYdOIiqyG8DSTzo3Zo7z4tKHLbkOAGEgKjOUrayP1di/OlbaQYY3EZgUxO9s/OvcJzwbfGOTUvCZyPrg/QImwtHhKSi6mXRlWU0bI7RtbsUss9ESlzX++cYAjk9F3UeDht5jKJorPNHiLEkCfO66OkG9iAAKuT1PjXanoIvZyCEpl+I30spUq9zD4TKLkymAZwhijDD3TCivjwBRJHHQ7r2xhKHcZwXwst4DjllcdPoeroVHnJNQlusWjIIpq4nhlvHPcIAErMhJVevWY8JfIKly8AEWfemzfZncNM5O/QCGQZS/xJytBw+EulmtYPo+HMHvSLjv+Kdi+M5yXL+IvK8h+Xr12NI9bENLiaMw5Xbn44gGwPBT9btYIe3LfRqjI3263lCq94X+gqEVqwNk9bGdD88m7VeV5D+Nvv2RNsSN+vc8EI1//RkgSaK17jxg8zaQD6Isf3dEg652nWEMiHLrZfkjh1Tvs5ThXeWMyToXxTPFxPbfV0BIjwtSzBeEp6sZh7Q2Qnnz/DSoiU5L8snFTQtRk1arzDdExa7yobtex3H8WxpqwUBqGZnuo5lbOvinBR6zS5aRNxO2gHCKDV/ZxlZauiQ61raSTVpvp7jCMotLHOobitbNhZSOFJbzti+a5q/AgHa2M8ynrgbrx8i7Wdsz3BpPJjd2o4DnaEjZHrPCZdh+ggRzg4kg9j0EeJ6icYXTN+dpvWKe/hvsGG/vbB8cJyxxEZ9rtqPHhdamm0/RGo2+C+0ZEYRU+MduwmIG72BJ/XqG8+Dq9Hus/72+ICbSKYu4tBkaRCKQDizNNgjIVvv9Pg3zKBKCNn8/zxkF2RgSdxZGoR1Urmy5K8tfwEW40if/AEG3wAAAABJRU5ErkJggg=='}
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