import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from "react-icons/fa"; // Import icons
import "./Listings.css"; // Custom CSS for the listings

const Listings = () => {
  const [properties, setProperties] = useState([]); // State to store properties
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [selectedProperty, setSelectedProperty] = useState(null); // State to store the selected property for the modal
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  // Fetch properties from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("https://api.guryohub.com/hosts/properties/");
        setProperties(response.data); // Set the fetched data to state
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to fetch properties. Please try again later."); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchProperties();
  }, []);

  // Handle property click to show details in modal
  const handlePropertyClick = (property) => {
    setSelectedProperty(property); // Set the selected property
    setShowModal(true); // Open the modal
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedProperty(null); // Reset the selected property
  };

  // Display loading state
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <h2>Loading properties...</h2>
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
    <Container className="mt-5">
      <h2 className="mb-4">Properties List</h2>
      <Row>
        {properties.map((property) => (
          <Col key={property.id} md={4} className="mb-4">
            <Card onClick={() => handlePropertyClick(property)} className="listing-card">
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

      {/* Listing Detail Modal */}
      {selectedProperty && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedProperty.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                {selectedProperty.image && (
                  <img
                    src={selectedProperty.image}
                    alt={selectedProperty.title}
                    style={{ width: "100%", borderRadius: "10px" }}
                  />
                )}
              </Col>
              <Col md={6}>
                <p>
                  <strong>Description:</strong> {selectedProperty.description}
                </p>
                <p>
                  <strong>Price:</strong> KSh {selectedProperty.price}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {selectedProperty.location && selectedProperty.location.address
                    ? `${selectedProperty.location.address}, ${selectedProperty.location.city}, ${selectedProperty.location.country}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Type:</strong> {selectedProperty.property_type}
                </p>
                <p>
                  <strong>Bedrooms:</strong> {selectedProperty.bedrooms}
                </p>
                <p>
                  <strong>Bathrooms:</strong> {selectedProperty.bathrooms}
                </p>
                <p>
                  <strong>Amenities:</strong>{" "}
                  {selectedProperty.amenities.join(", ")}
                </p>
                <p>
                  <strong>Square Meters:</strong> {selectedProperty.square_meters}
                </p>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary">Contact Seller</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Listings;