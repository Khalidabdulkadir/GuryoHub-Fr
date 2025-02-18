import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../Redux/authSlice'; // Adjust the import path

const CreateHotelWithUser = () => {
    const navigate = useNavigate();
    const [hotel, setHotel] = useState({ name: '', location: '', contact_email: '', contact_phone: '' });
    const [user, setUser] = useState({ first_name: '', last_name: '', email: '', password: '', password_confirm: '', role: 'admin' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth.value); // Get authentication state from Redux

    // Check if the user is authenticated
    useEffect(() => {
        const token = getCookie('token'); // Get the token from cookies
        if (!token) {
            dispatch(setAuth(false)); // Set authentication state to false
            navigate('/login'); // Redirect to login page
        }
    }, [dispatch, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate required fields
        if (!hotel.name || !hotel.location || !hotel.contact_email) {
            setError('Please fill all required hotel fields');
            return;
        }

        if (user.password !== user.password_confirm) {
            setError('Passwords do not match!');
            return;
        }

        setLoading(true);

        try {
            const token = getCookie('token'); // Get the token from cookies
            if (!token) {
                dispatch(setAuth(false)); // Set authentication state to false
                navigate('/login'); // Redirect to login page
                return;
            }

            // Create Hotel
            const hotelRes = await axios.post('api.guryohub.com/hosts/hotels/', hotel, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Create User
            const userRes = await axios.post('api.guryohub.com/users/register', {
                ...user,
                branch: hotelRes.data.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Link User to Hotel
            await axios.patch(`api.guryohub.com/hosts/hotels/${hotelRes.data.id}/`, {
                assigned_user: userRes.data.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowSuccess(true); // Show success modal
            
        } catch (err) {
            if (err.response?.status === 401) {
                // Token is invalid or expired
                dispatch(setAuth(false)); // Set authentication state to false
                navigate('/login'); // Redirect to login
            } else {
                setError(err.response?.data?.message || 'Creation failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInput = (setter) => (e) => {
        setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Helper function to get cookie value
    const getCookie = (name) => {
        const cookieName = name + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return '';
    };

    return (
        <div className="container py-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <h3 className="mb-4 text-center">New Hotel Setup</h3>
                    
                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            {/* Hotel Column */}
                            <Col md={6} className="pe-md-3">
                                <h5 className="mb-3 text-primary">Hotel Details</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hotel Name *</Form.Label>
                                    <Form.Control
                                        name="name"
                                        value={hotel.name}
                                        onChange={handleInput(setHotel)}
                                        required
                                        size="sm"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Location *</Form.Label>
                                    <Form.Control
                                        name="location"
                                        value={hotel.location}
                                        onChange={handleInput(setHotel)}
                                        required
                                        size="sm"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="contact_email"
                                        value={hotel.contact_email}
                                        onChange={handleInput(setHotel)}
                                        required
                                        size="sm"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        name="contact_phone"
                                        value={hotel.contact_phone}
                                        onChange={handleInput(setHotel)}
                                        size="sm"
                                    />
                                </Form.Group>
                            </Col>
                            {/* User Column */}
                            <Col md={6} className="ps-md-3">
                                <h5 className="mb-3 text-primary">Admin Details</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name *</Form.Label>
                                    <Form.Control
                                        name="first_name"
                                        value={user.first_name}
                                        onChange={handleInput(setUser)}
                                        required
                                        size="sm"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name *</Form.Label>
                                    <Form.Control
                                        name="last_name"
                                        value={user.last_name}
                                        onChange={handleInput(setUser)}
                                        required
                                        size="sm"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleInput(setUser)}
                                        required
                                        size="sm"
                                    />
                                </Form.Group>
                                <Row className="g-2 mb-3">
                                    <Col md={6}>
                                        <Form.Label>Password *</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={user.password}
                                            onChange={handleInput(setUser)}
                                            required
                                            size="sm"
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Confirm *</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password_confirm"
                                            value={user.password_confirm}
                                            onChange={handleInput(setUser)}
                                            required
                                            size="sm"
                                        />
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Role *</Form.Label>
                                    <Form.Select
                                        name="role"
                                        value={user.role}
                                        onChange={handleInput(setUser)}
                                        size="sm"
                                    >
                                        <option value="accountant">Hotel Admin</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="text-center mt-4">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                                className="px-5"
                            >
                                {loading ? (
                                    <Spinner animation="border" size="sm" />
                                ) : 'Create'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {/* Success Modal */}
            <Modal show={showSuccess} onHide={() => navigate('/hotels')} centered>
                <Modal.Body className="text-center p-5">
                    <div className="text-success mb-3" style={{ fontSize: '3rem' }}>✓</div>
                    <h4 className="mb-3">Setup Complete!</h4>
                    <p className="text-muted">
                        Hotel and admin account created successfully.
                    </p>
                    <Button 
                        variant="outline-success" 
                        onClick={() => navigate('/hotel')}
                        className="px-5"
                    >
                        View Hotels
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CreateHotelWithUser;