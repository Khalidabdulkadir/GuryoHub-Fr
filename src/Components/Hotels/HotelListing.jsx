import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // For redirecting unauthenticated users
import { setAuth } from '../../Redux/authSlice';

const HotelsList = ({ onHotelSelect }) => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [hotelDetails, setHotelDetails] = useState({
        name: '',
        location: '',
        contact_phone: ''
    });

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth.value); // Get authentication state from Redux
    const navigate = useNavigate(); // For redirecting unauthenticated users

    // Fetch all hotels
    const fetchHotels = async () => {
        try {
            const token = getCookie('token'); // Get the token from cookies
            if (!token) {
                dispatch(setAuth(false)); // Set authentication state to false
                navigate('/login'); // Redirect to login page
                return;
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Add token to headers
            const response = await axios.get('http://192.168.0.110:8000/hosts/hotels/');
            setHotels(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch hotels');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth) {
            fetchHotels(); // Fetch hotels only if authenticated
        } else {
            navigate('/login'); // Redirect to login page if not authenticated
        }
    }, [auth, navigate]);

    // Handle delete hotel
    const handleDelete = async (hotelId) => {
        try {
            const token = getCookie('token'); // Get the token from cookies
            if (!token) {
                dispatch(setAuth(false)); // Set authentication state to false
                navigate('/login'); // Redirect to login page
                return;
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Add token to headers
            await axios.delete(`http://192.168.0.110:8000/hosts/hotels/${hotelId}/`);
            setHotels(hotels.filter(hotel => hotel.id !== hotelId));
            setShowDeleteModal(false);
        } catch (err) {
            setError('Failed to delete hotel');
            setShowDeleteModal(false);
        }
    };

    // Handle edit hotel changes
    const handleEditChange = (e) => {
        setHotelDetails({
            ...hotelDetails,
            [e.target.name]: e.target.value
        });
    };

    // Save edited hotel details
    const handleSaveEdit = async () => {
        try {
            const token = getCookie('token'); // Get the token from cookies
            if (!token) {
                dispatch(setAuth(false)); // Set authentication state to false
                navigate('/login'); // Redirect to login page
                return;
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Add token to headers
            const response = await axios.put(`http://192.168.0.110:8000/hosts/hotels/${selectedHotel.id}/`, hotelDetails);
            const updatedHotels = hotels.map(hotel => 
                hotel.id === selectedHotel.id ? response.data : hotel
            );
            setHotels(updatedHotels);
            setShowEditModal(false);
        } catch (err) {
            setError('Failed to update hotel');
        }
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

    // Display loading state
    if (loading) return <div className="text-center my-5">Loading hotels...</div>;

    // Display error state
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Available Hotels</h2>
            <div className="row">
                {hotels.map((hotel) => (
                    <div key={hotel.id} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{hotel.name}</h5>
                                <p className="card-text">Location: {hotel.location}</p>
                                <p className="card-text">Contact: {hotel.contact_phone}</p>
                                <button
                                    className="btn btn-danger btn-sm ms-2"
                                    onClick={() => { setSelectedHotel(hotel); setShowDeleteModal(true); }}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-warning btn-sm ms-2"
                                    onClick={() => { setSelectedHotel(hotel); setHotelDetails({ name: hotel.name, location: hotel.location, contact_phone: hotel.contact_phone }); setShowEditModal(true); }}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this hotel?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(selectedHotel.id)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Hotel Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Hotel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Hotel Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name"
                                value={hotelDetails.name} 
                                onChange={handleEditChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="location"
                                value={hotelDetails.location} 
                                onChange={handleEditChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contact Phone</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="contact_phone"
                                value={hotelDetails.contact_phone} 
                                onChange={handleEditChange} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HotelsList;