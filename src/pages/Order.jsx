import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Add default subscription data if missing
        const ordersWithDefaults = response.data.map((order) => ({
          ...order,
          id: null,
          subscription: order.subscription || {
            image: "/images/default-meal.jpg",
            name: "Subscription Plan",
            price: 0,
          },
        }));

        setOrders(ordersWithDefaults);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "pending";
      case "processing":
        return "processing";
      case "delivered":
        return "shipped";
      case "completed":
        return "completed";
      case "cancelled":
        return "cancelled";
      default:
        return "";
    }
  };

  const getProgressSteps = (status) => {
    const steps = [
      { id: 1, label: "Order Placed", active: true },
      { id: 2, label: "Processing", active: status !== "pending" },
      {
        id: 3,
        label: "Shipped",
        active: ["delivered", "completed"].includes(status),
      },
      { id: 4, label: "Delivered", active: status === "completed" },
    ];

    if (status === "cancelled") {
      steps.forEach((step) => (step.active = false));
    }

    return steps;
  };

  return (
    <div className="order-page">
      <h2>My Orders</h2>

      <div className="order-filter">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Orders
        </button>
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === "processing" ? "active" : ""}`}
          onClick={() => setFilter("processing")}
        >
          Processing
        </button>
        <button
          className={`filter-btn ${filter === "delivered" ? "active" : ""}`}
          onClick={() => setFilter("delivered")}
        >
          Delivered
        </button>
        <button
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={`filter-btn ${filter === "cancelled" ? "active" : ""}`}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading orders...</span>
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="no-orders">
          <i className="fas fa-box-open fa-3x"></i>
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
          <button
            className="cta-button"
            onClick={() => navigate("/subscriptions")}
          >
            Browse Subscriptions
          </button>
        </div>
      ) : (
        <div className="orders-container">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    Ordered on {new Date(order.order_date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div className="order-progress">
                {getProgressSteps(order.status).map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div
                      className={`progress-step ${step.active ? "active" : ""}`}
                    >
                      <div className="step-icon">
                        <i
                          className={`fas fa-${
                            step.id === 1
                              ? "shopping-cart"
                              : step.id === 2
                              ? "cog"
                              : step.id === 3
                              ? "truck"
                              : "check"
                          }`}
                        ></i>
                      </div>
                      <div className="step-label">{step.label}</div>
                    </div>
                    {index < 3 && (
                      <div
                        className={`progress-line ${
                          step.active ? "active" : ""
                        }`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="order-details">
                <div className="order-items">
                  <div className="order-item">
                    <div className="item-image">
                      <img
                        src={order.subscription?.image || "/default-image.jpg"}
                        alt={order.subscription?.name || "Subscription"}
                      />
                    </div>
                    <div className="item-info">
                      <h4>{order.subscription?.name || "Subscription Plan"}</h4>
                      <p className="item-variant">Subscription Plan</p>
                      <p className="item-price">
                        Delivery Date:{" "}
                        {order.delivery_date
                          ? new Date(order.delivery_date).toLocaleDateString()
                          : "Not scheduled"}
                      </p>
                    </div>
                    <div className="item-total">
                      ${order.subscription?.price?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                </div>
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>
                      ${order.subscription?.price?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>
                      ${order.subscription?.price?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-actions">
                {order.status === "pending" && (
                  <button
                    className="action-btn cancel-btn"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    <i className="fas fa-times"></i> Cancel Order
                  </button>
                )}
                {order.status === "processing" && (
                  <button className="action-btn track-btn">
                    <i className="fas fa-map-marker-alt"></i> Track Order
                  </button>
                )}
                {["delivered", "completed", "cancelled"].includes(
                  order.status
                ) && (
                  <button
                    className="action-btn reorder-btn"
                    onClick={() => {
                      if (order.subscription?.id) {
                        navigate(`/subscriptions/${order.subscription.id}`);
                      } else {
                        console.warn(
                          "No subscription ID available for this order"
                        );
                      }
                    }}
                    disabled={!order.subscription?.id}
                  >
                    <i className="fas fa-redo"></i> Reorder
                  </button>
                )}
                <button
                  className="action-btn details-btn"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <i className="fas fa-info-circle"></i> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
