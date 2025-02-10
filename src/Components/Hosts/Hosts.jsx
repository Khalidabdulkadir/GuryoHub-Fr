import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // For redirecting unauthenticated users
import { setAuth } from '../../Redux/authSlice';

const Hosts = () => {
  const [hosts, setHosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentHost, setCurrentHost] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    whats_app: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.value); // Get authentication state from Redux
  const navigate = useNavigate(); // For redirecting unauthenticated users

  const API_URL = 'http://192.168.0.110:8000/hosts/hosts/';

  // Fetch all hosts
  const fetchHosts = async () => {
    try {
      const token = getCookie('token'); // Get the token from cookies
      if (!token) {
        dispatch(setAuth(false)); // Set authentication state to false
        navigate('/login'); // Redirect to login page
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Add token to headers
      const response = await axios.get(API_URL);
      setHosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hosts:', error);
      setError('Failed to fetch hosts. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) {
      fetchHosts(); // Fetch hosts only if authenticated
    } else {
      navigate('/login'); // Redirect to login page if not authenticated
    }
  }, [auth, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentHost({ ...currentHost, [name]: value });
  };

  // Open modal for creating or editing a host
  const handleShowModal = (host = null) => {
    if (host) {
      setCurrentHost(host);
      setEditMode(true);
    } else {
      setCurrentHost({
        id: null,
        name: '',
        email: '',
        phone: '',
        whats_app: '',
      });
      setEditMode(false);
    }
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Create or update a host
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getCookie('token'); // Get the token from cookies
      if (!token) {
        dispatch(setAuth(false)); // Set authentication state to false
        navigate('/login'); // Redirect to login page
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Add token to headers

      if (editMode) {
        await axios.put(`${API_URL}${currentHost.id}/`, currentHost);
      } else {
        const { id, ...newHost } = currentHost; // Remove the id field
        await axios.post(API_URL, newHost);
      }
      fetchHosts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving host:', error);
      setError('Failed to save host. Please try again later.');
    }
  };

  // Delete a host
  const handleDelete = async (id) => {
    try {
      const token = getCookie('token'); // Get the token from cookies
      if (!token) {
        dispatch(setAuth(false)); // Set authentication state to false
        navigate('/login'); // Redirect to login page
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Add token to headers
      await axios.delete(`${API_URL}${id}/`);
      fetchHosts();
    } catch (error) {
      console.error('Error deleting host:', error);
      setError('Failed to delete host. Please try again later.');
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
  if (loading) {
    return <div className="container mt-4">Loading hosts...</div>;
  }

  // Display error state
  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Hosts</h2>
      <Button variant="primary" onClick={() => handleShowModal()}>
        Add Host
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>WhatsApp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map((host) => (
            <tr key={host.id}>
              <td>{host.name}</td>
              <td>{host.email}</td>
              <td>{host.phone}</td>
              <td>{host.whats_app}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal(host)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(host.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for creating/editing hosts */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Host' : 'Add Host'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentHost.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentHost.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={currentHost.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>WhatsApp</Form.Label>
              <Form.Control
                type="text"
                name="whats_app"
                value={currentHost.whats_app}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editMode ? 'Update' : 'Save'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Hosts;