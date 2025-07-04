import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const mealTypes = ["Breakfast", "Lunch", "Dinner"];
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const mealPlans = [
  { id: 1, name: "Diet Plan", price: 30000 },
  { id: 2, name: "Protein Plan", price: 40000 },
  { id: 3, name: "Royal Plan", price: 60000 },
];

export default function Subscription() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    planId: "",
    mealTypes: [],
    deliveryDays: [],
    allergies: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMealTypeChange = (mealType) => {
    setFormData((prev) => {
      const newMealTypes = prev.mealTypes.includes(mealType)
        ? prev.mealTypes.filter((mt) => mt !== mealType)
        : [...prev.mealTypes, mealType];
      return { ...prev, mealTypes: newMealTypes };
    });
  };

  const handleDeliveryDayChange = (day) => {
    setFormData((prev) => {
      const newDeliveryDays = prev.deliveryDays.includes(day)
        ? prev.deliveryDays.filter((d) => d !== day)
        : [...prev.deliveryDays, day];
      return { ...prev, deliveryDays: newDeliveryDays };
    });
  };

  const calculateTotal = () => {
    if (
      !formData.planId ||
      formData.mealTypes.length === 0 ||
      formData.deliveryDays.length === 0
    ) {
      return 0;
    }

    const selectedPlan = mealPlans.find(
      (plan) => plan.id === parseInt(formData.planId)
    );
    return (
      selectedPlan.price *
      formData.mealTypes.length *
      formData.deliveryDays.length *
      4.3
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.planId) newErrors.planId = "Please select a meal plan";
    if (formData.mealTypes.length === 0)
      newErrors.mealTypes = "Select at least one meal type";
    if (formData.deliveryDays.length === 0)
      newErrors.deliveryDays = "Select at least one delivery day";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        meal_plan_id: 1,
        meal_types: formData.mealTypes,
        delivery_days: formData.deliveryDays,
        allergies: formData.allergies,
        name: formData.name, // Changed to match likely backend expectation
        phone: formData.phone, // Changed to match likely backend expectation
      };
      console.log(payload);
      const response = await axios.post(
        "http://localhost:8000/api/subscriptions",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      navigate("/Order", {
        state: {
          newOrder: response.data.order,
          newSubscription: response.data.subscription,
        },
      });
    } catch (error) {
      if (error.response?.status === 422) {
        // Flatten Laravel validation errors
        const validationErrors = error.response.data.errors || {};
        setErrors(validationErrors);
        const firstError = Object.values(validationErrors)[0]?.[0];
        if (firstError) {
          alert(`Validation error: ${firstError}`);
        }
      } else {
        console.error("Error:", error);
        alert(
          error.response?.data?.message || "Failed to complete subscription"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="subscription-page">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Subscribe to SEA Catering
      </motion.h1>

      <form onSubmit={handleSubmit} className="subscription-form">
        <div className="form-section">
          <h2>Personal Information</h2>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name || errors.customer_name ? "error" : ""}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Active Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>Meal Plan Selection</h2>

          <div className="form-group">
            <label>Select Your Plan *</label>
            <div className="plan-options">
              {mealPlans.map((plan) => (
                <div key={plan.id} className="plan-option">
                  <input
                    type="radio"
                    id={`plan-${plan.id}`}
                    name="planId"
                    value={plan.id}
                    checked={formData.planId === plan.id.toString()}
                    onChange={handleChange}
                  />
                  <label htmlFor={`plan-${plan.id}`}>
                    <strong>{plan.name}</strong> - Rp
                    {plan.price.toLocaleString("id-ID")}/meal
                  </label>
                </div>
              ))}
            </div>
            {errors.planId && (
              <span className="error-message">{errors.planId}</span>
            )}
          </div>

          <div className="form-group">
            <label>Meal Types *</label>
            <div className="checkbox-group">
              {mealTypes.map((mealType) => (
                <div key={mealType} className="checkbox-option">
                  <input
                    type="checkbox"
                    id={`meal-${mealType}`}
                    checked={formData.mealTypes.includes(mealType)}
                    onChange={() => handleMealTypeChange(mealType)}
                  />
                  <label htmlFor={`meal-${mealType}`}>{mealType}</label>
                </div>
              ))}
            </div>
            {errors.mealTypes && (
              <span className="error-message">{errors.mealTypes}</span>
            )}
          </div>

          <div className="form-group">
            <label>Delivery Days *</label>
            <div className="day-selector">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`day-button ${
                    formData.deliveryDays.includes(day) ? "selected" : ""
                  }`}
                  onClick={() => handleDeliveryDayChange(day)}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
            {errors.deliveryDays && (
              <span className="error-message">{errors.deliveryDays}</span>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>Additional Information</h2>

          <div className="form-group">
            <label htmlFor="allergies">Allergies or Dietary Restrictions</label>
            <textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="List any food allergies or special dietary needs..."
            />
          </div>
        </div>

        <div className="summary-section">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <p>
              <strong>Selected Plan:</strong>{" "}
              {formData.planId
                ? mealPlans.find((p) => p.id === parseInt(formData.planId))
                    ?.name
                : "Not selected"}
            </p>
            <p>
              <strong>Meal Types:</strong>{" "}
              {formData.mealTypes.length > 0
                ? formData.mealTypes.join(", ")
                : "None selected"}
            </p>
            <p>
              <strong>Delivery Days:</strong>{" "}
              {formData.deliveryDays.length > 0
                ? formData.deliveryDays.join(", ")
                : "None selected"}
            </p>
            <p className="total-price">
              <strong>Total Price:</strong> Rp
              {calculateTotal().toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Complete Subscription"}
        </button>
      </form>
    </div>
  );
}
