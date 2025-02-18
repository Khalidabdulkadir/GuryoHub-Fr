import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Row, Col, Container } from "react-bootstrap";

const PropertyForm = () => {
  const [hosts, setHosts] = useState([]); // For host dropdown
  const [propertyTypes, setPropertyTypes] = useState([
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "condo", label: "Condo" },
    { value: "house", label: "House" },
    { value: "land", label: "Land" },
  ]);
  const [amenities, setAmenities] = useState([
    "WiFi",
    "Pool",
    "Parking",
    "Air Conditioning",
    "Gym",
    "Balcony",
    "Pet Friendly",
    "Near by Bus Stop",
    "Near by Hospital",
    "Near by School",
  ]);

  // Initial state for the property
  const [property, setProperty] = useState({
    host: "",
    created_by: "admin",
    title: "",
    description: "",
    location: { address: "", city: "", country: "" },
    price: "",
    property_type: "apartment",
    bedrooms: "",
    bathrooms: "",
    square_meters: "",
    amenities: [],
    listing_type: "sale", // New field for sale or rent
    image: null, // Main image file
    you_tube_link: "", // New field for YouTube link
  });

  // Fetch hosts for the dropdown
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await axios.get("api.guryohub.com/hosts/hosts/");
        setHosts(response.data);
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    };

    fetchHosts();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  // Handle nested input changes (e.g., location)
  const handleNestedInputChange = (e) => {
    const { name, value } = e.target;
    setProperty({
      ...property,
      location: { ...property.location, [name]: value },
    });
  };

  // Handle amenities selection
  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setProperty({
        ...property,
        amenities: [...property.amenities, value],
      });
    } else {
      setProperty({
        ...property,
        amenities: property.amenities.filter((item) => item !== value),
      });
    }
  };

  // Handle main image upload
  const handleImageUpload = (e) => {
    setProperty({ ...property, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append all property fields to formData
    formData.append("host_id", property.host); // Ensure host_id is included
    formData.append("created_by", property.created_by);
    formData.append("title", property.title);
    formData.append("description", property.description);

    // Append location as a JSON string
    formData.append("location", JSON.stringify(property.location));

    formData.append("price", property.price);
    formData.append("property_type", property.property_type);
    formData.append("listing_type", property.listing_type); // Add listing type
    formData.append("bedrooms", property.bedrooms);
    formData.append("bathrooms", property.bathrooms);
    formData.append("square_meters", property.square_meters);
    formData.append("amenities", JSON.stringify(property.amenities));
    formData.append("you_tube_link", property.you_tube_link); // Add YouTube link

    // Append the image file
    if (property.image) {
      formData.append("image", property.image);
    }

    try {
      const response = await axios.post(
        "api.guryohub.com/hosts/properties/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Property created successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error creating property:", error);
      alert("Failed to create property. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Create Property</h2>
      <Form onSubmit={handleSubmit}>
        {/* Host Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Host</Form.Label>
          <Form.Select
            name="host"
            value={property.host}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Host</option>
            {hosts.map((host) => (
              <option key={host.id} value={host.id}>
                {host.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Created By Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Created By</Form.Label>
          <Form.Select
            name="created_by"
            value={property.created_by}
            onChange={handleInputChange}
            required
          >
            <option value="admin">Admin</option>
            <option value="host">Host</option>
          </Form.Select>
        </Form.Group>

        {/* Listing Type Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Listing Type</Form.Label>
          <Form.Select
            name="listing_type"
            value={property.listing_type}
            onChange={handleInputChange}
            required
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="land">Land for Sale</option> {/* New option */}
          </Form.Select>
        </Form.Group>

        {/* Title */}
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={property.title}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={property.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Location */}
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Row>
            <Col md={4}>
              <Form.Control
                type="text"
                name="address"
                placeholder="Address"
                value={property.location.address}
                onChange={handleNestedInputChange}
                required
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="city"
                placeholder="City"
                value={property.location.city}
                onChange={handleNestedInputChange}
                required
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="country"
                placeholder="Country"
                value={property.location.country}
                onChange={handleNestedInputChange}
                required
              />
            </Col>
          </Row>
        </Form.Group>

        {/* Price */}
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={property.price}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Property Type Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Property Type</Form.Label>
          <Form.Select
            name="property_type"
            value={property.property_type}
            onChange={handleInputChange}
            required
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Bedrooms */}
        <Form.Group className="mb-3">
          <Form.Label>Bedrooms</Form.Label>
          <Form.Control
            type="number"
            name="bedrooms"
            value={property.bedrooms}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Bathrooms */}
        <Form.Group className="mb-3">
          <Form.Label>Bathrooms</Form.Label>
          <Form.Control
            type="number"
            name="bathrooms"
            value={property.bathrooms}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Square Meters */}
        <Form.Group className="mb-3">
          <Form.Label>Square Meters</Form.Label>
          <Form.Control
            type="number"
            name="square_meters"
            value={property.square_meters}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Amenities Checkboxes */}
        <Form.Group className="mb-3">
          <Form.Label>Amenities</Form.Label>
          <Row>
            {amenities.map((amenity) => (
              <Col md={4} key={amenity}>
                <Form.Check
                  type="checkbox"
                  label={amenity}
                  value={amenity}
                  checked={property.amenities.includes(amenity)}
                  onChange={handleAmenitiesChange}
                />
              </Col>
            ))}
          </Row>
        </Form.Group>

        {/* Main Image Upload */}
        <Form.Group className="mb-3">
          <Form.Label>Main Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
        </Form.Group>

        {/* YouTube Link */}
        <Form.Group className="mb-3">
          <Form.Label>YouTube Link</Form.Label>
          <Form.Control
            type="url"
            name="you_tube_link"
            placeholder="Enter YouTube link (optional)"
            value={property.you_tube_link}
            onChange={handleInputChange}
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Create Property
        </Button>
      </Form>
    </Container>
  );
};

export default PropertyForm;