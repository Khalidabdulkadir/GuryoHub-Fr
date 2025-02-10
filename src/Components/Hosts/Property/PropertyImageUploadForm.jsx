import React, { useState, useEffect } from "react";
import axios from "axios";

const PropertyImageUploadForm = () => {
  const [properties, setProperties] = useState([]); // Stores the list of properties
  const [selectedProperty, setSelectedProperty] = useState(""); // Selected property ID
  const [images, setImages] = useState([]); // Stores the selected images
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch properties from the backend API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://192.168.0.110:8000/hosts/properties/");
        setProperties(response.data.results);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  // Handle property selection
  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedProperty || images.length === 0) {
      alert("Please select a property and at least one image.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      for (let image of images) {
        const formData = new FormData();
        formData.append("property", selectedProperty);
        formData.append("image", image); // Use "image" (singular) instead of "images"
  
        await axios.post("http://192.168.0.110:8000/hosts/property-images/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upload Property Images</h2>
      <form onSubmit={handleSubmit}>
        {/* Property Dropdown */}
        <div className="mb-3">
          <label htmlFor="property" className="form-label">
            Select Property
          </label>
          <select
            className="form-select"
            id="property"
            value={selectedProperty}
            onChange={handlePropertyChange}
            required
          >
            <option value="">Choose a property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.title}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label htmlFor="images" className="form-label">
            Upload Images
          </label>
          <input
            type="file"
            className="form-control"
            id="images"
            multiple
            onChange={handleImageChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload Images"}
        </button>
      </form>
    </div>
  );
};

export default PropertyImageUploadForm;