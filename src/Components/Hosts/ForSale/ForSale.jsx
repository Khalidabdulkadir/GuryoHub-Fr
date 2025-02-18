import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Navbar, Nav } from "react-bootstrap";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaSearch, FaBars } from "react-icons/fa"; // Import icons
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../HomeRealEstate.css"; // Custom CSS for the component
import AboutUs from "../../About Us/AboutUs";
import ContactUs from "../../../Contact Us/ContactUs";
import Footer from "../../Footer/Footer";

const ForSale = () => {
  const [propertyType, setPropertyType] = useState("Any");
  const [minPrice, setMinPrice] = useState("Any");
  const [maxPrice, setMaxPrice] = useState("Any");
  const [bedrooms, setBedrooms] = useState("Any");
  const [location, setLocation] = useState(""); // New state for location search
  const [properties, setProperties] = useState([]); // State to store fetched properties
  const [loading, setLoading] = useState(false); // State to handle loading state
  const navigate = useNavigate(); // Hook for navigation
   const [showNav, setShowNav] = useState(false);
  // Function to fetch properties based on filters
  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams({
        property_type: propertyType === "Any" ? "" : propertyType,
        min_price: minPrice === "Any" ? "" : minPrice,
        max_price: maxPrice === "Any" ? "" : maxPrice,
        bedrooms: bedrooms === "Any" ? "" : bedrooms,
        location: location, // Include location in the query
      }).toString();

      // Fetch properties from the API
      const response = await axios.get(
        `api.guryohub.com/hosts/for-sale/?${queryParams}`
      );
      setProperties(response.data); // Update properties state
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  
  // Toggle mobile navbar
  const toggleNav = () => {
    setShowNav(!showNav);
  };

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [propertyType, minPrice, maxPrice, bedrooms, location]);

  // Handle property click to navigate to property details
  const handlePropertyClick = (id) => {
    navigate(`/property/${id}`); // Navigate to the property details page
  };

  // Handle clear filters button click
  const handleClearFilters = () => {
    setPropertyType("Any");
    setMinPrice("Any");
    setMaxPrice("Any");
    setBedrooms("Any");
    setLocation(""); // Clear location search
  };

  return (
    <div className="home-real-estate">
      {/* Navbar */}
      <Navbar expand="lg" className="navbar">
  <Container fluid>
    {/* Logo Section */}
    <Navbar.Brand className="col-md-3 mb-2 mb-md-0">
      <Link to="/" className="d-inline-flex link-body-emphasis text-decoration-none navbar-logo">
      <h2>
          Guryo<span style={{ color: "orange" }}>Hub</span>
          </h2>
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
        <Link to="/land-for-sale" className="nav-link" onClick={() => setShowNav(false)}>
          Land
        </Link>
        <Link to="/rooms" className="nav-link px-2" onClick={() => setShowNav(false)}>
                       Hotels
                     </Link>
        <Link to="/to-rent" className="nav-link" onClick={() => setShowNav(false)}>
          To Rent
        </Link>
        {/* <Link to="/faqs" className="nav-link px-2" onClick={() => setShowNav(false)}>
          FAQs
        </Link> */}
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
      </div>
    </Navbar.Collapse>
  </Container>
</Navbar>
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Find Your Dream Property For sale</h1>
        <div className="search-container">
          {/* Location Search Bar */}
          <Form.Group className="search-bar">
            <Form.Control
              type="text"
              placeholder="Enter city or address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Button variant="primary" onClick={fetchProperties}>
              <FaSearch /> Search
            </Button>
          </Form.Group>

          {/* Filters */}
          <div className="search-filters">
            <Form.Group className="filter-group">
              <Form.Label>Property Type</Form.Label>
              <Form.Select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="Any">Any</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="Villa">Villa</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-group">
              <Form.Label>Min Price</Form.Label>
              <Form.Select
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              >
                <option value="Any">Any</option>
                <option value="20000000">Ksh20,000,000</option>
                <option value="30000000">Ksh30,000,000</option>
                <option value="40000000">Ksh40,000,000</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-group">
              <Form.Label>Max Price</Form.Label>
              <Form.Select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >
                <option value="Any">Any</option>
                
                <option value="50000000">Ksh50,000,000</option>
                <option value="60000000">Ksh60,000,000</option>
                <option value="70000000">Ksh70,000,000</option>
                <option value="80000000">Ksh80,000,000</option>
                <option value="90000000">Ksh90,000,000</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-group">
              <Form.Label>Bedrooms</Form.Label>
              <Form.Select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option value="Any">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </Form.Select>
            </Form.Group>
          </div>

          {/* Clear Filters Button */}
          <div className="clear-filters">
            <Button variant="secondary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Display Listings */}
      <Container className="mt-5">
        {loading ? (
          <h2 className="text-center">Loading properties...</h2>
        ) : (
          <Row>
            {properties.map((property) => (
              <Col key={property.id} md={4} className="mb-4">
                <Card
                  onClick={() => handlePropertyClick(property.id)} // Navigate to property details
                  className="listing-card"
                >
                  {property.image && (
                    <Card.Img
                      variant="top"
                      src={property.image}
                      alt={property.title}
                      style={{ height: "150px", objectFit: "cover" }} // Smaller image height
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{property.title}</Card.Title>
                    <Card.Text>
                      <strong>KSh {property.price}</strong>
                    </Card.Text>
                    <Card.Text>
                      <FaMapMarkerAlt />{" "}
                      {property.location && property.location.address
                        ? `${property.location.address}, ${property.location.city}, ${property.location.country}`
                        : "N/A"}
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      <div>
                        <FaBed /> {property.bedrooms} Beds
                      </div>
                      <div>
                        <FaBath /> {property.bathrooms} Baths
                      </div>
                      <div>
                        <FaRulerCombined /> {property.square_meters} m²
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <AboutUs/>
      <ContactUs/>
      <Footer />
    </div>
  );
};

export default ForSale;