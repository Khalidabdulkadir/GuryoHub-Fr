import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const CreateRoom = () => {
    const [roomDetails, setRoomDetails] = useState({
        hotel: '',
        name: '',
        price: '',
        description: '',
        is_available: true,
        photo: null
    });
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Fetch hotels on component mount
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get('https://api.guryohub.com/hosts/hotels/');
                setHotels(response.data);
            } catch (err) {
                console.error('Error fetching hotels:', err);
                setError('Failed to load hotels list');
            }
        };
        fetchHotels();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setRoomDetails(prev => ({
            ...prev,
            photo: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate hotel is a number
        if (!roomDetails.hotel || isNaN(roomDetails.hotel)) {
            setError('Please select a valid hotel');
            return;
        }

        if (!roomDetails.name || !roomDetails.price) {
            setError('Please fill all required fields');
            return;
        }

        setLoading(true);
        
        try {
            const formData = new FormData();
            // Convert hotel ID to integer
            formData.append('hotel', parseInt(roomDetails.hotel));
            formData.append('name', roomDetails.name);
            formData.append('price', roomDetails.price);
            formData.append('description', roomDetails.description);
            formData.append('is_available', roomDetails.is_available);
            
            if (roomDetails.photo) {
                formData.append('photo', roomDetails.photo);
            }

            const response = await axios.post(
                'https://api.guryohub.com/hosts/rooms/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );

            setShowSuccess(true);
            setRoomDetails({
                hotel: '',
                name: '',
                price: '',
                description: '',
                is_available: true,
                photo: null
            });

        } catch (err) {
            setError(err.response?.data?.message || 
                   err.response?.data?.hotel?.[0] || 
                   'Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Create New Room</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Hotel *</Form.Label>
                            <Form.Select
                                name="hotel"
                                value={roomDetails.hotel}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a Hotel</option>
                                {hotels.map(hotel => (
                                    <option key={hotel.id} value={hotel.id}>
                                        {hotel.name} - {hotel.location}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Room Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={roomDetails.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price per Night (KSh) *</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={roomDetails.price}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={roomDetails.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Availability</Form.Label>
                            <Form.Check
                                type="switch"
                                id="availability-switch"
                                label="Available for booking"
                                checked={roomDetails.is_available}
                                onChange={(e) => setRoomDetails(prev => ({
                                    ...prev,
                                    is_available: e.target.checked
                                }))}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Room Photo</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
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
                        ) : 'Create Room'}
                    </Button>
                </div>
            </Form>

            {/* Success Modal */}
            <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
                <Modal.Body className="text-center p-4">
                    <div className="text-success mb-3" style={{ fontSize: '2.5rem' }}>✓</div>
                    <h4 className="mb-3">Room Created Successfully!</h4>
                    <Button 
                        variant="outline-success" 
                        onClick={() => setShowSuccess(false)}
                        className="px-5"
                    >
                        Close
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CreateRoom;