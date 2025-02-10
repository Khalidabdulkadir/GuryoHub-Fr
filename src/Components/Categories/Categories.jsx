import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaHome, FaBuilding, FaStar } from "react-icons/fa"; // Import icons
import "./Categories.css"; // Custom CSS for styling

const Categories = () => {
  return (
    <section className="categories-section py-5">
      <Container>
        <h2 className="text-center mb-5">Explore Our Property Categories</h2>
        <Row>
          {/* Rent Properties */}
          <Col md={4} className="mb-4">
            <Card className="category-card text-center">
              <div className="icon-wrapper">
                <FaHome className="category-icon" />
              </div>
              <Card.Body>
                <Card.Title>Rent Properties</Card.Title>
                <Card.Text>
                  Find your perfect rental home, from cozy apartments to spacious
                  family houses.
                </Card.Text>
                <a href="/to-rent" className="btn btn-primary">
                  View Rentals
                </a>
              </Card.Body>
            </Card>
          </Col>

          {/* For Sale Properties */}
          <Col md={4} className="mb-4">
            <Card className="category-card text-center">
              <div className="icon-wrapper">
                <FaBuilding className="category-icon" />
              </div>
              <Card.Body>
                <Card.Title>For Sale Properties</Card.Title>
                <Card.Text>
                  Explore a wide range of properties for sale, including homes,
                  condos, and townhouses.
                </Card.Text>
                <a href="/for-sale" className="btn btn-primary">
                  View Listings
                </a>
              </Card.Body>
            </Card>
          </Col>

          {/* Luxury Properties */}
          <Col md={4} className="mb-4">
            <Card className="category-card text-center">
              <div className="icon-wrapper">
                <FaStar className="category-icon" />
              </div>
              <Card.Body>
                <Card.Title>Hotel Booking</Card.Title>
                <Card.Text>
                  Discover high-end properties with premium amenities and
                  exclusive locations.
                </Card.Text>
                <a href="/" className="btn btn-primary">
                  View Luxury Homes
                </a>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Categories;