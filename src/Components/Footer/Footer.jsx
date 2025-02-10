import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";

const Footer = () => {
  return (
    <footer
      className="footer py-5 text-light"
      style={{
        backgroundImage: "url('../images/real-estate-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#001f3f",
      }}
    >
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-3">
            <h5>GuryoHub</h5>
            <p>
              We are a leading real estate agency dedicated to helping you find your dream home, investment property, or commercial space.
            </p>
            <div className="social-icons d-flex">
              <a href="#" className="me-2 text-light">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="me-2 text-light">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="me-2 text-light">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-light">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Recent Listings */}
          <div className="col-md-3">
            <h5>Recent Listings</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <span>Luxury Apartment in Downtown</span>
                <small className="d-block text-muted">$500,000</small>
              </li>
              <li>
                <span>Modern Villa with Ocean View</span>
                <small className="d-block text-muted">$1,200,000</small>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-3">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-phone me-2"></i>+254 791 565321
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i>info@guryohub.com
              </li>
              <li>
                <i className="fas fa-map-marker-alt me-2"></i>Nairobi, Kenya
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="col-md-3">
            <h5>Newsletter</h5>
            <p>Get the latest property listings and updates</p>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
              />
              <button className="btn btn-success" type="button">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;