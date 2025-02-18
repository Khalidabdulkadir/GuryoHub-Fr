import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Button, Card, Navbar, Nav } from "react-bootstrap";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMoneyBillAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from "react-icons/fa"; // Import icons
import "./RoomDetails.css"; // Custom CSS for room details
import Footer from "../../Footer/Footer";

const RoomDetails = () => {
  const { id } = useParams(); // Get the room ID from the URL
  const [room, setRoom] = useState(null); // State to store room details
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // Hook for navigation
  const [showNav, setShowNav] = useState(false); // State to handle navbar toggle

  // Fetch room details from the API
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`api.guryohub.com/hosts/rooms/${id}/`);
        setRoom(response.data); // Set the fetched data to state
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching room details:", error);
        setError("Failed to fetch room details. Please try again later."); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchRoom();
  }, [id]);

  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${room.contact_phone}`, "_blank");
  };

  // Handle phone call click
  const handlePhoneClick = () => {
    window.location.href = `tel:${room.contact_phone}`;
  };

  // Toggle navbar visibility
  const toggleNav = () => {
    setShowNav(!showNav);
  };

  // Display loading state
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <h2>Loading room details...</h2>
      </Container>
    );
  }

  // Display error state
  if (error) {
    return (
      <Container className="mt-5 text-center">
        <h2>Error</h2>
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <div className="room-details-container">
      {/* Navbar */}
      <Navbar expand="lg" className="navbar">
        <Container fluid>
          {/* Logo Section */}
          <Navbar.Brand className="col-md-3 mb-2 mb-md-0">
            <Link to="/" className="d-inline-flex link-body-emphasis text-decoration-none navbar-logo">
              <h2>Guryo<span style={{ color: "orange" }}>Hub</span></h2>
            </Link>
          </Navbar.Brand>

          {/* Toggle Button for Mobile */}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={toggleNav}
            className="navbar-toggle"
          >
            <FaBars />
          </Navbar.Toggle>

          {/* Navigation Links and Buttons */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`navbar-collapse ${showNav ? "show" : ""}`}
          >
            {/* Navigation Links */}
            <Nav className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
              <Link to="/for-sale" className="nav-link px-2" onClick={() => setShowNav(false)}>
                For Sale
              </Link>
              <Link to="/to-rent" className="nav-link" onClick={() => setShowNav(false)}>
                To Rent
              </Link>
              <Link
                to="#about-us"
                className="nav-link px-2"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor behavior
                  setShowNav(false); // Close the mobile navbar (if applicable)
                  document.getElementById("about-us").scrollIntoView({ behavior: "smooth" }); // Smooth scroll
                }}
              >
                About
              </Link>
              <Link
                to="#contact-us"
                className="nav-link px-2"
                onClick={(e) => {
                  e.preventDefault(); 
                  setShowNav(false);
                  document.getElementById("contact-us").scrollIntoView({ behavior: "smooth" }); // Smooth scroll
                }}
              >
                Contact Us
              </Link>
            </Nav>

            {/* Buttons (Login/Sign-up) */}
            <div className="col-md-3 text-end">
              <Link to="/login">
                <Button variant="outline-primary" className="me-2">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Sign-up</Button>
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="mt-4">
        {/* Back Button */}
        <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
          Back
        </Button>

        {/* Room Price and Basic Info */}
        <Row className="mb-4">
          <Col>
            <h2 className="room-price text-primary">KSh {room.price}</h2>
            <h4 className="room-title">
              {room.name}
            </h4>
            <p className="room-location">
              <FaMapMarkerAlt /> {room.location}
            </p>
          </Col>
        </Row>

        {/* Room Image */}
        <div className="position-relative mb-4">
          <div className="image-carousel">
            <img
              src={room.photo}
              alt={`Room Image`}
              className="room-image"
            />
          </div>
        </div>

        {/* Room Details */}
        <Row className="mb-4">
          <Col md={8}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title className="room-title">Room Details</Card.Title>
                <Card.Text>
                  <strong>Description:</strong> {room.description}
                </Card.Text>
                <Card.Text>
                  <strong>Availability:</strong> {room.is_available ? "Available" : "Not Available"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col md={4}>
            <Card className="contact-card mb-4">
              <Card.Body>
                <Card.Title>Contact Agent</Card.Title>
                <Card.Text>
                  <strong>Phone:</strong> {room.contact_phone}
                </Card.Text>
                <div className="contact-buttons">
                  <Button
                    variant="primary"
                    className="w-100 mb-2"
                    onClick={handlePhoneClick}
                  >
                    <FaPhone /> Contact via Phone
                  </Button>
                  <Button
                    variant="success"
                    className="w-100 mb-2"
                    onClick={handleWhatsAppClick}
                  >
                    <FaWhatsapp /> Contact via WhatsApp
                  </Button>
                  <Button variant="info" className="w-100 mb-2">
                    <FaEnvelope /> Contact via Email
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer/>
    </div>
  );
};

export default RoomDetails;