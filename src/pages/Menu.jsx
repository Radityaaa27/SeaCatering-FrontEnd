import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MealCard from "../components/MealCard";

export default function Menu() {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/meal-plans")
      .then((response) => {
        console.log("Fetched meal plans:", response.data);
        setMealPlans(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching meal plans:", error);
      });
  }, []);

  const handleSubscribe = (meal) => {
    setSelectedMeal(meal);
    navigate("/subscription",{
      state: {meal}
    })
  };

  return (
    <div className="menu-page">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Our Meal Plans
      </motion.h1>

      <p className="page-description">
        Choose from our variety of healthy meal plans tailored to your lifestyle
        and goals.
      </p>

      <div className="meal-grid">
        {Array.isArray(mealPlans) &&
          mealPlans.map((meal) => {
            console.log("Meal:", meal); 

            return (
              <MealCard
                key={meal.id}
                meal={{
                  ...meal,
                  benefits: Array.isArray(meal.benefits)
                    ? meal.benefits
                    : JSON.parse(meal.benefits),
                    image: `http://localhost:8000/storage/${meal.image}`
                }}
                onSubscribe={handleSubscribe}
              />
            );
          })}
      </div>
    </div>
  );
}
