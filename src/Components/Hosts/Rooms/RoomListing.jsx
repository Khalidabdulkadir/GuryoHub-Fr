import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Navbar, Nav, Badge } from "react-bootstrap";
import { FaMapMarkerAlt, FaSearch, FaBars, FaHotel, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../HomeRealEstate.css";
import AboutUs from "../../About Us/AboutUs";
import ContactUs from "../../../Contact Us/ContactUs";
import Footer from "../../Footer/Footer";

const RoomsListing = () => {
  const [minPrice, setMinPrice] = useState("Any");
  const [maxPrice, setMaxPrice] = useState("Any");
  const [location, setLocation] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);

  // Fetch rooms and hotels
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch hotels first
      const hotelsResponse = await axios.get('https://api.guryohub.com/hosts/hotels/');
      setHotels(hotelsResponse.data);
      // Build room filters
      const queryParams = new URLSearchParams({
        min_price: minPrice === "Any" ? "" : minPrice,
        max_price: maxPrice === "Any" ? "" : maxPrice,
        location: location,
        hotel_name: hotelName
      }).toString();
      // Fetch rooms
      const roomsResponse = await axios.get(
        `https://api.guryohub.com/hosts/rooms/?${queryParams}`
      );
      setRooms(roomsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [minPrice, maxPrice, location, hotelName]);

  const toggleNav = () => setShowNav(!showNav);

  const handleClearFilters = () => {
    setMinPrice("Any");
    setMaxPrice("Any");
    setLocation("");
    setHotelName("");
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
          Guryo<span style={{ color: "orangered" }}>Hub</span>

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
             <Link to="/to-rent" className="nav-link" onClick={() => setShowNav(false)}>
               To Rent
             </Link>
             <Link to="/rooms" className="nav-link px-2" onClick={() => setShowNav(false)}>
               Hotels
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
             <Link to="/login">
               <Button variant="primary">Sign-up</Button>
             </Link>
           </div>
         </Navbar.Collapse>
       </Container>
     </Navbar>

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Find Available Rooms</h1>
        <div className="search-container">
          <Form.Group className="search-bar">
            <Form.Control
              type="text"
              placeholder="Search by location (city or address)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Button variant="primary" onClick={fetchData}>
              <FaSearch /> Search
            </Button>
          </Form.Group>

          {/* Filters */}
          <div className="search-filters">
            <Form.Group className="filter-group">
              <Form.Label>Hotel</Form.Label>
              <Form.Select
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
              >
                <option value="">All Hotels</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.name}>
                    {hotel.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-group">
              <Form.Label>Min Price (KSh)</Form.Label>
              <Form.Select
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              >
                <option value="Any">Any</option>
                <option value="10000">10,000</option>
                <option value="20000">20,000</option>
                <option value="50000">50,000</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-group">
              <Form.Label>Max Price (KSh)</Form.Label>
              <Form.Select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >
                <option value="Any">Any</option>
                <option value="20000">20,000</option>
                <option value="50000">50,000</option>
                <option value="100000">100,000</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="clear-filters">
            <Button variant="secondary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Room Listings */}
      <Container className="mt-5">
        {loading ? (
          <h2 className="text-center">Loading rooms...</h2>
        ) : (
          <Row>
            {rooms.map(room => {
              const hotel = hotels.find(h => h.id === room.hotel);
              return (
                <Col key={room.id} md={4} className="mb-4">
  <Link to={`/rooms/${room.id}`} className="text-decoration-none">
    <Card className="listing-card">
      {room.photo && (
        <Card.Img
          variant="top"
          src={room.photo}
          alt={room.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}
      <Card.Body>
        <Card.Title>
          {room.name}
          {room.is_available && (
            <Badge bg="success" className="ms-2">
              <FaCheckCircle /> Available
            </Badge>
          )}
        </Card.Title>
        <Card.Text className="text-primary">
          <FaMoneyBillWave /> KSh {room.price}
        </Card.Text>
        {hotel && (
          <Card.Text>
            <FaHotel /> {hotel.name}
            <br />
            <FaMapMarkerAlt /> {hotel.location}
          </Card.Text>
        )}
        <Card.Text>{room.description}</Card.Text>
      </Card.Body>
    </Card>
  </Link>
</Col>
              );
            })}
          </Row>
        )}
      </Container>

      <AboutUs/>
      <ContactUs/>
      <Footer />
    </div>
  );
};

export default RoomsListing;