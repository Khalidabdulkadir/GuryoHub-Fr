import React from "react";

const AboutUs = () => {
  const features = [
    {
      title: "Property for Rent",
      imgSrc: "../images/renticon.jpg", // Replace with actual image path
    },
    {
      title: "Property for Sale",
      imgSrc: "../images/saleicon.jpg", // Replace with actual image path
    },
    {
      title: "Land for Sale",
      imgSrc: "../images/landforsale.jpg", // Replace with actual image path
    },
    {
      title: "Hotel Booking",
      imgSrc: "../images/hotel.jpg", // Replace with actual image path
    },
  ];

  return (
    <section className="container py-5" id="about-us">
      <div className="row align-items-center">
        {/* Left Image Section */}
        <div className="col-lg-6 mb-4 mb-lg-0">
          <img
            src="../images/nairobi1.jpg" // Replace with actual image URL
            alt="Real Estate Overview"
            className="img-fluid rounded"
          />
        </div>

        {/* Right Text Section */}
        <div className="col-lg-6">
          <h5 className="text-uppercase text-muted">About Us</h5>
          <h2 className="fw-bold">
            Your Trusted Partner in real estate
            <span className="text-danger"> GuryoHub</span>
          </h2>
          <p className="text-muted">
            We connect buyers, sellers, and renters to their ideal properties. Whether you are looking for a home to rent, a property to purchase, land investment opportunities, or hassle-free hotel bookings, we provide a seamless experience tailored to your needs.
          </p>
          <div className="row g-3">
            {/* Feature Cards */}
            {features.map((feature, index) => (
              <div key={index} className="col-6">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-light d-flex justify-content-center align-items-center me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  >
                    <img
                      src={feature.imgSrc}
                      alt={feature.title}
                      className="img-fluid"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div>
                    <h6 className="mb-0">{feature.title}</h6>
                    <p className="mb-0 small text-muted">
                      Discover the best options tailored for you.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-success mt-4">Explore Properties</button>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
