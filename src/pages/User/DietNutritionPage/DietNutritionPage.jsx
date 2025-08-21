import React, { useEffect, useState } from "react";
import "./DietNutritionPage.css";
import { UserService } from "../../../services/UserService";
import { jwtDecode } from "jwt-decode";
import {
  FaAppleAlt, FaEgg, FaLeaf, FaBreadSlice, FaDrumstickBite,
  FaFish, FaCarrot, FaCheese, FaHotdog, FaSeedling
} from "react-icons/fa";

// Static nutrition reference data
const dietData = [
  { item: "Apple",    icon: <FaAppleAlt />, category: "Vegan",      calories: 52,  protein: 0.3, carbs: 14,  fat: 0.2, fiber: 2.4 },
  { item: "Egg",      icon: <FaEgg />,     category: "Vegetarian", calories: 68,  protein: 6.0, carbs: 0.6,  fat: 5,   fiber: 0   },
  { item: "Leafy Salad", icon: <FaLeaf />, category: "Vegan",      calories: 15,  protein: 1.4, carbs: 2.9,  fat: 0.2, fiber: 1.5 },
  { item: "Roti",     icon: <FaBreadSlice />,category: "Vegan",    calories: 70,  protein: 2.7, carbs: 14,   fat: 0.4, fiber: 1.7 },
  { item: "Chicken",  icon: <FaDrumstickBite />,category: "Non-Veg",calories: 190,protein: 29, carbs: 0,    fat: 7,   fiber: 0   },
  { item: "Fish",     icon: <FaFish />,    category: "Non-Veg",    calories: 206, protein: 22,  carbs: 0,    fat: 12,  fiber: 0   },
  { item: "Carrot",   icon: <FaCarrot />,  category: "Vegan",      calories: 41,  protein: 0.9, carbs: 10,   fat: 0.2, fiber: 2.8 },
  { item: "Paneer",   icon: <FaCheese />,  category: "Vegetarian", calories: 265, protein: 18,  carbs: 1.2,  fat: 21,  fiber: 0   },
  { item: "Soy Hotdog",icon: <FaHotdog />, category: "Vegan",      calories: 105, protein: 9.5, carbs: 7.2,  fat: 4.4, fiber: 2.2 },
  { item: "Sprouts",  icon: <FaSeedling />,category: "Vegan",      calories: 30,  protein: 3,   carbs: 6,    fat: 0.5, fiber: 1.8 },
];

const categoryColor = (cat) =>
  cat === "Vegan"
    ? "#228B22"
    : cat === "Vegetarian"
    ? "#755a00"
    : "#a52a2a";

function getCurrentUserIdFromToken() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.sub || decoded.email || null;
  } catch {
    return null;
  }
}

const DietNutritionPage = ({ membershipType = "premium" }) => {
  console.log(membershipType);
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const userId = getCurrentUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setDietPlan(null);
      setApiError("You must be logged in to view your diet plan.");
      return;
    }
    setLoading(true);
    UserService.getUserDiet(userId)
      .then(res => {
        setDietPlan(res.data);
        setLoading(false);
        setApiError("");
      })
      .catch(() => {
        setApiError("Could not load diet plan.");
        setLoading(false);
      });
  }, [userId]);

  if (!userId) {
    return <div className="dietnut-bg"><div className="text-danger">You must be logged in.</div></div>;
  }
  if (loading) {
    return <div className="dietnut-bg"><div>Loading diet...</div></div>;
  }
  if (apiError) {
    return <div className="dietnut-bg"><div className="text-danger">{apiError}</div></div>;
  }

  return (
    <div className="dietnut-bg">
      <div className="dietnut-max-container">
        {/* User's Diet Table */}
        <div className="dietnut-header">
          <h2 className="dietnut-title">Your Personalized Diet Plan</h2>
        </div>
        <div className="dietnut-tablewrapper" style={{ marginBottom: 36 }}>
          <table className="dietnut-table">
            <thead>
              <tr>
                <th>Meal</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Breakfast</td>
                <td>{dietPlan?.breakfast || "Not set"}</td>
              </tr>
              <tr>
                <td>Lunch</td>
                <td>{dietPlan?.lunch || "Not set"}</td>
              </tr>
              <tr>
                <td>Dinner</td>
                <td>{dietPlan?.dinner || "Not set"}</td>
              </tr>
              <tr>
                <td>Mid Snack</td>
                <td>{dietPlan?.midSnack || "Not set"}</td>
              </tr>
            </tbody>
          </table>
          {/* Show instructions if present */}
          {dietPlan?.instructions && dietPlan.instructions.trim() !== "" && (
            <div className="dietnut-instructions">
              <strong>Instructions:</strong> {dietPlan.instructions}
            </div>
          )}
        </div>

        {/* Nutrition Reference Table */}
        <div className="dietnut-header">
          <h2 className="dietnut-title">Diet &amp; Nutrition Reference</h2>
          <div className="dietnut-desc">
            Reference of common foods and their nutrition values (Vegan, Veg, Non-Veg)
          </div>
        </div>
        <div className="dietnut-tablewrapper">
          <table className="dietnut-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Calories</th>
                <th>Protein (g)</th>
                <th>Carbs (g)</th>
                <th>Fat (g)</th>
                <th>Fiber (g)</th>
              </tr>
            </thead>
            <tbody>
              {dietData.map((row) => (
                <tr key={row.item}>
                  <td className="dietnut-itemcell">
                    <span className="dietnut-icon">{row.icon}</span>
                    {row.item}
                  </td>
                  <td>
                    <span style={{ color: categoryColor(row.category), fontWeight: 700 }}>{row.category}</span>
                  </td>
                  <td>{row.calories}</td>
                  <td>{row.protein}</td>
                  <td>{row.carbs}</td>
                  <td>{row.fat}</td>
                  <td>{row.fiber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DietNutritionPage;
