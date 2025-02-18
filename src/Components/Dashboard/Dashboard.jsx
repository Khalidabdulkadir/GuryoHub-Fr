import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaBuilding, FaHome, FaUsers } from "react-icons/fa"; // Import icons
import { Bar, Pie } from "react-chartjs-2"; // Import charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Import Chart.js components
import { useDispatch, useSelector } from "react-redux";
import "./Dashboard.css"; // Custom CSS for the dashboard
import { setAuth } from "../../Redux/authSlice";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    total_properties: 0,
    property_types: {},
    total_hosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.value); 

  // Fetch user data and set authentication state
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = getCookie("token");
        if (!token) {
          dispatch(setAuth(false));
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get("https://api.guryohub.com/users/user");
        setUserRole(response.data.user.role);
        dispatch(setAuth(true));
      } catch (error) {
        console.error("Error fetching user data:", error);
        dispatch(setAuth(false));
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  // Fetch statistics from the API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          "https://api.guryohub.com/hosts/properties/statistics/"
        );
        setStatistics(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setError("Failed to fetch statistics. Please try again later.");
        setLoading(false);
      }
    };

    if (auth && userRole === "admin") {
      fetchStatistics();
    }
  }, [auth, userRole]);

  // Data for the bar chart (property types)
  const propertyTypesData = {
    labels: Object.keys(statistics.property_types),
    datasets: [
      {
        label: "Number of Properties",
        data: Object.values(statistics.property_types),
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"],
        borderColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"],
        borderWidth: 1,
      },
    ],
  };

  // Data for the pie chart (total properties vs total hosts)
  const totalData = {
    labels: ["Total Properties", "Total Hosts"],
    datasets: [
      {
        data: [statistics.total_properties, statistics.total_hosts],
        backgroundColor: ["#007bff", "#28a745"],
        borderColor: ["#007bff", "#28a745"],
        borderWidth: 1,
      },
    ],
  };

  // Helper function to get cookie value
  const getCookie = (name) => {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return "";
  };

  // Display loading state
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <h2>Loading dashboard...</h2>
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

  // Display access denied message if user is not admin
  if (!auth || userRole !== "admin") {
    return (
      <Container className="mt-5 text-center">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        {/* Total Properties Card */}
        <Col md={4} className="mb-4">
          <Card className="dashboard-card total-properties">
            <Card.Body className="text-center">
              <FaBuilding className="dashboard-icon" />
              <Card.Title>Total Properties</Card.Title>
              <Card.Text className="display-4">
                {statistics.total_properties}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Property Types Card */}
        <Col md={4} className="mb-4">
          <Card className="dashboard-card property-types">
            <Card.Body className="text-center">
              <FaHome className="dashboard-icon" />
              <Card.Title>Property Types</Card.Title>
              <div className="property-types-row">
                {Object.entries(statistics.property_types).map(
                  ([type, count]) => (
                    <div key={type} className="property-type-item">
                      <strong>{type}:</strong> {count}
                    </div>
                  )
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Hosts Card */}
        <Col md={4} className="mb-4">
          <Card className="dashboard-card total-hosts">
            <Card.Body className="text-center">
              <FaUsers className="dashboard-icon" />
              <Card.Title>Total Hosts</Card.Title>
              <Card.Text className="display-4">
                {statistics.total_hosts}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row className="mt-4">
        <Col md={6} className="mb-4">
          <Card className="chart-card">
            <Card.Body>
              <Card.Title>Property Types Distribution</Card.Title>
              <div className="chart-container">
                <Bar
                  data={propertyTypesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: "Property Types",
                      },
                    },
                    animation: {
                      duration: 1000,
                      easing: "easeInOutQuad",
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="chart-card">
            <Card.Body>
              <Card.Title>Total Properties vs Total Hosts</Card.Title>
              <div className="chart-container">
                <Pie
                  data={totalData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: "Properties vs Hosts",
                      },
                    },
                    animation: {
                      duration: 1000,
                      easing: "easeInOutQuad",
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;