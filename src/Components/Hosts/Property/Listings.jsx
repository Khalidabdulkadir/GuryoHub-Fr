import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import "./PropertyList.css"; // Custom CSS for the table

const PropertyList = () => {
  const [properties, setProperties] = useState([]); // State to store properties
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [showModal, setShowModal] = useState(false); // State to control edit modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control delete confirmation modal
  const [selectedProperty, setSelectedProperty] = useState(null); // State to store the property being edited or deleted
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const [totalPages, setTotalPages] = useState(1); // State to track the total number of pages

  // Fetch properties from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`api.guryohub.com/hosts/properties/?page=${currentPage}`);
        setProperties(response.data.results); // Set the fetched data to state
        setTotalPages(Math.ceil(response.data.count / 12)); // Calculate total pages (12 items per page)
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to fetch properties. Please try again later."); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchProperties();
  }, [currentPage]);

  // Handle delete property
  const handleDelete = async () => {
    try {
      await axios.delete(`api.guryohub.com/hosts/properties/${selectedProperty.id}/`);
      setProperties(properties.filter((property) => property.id !== selectedProperty.id)); // Remove the deleted property from the list
      setShowDeleteModal(false); // Close the delete confirmation modal
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  // Handle edit property
  const handleEdit = (property) => {
    setSelectedProperty(property); // Set the property to be edited
    setShowModal(true); // Open the edit modal
  };

  // Handle delete confirmation
  const confirmDelete = (property) => {
    setSelectedProperty(property); // Set the property to be deleted
    setShowDeleteModal(true); // Open the delete confirmation modal
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false); // Close the edit modal
    setSelectedProperty(null); // Reset the selected property
  };

  // Handle delete modal close
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false); // Close the delete confirmation modal
    setSelectedProperty(null); // Reset the selected property
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `api.guryohub.com/hosts/properties/${selectedProperty.id}/`,
        selectedProperty
      );
      setProperties(
        properties.map((property) =>
          property.id === selectedProperty.id ? response.data : property
        )
      ); // Update the property in the list
      handleCloseModal(); // Close the edit modal
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  // Handle input changes in the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProperty({
      ...selectedProperty,
      [name]: value,
    });
  };

  // Handle nested input changes (e.g., location)
  const handleNestedInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProperty({
      ...selectedProperty,
      location: {
        ...selectedProperty.location,
        [name]: value,
      },
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      <Table striped bordered hover responsive className="property-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Location</th>
            <th>Price</th>
            <th>Type</th>
            <th>Bedrooms</th>
            <th>Bathrooms</th>
            <th>Amenities</th>
            <th>Square Meters</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property, index) => (
            <tr key={property.id}>
              <td>{index + 1}</td>
              <td>{property.title}</td>
              <td>
                {property.location && property.location.address
                  ? `${property.location.address}, ${property.location.city}, ${property.location.country}`
                  : "N/A"}
              </td>
              <td>${property.price}</td>
              <td>{property.property_type}</td>
              <td>{property.bedrooms}</td>
              <td>{property.bathrooms}</td>
              <td>{property.amenities.join(", ")}</td>
              <td>{property.square_meters}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(property)} // Open the edit modal
                >
                  <FaEdit /> {/* Edit icon */}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => confirmDelete(property)} // Open the delete confirmation modal
                >
                  <FaTrash /> {/* Delete icon */}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Edit Property Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProperty && (
            <Form onSubmit={handleSubmit}>
              {/* Title */}
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={selectedProperty.title}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={selectedProperty.description}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {/* Location */}
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={selectedProperty.location?.address || ""}
                  onChange={handleNestedInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={selectedProperty.location?.city || ""}
                  onChange={handleNestedInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={selectedProperty.location?.country || ""}
                  onChange={handleNestedInputChange}
                />
              </Form.Group>

              {/* Price */}
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={selectedProperty.price}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {/* Property Type */}
              <Form.Group className="mb-3">
                <Form.Label>Property Type</Form.Label>
                <Form.Control
                  as="select"
                  name="property_type"
                  value={selectedProperty.property_type}
                  onChange={handleInputChange}
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                  <option value="house">House</option>
                </Form.Control>
              </Form.Group>

              {/* Bedrooms */}
              <Form.Group className="mb-3">
                <Form.Label>Bedrooms</Form.Label>
                <Form.Control
                  type="number"
                  name="bedrooms"
                  value={selectedProperty.bedrooms}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {/* Bathrooms */}
              <Form.Group className="mb-3">
                <Form.Label>Bathrooms</Form.Label>
                <Form.Control
                  type="number"
                  name="bathrooms"
                  value={selectedProperty.bathrooms}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {/* Square Meters */}
              <Form.Group className="mb-3">
                <Form.Label>Square Meters</Form.Label>
                <Form.Control
                  type="number"
                  name="square_meters"
                  value={selectedProperty.square_meters}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {/* Amenities */}
              <Form.Group className="mb-3">
                <Form.Label>Amenities</Form.Label>
                <Form.Control
                  type="text"
                  name="amenities"
                  value={selectedProperty.amenities.join(", ")}
                  onChange={(e) =>
                    setSelectedProperty({
                      ...selectedProperty,
                      amenities: e.target.value.split(", "),
                    })
                  }
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the property titled "{selectedProperty?.title}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PropertyList;