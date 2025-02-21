import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Navbar, Nav, Pagination } from "react-bootstrap";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaSearch, FaBars } from "react-icons/fa"; // Import icons
import "./HomeRealEstate.css"; // Custom CSS for the component
import Footer from "../Footer/Footer";
import Categories from "../Categories/Categories";
import FaQsComponent from "../../Faqs/FaQsComponent";
import AboutUs from "../About Us/AboutUs";
import ContactUs from "../../Contact Us/ContactUs";
import Faqs from "../../Faqs/FaQsComponent";

const HomeRealEstate = () => {
  const [propertyType, setPropertyType] = useState("Any");
  const [minPrice, setMinPrice] = useState("Any");
  const [maxPrice, setMaxPrice] = useState("Any");
  const [bedrooms, setBedrooms] = useState("Any");
  const [location, setLocation] = useState(""); // New state for location search
  const [properties, setProperties] = useState([]); // State to store fetched properties
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [showNav, setShowNav] = useState(false); // State to toggle mobile navbar
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const navigate = useNavigate(); // Hook for navigation

  // Function to fetch properties based on filters and current page
  // Modified fetchProperties function
const fetchProperties = async (page = 1) => {
  setLoading(true);
  try {
    const response = await axios.get(`api.guryohub.com/hosts/to-rent/`, {
      params: {
        property_type: propertyType === "Any" ? undefined : propertyType,
        min_price: minPrice === "Any" ? undefined : minPrice,
        max_price: maxPrice === "Any" ? undefined : maxPrice,
        bedrooms: bedrooms === "Any" ? undefined : bedrooms,
        location: location || undefined,
        page: page
      }
    });

    setProperties(response.data.results);
    setTotalPages(Math.ceil(response.data.count / 12));
    setCurrentPage(page);
  } catch (error) {
    console.error("Error fetching properties:", error);
  } finally {
    setLoading(false);
  }
};

  // Fetch properties when filters or page changes
  useEffect(() => {
    fetchProperties(currentPage);
  }, [propertyType, minPrice, maxPrice, bedrooms, location, currentPage]);

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
    setCurrentPage(1); // Reset to the first page
  };

  // Toggle mobile navbar
  const toggleNav = () => {
    setShowNav(!showNav);
  };

  // Handle page change
  // Update handlePageChange to use API-provided URLs
const handlePageChange = (page) => {
  setLoading(true);
  try {
    let url;
    
    if (page === currentPage + 1 && properties.next) {
      url = properties.next; // Use next URL from API
    } else if (page === currentPage - 1 && properties.previous) {
      url = properties.previous; // Use previous URL from API
    } else {
      // Fallback: Construct URL manually
      url = `api.guryohub.com/hosts/to-rent/?page=${page}`;
    }

    axios.get(url)
      .then(response => {
        setProperties(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 12));
        setCurrentPage(page);
      })
      .catch(error => {
        console.error("Error fetching properties:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  } catch (error) {
    console.error("Error handling page change:", error);
    setLoading(false);
  }
};

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <div className="home-real-estate">
      {/* Navbar */}
      <Navbar expand="lg" className="navbar">
        <Container fluid>
          {/* Logo Section */}
          <Navbar.Brand className="col-md-3 mb-2 mb-md-0">
            <Link to="/" className="d-inline-flex link-body-emphasis text-decoration-none navbar-logo" style={{color:"white"}}>
             <h2>Guryo<span style={{ color: "orange" }}>Hub</span></h2> 
            </Link>
          </Navbar.Brand>

          {/* Toggle Button for Mobile */}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={toggleNav}
            className="navbar-toggle"
          >
            <FaBars className="bars"/>
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
              <Link to="/to-rent" className="nav-link" onClick={() => setShowNav(false)}>
                To Rent
              </Link>
              <Link to="/rooms" className="nav-link px-2" onClick={() => setShowNav(false)}>
                Hotels
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
              <Link to="/login">
                <Button variant="primary">Sign-up</Button>
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Find Your Dream Property</h1>
        <div className="search-container">
          {/* Location Search Bar */}
          <Form.Group className="search-bar">
            <Form.Control
              type="text"
              placeholder="Enter city or address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Button variant="primary" onClick={() => fetchProperties(1)}>
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
                <option value="15000">ksh 15 000</option>
                <option value="100000">ksh 20 000</option>
                <option value="200000">ksh 60 000</option>
                <option value="500000">ksh 80 000</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-group">
              <Form.Label>Max Price</Form.Label>
              <Form.Select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >
                <option value="Any">Any</option>
                <option value="100000">$100,000</option>
                <option value="200000">$200,000</option>
                <option value="500000">$500,000</option>
                <option value="1000000">$1,000,000</option>
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
          <h2 className="text-center"></h2>
        ) : (
          <>
            <Row>
              {properties.map((property) => (
                <Col key={property.id} md={3} className="mb-4">
                  <Card
                    onClick={() => handlePropertyClick(property.id)}
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
                      <Card.Title className="card-title">{property.title}</Card.Title>
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

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {renderPaginationItems()}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          </>
        )}
      </Container>
      <Categories />
      <AboutUs />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default HomeRealEstate;