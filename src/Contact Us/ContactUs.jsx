import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa"; // Icons for contact info
import "./ContactUs.css"; // Custom CSS for styling

const ContactUs = () => {
  return (
    <div id="contact-us" className="contact-us-section">
      <Container>
        <h2 className="text-center mb-5">Contact Us</h2>
        <Row>
          {/* Contact Form */}
          <Col md={6} className="mb-4">
            <div className="contact-form p-4">
              <h3 className="mb-4">Send Us a Message</h3>
              <Form>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Enter your message"
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Send Message
                </Button>
              </Form>
            </div>
          </Col>

          {/* Contact Information */}
          <Col md={6} className="mb-4">
            <div className="contact-info p-4">
              <h3 className="mb-4">Get in Touch</h3>
              <div className="contact-item mb-4">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <h5>Our Office</h5>
                  <p>jam Street, eastliegh, Nairobi, Kenya</p>
                </div>
              </div>
              <div className="contact-item mb-4">
                <FaPhone className="contact-icon" />
                <div>
                  <h5>Call Us</h5>
                  <p>+254 791 565321</p>
                </div>
              </div>
              <div className="contact-item mb-4">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h5>Email Us</h5>
                  <p>info@GuryoHub.com</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Optional: Embed a Map */}
        <Row className="mt-5">
          <Col md={12}>
            <div className="map-container">
              <iframe
                title="GuryoHub Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8085599999997!2d36.82115931475391!3d-1.2863858999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d5b5f5b5f5%3A0x5f5f5f5f5f5f5f5f!2sPropertySom!5e0!3m2!1sen!2ske!4v1633020000000!5m2!1sen!2ske"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;