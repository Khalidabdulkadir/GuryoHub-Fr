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
import "./PropertyDetails.css"; // Custom CSS for property details
import Footer from "../../Footer/Footer";

const PropertyDetails = () => {
  const { id } = useParams(); // Get the property ID from the URL
  const [property, setProperty] = useState(null); // State to store property details
  const [images, setImages] = useState([]); // State to store property images
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track the current image index
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // Hook for navigation
  const [showNav, setShowNav] = useState(false); // State to handle navbar toggle

  // Fetch property details from the API
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://192.168.0.110:8000/hosts/properties/${id}/`);
        setProperty(response.data); // Set the fetched data to state
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching property details:", error);
        setError("Failed to fetch property details. Please try again later."); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchProperty();
  }, [id]);

  // Fetch property images from the API
  useEffect(() => {
    const fetchPropertyImages = async () => {
      try {
        const response = await axios.get(`http://192.168.0.110:8000/hosts/property-images/?property_id=${id}`);
        setImages([{ id: 0, image: property.image }, ...response.data]); // Include the first image
      } catch (error) {
        console.error("Error fetching property images:", error);
      }
    };

    if (property) {
      fetchPropertyImages();
    }
  }, [id, property]);

  // Handle navigation to the previous image
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Handle navigation to the next image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${property.host.phone}`, "_blank");
  };

  // Handle phone call click
  const handlePhoneClick = () => {
    window.location.href = `tel:${property.host.phone}`;
  };

  // Extract YouTube video ID from the URL
  const extractYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Toggle navbar visibility
  const toggleNav = () => {
    setShowNav(!showNav);
  };

  // Display loading state
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <h2>Loading property details...</h2>
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
    <div className="property-details-container">
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
            <FaBars className="text-white"/>
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

        {/* Breadcrumb */}
        {/* Property Price and Basic Info */}
        <Row className="mb-4">
          <Col>
            <h2 className="property-price text-primary">KSh {property.price}</h2>
            <h4 className="property-title">
              {property.bedrooms} Bedroom {property.property_type} for {property.listing_type} in {property.location.city}
            </h4>
            <p className="property-location">
              <FaMapMarkerAlt /> {property.location.address}, {property.location.city}, {property.location.country}
            </p>
          </Col>
        </Row>

        {/* Images Section */}
        <div className="position-relative mb-4">
          <div className="image-carousel">
            <img
              src={images[currentImageIndex]?.image}
              alt={`Property Image ${currentImageIndex}`}
              className="property-image"
            />
            <Button
              variant="light"
              className="carousel-control-prev"
              onClick={handlePreviousImage}
            >
              <FaChevronLeft />
            </Button>
            <Button
              variant="light"
              className="carousel-control-next"
              onClick={handleNextImage}
            >
              <FaChevronRight />
            </Button>
          </div>
        </div>

        {/* Property Details */}
        <Row className="mb-4">
          <Col md={8}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title className="property-title">Property Details</Card.Title>
                <Card.Text>
                  <FaBed /> <strong>Bedrooms:</strong> {property.bedrooms}
                </Card.Text>
                <Card.Text>
                  <FaBath /> <strong>Bathrooms:</strong> {property.bathrooms}
                </Card.Text>
                <Card.Text>
                  <FaRulerCombined /> <strong>Square Meters:</strong>{" "}
                  {property.square_meters} m²
                </Card.Text>
                <Card.Text>
                  <strong>Amenities:</strong>{" "}
                  {property.amenities.join(", ")}
                </Card.Text>
                <Card.Text>
                  <strong>Description:</strong> {property.description}
                </Card.Text>
              </Card.Body>
            </Card>

            {/* YouTube Video */}
            {property.you_tube_link && (
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title className="video-title">Property Video</Card.Title>
                  <div className="embed-responsive embed-responsive-16by9">
                    <iframe
                      className="embed-responsive-item"
                      src={`https://www.youtube.com/embed/${extractYouTubeVideoId(property.you_tube_link)}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Host Information */}
          <Col md={4}>
            <Card className="host-card mb-4">
              <Card.Body>
                <Card.Title>Contact Agent</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {property.host.name}
                </Card.Text>
                <Card.Text>
                  <strong>Phone:</strong> {property.host.phone}
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

export default PropertyDetails;