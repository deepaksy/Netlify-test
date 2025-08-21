import React, { useState } from "react";
import {
  FaWeight, FaFire, FaDumbbell, FaHeartbeat,
  FaBiking, FaRunning, FaWalking, FaUserFriends,
  FaArrowsAltH, FaListUl
} from "react-icons/fa";
import "./WorkoutDietPage.css";

// Workout info per goal -- each with a suitable icon
const workoutInfoByGoal = {
  "fat-loss": [
    { name: "HIIT", icon: <FaFire size={40} color="#ee6e00" />, burns: ["Cardio", "Fat", "Stamina"] },
    { name: "Treadmill Running", icon: <FaRunning size={40} color="#2d93fa" />, burns: ["Cardio", "Calories"] },
    { name: "Cycling", icon: <FaBiking size={40} color="#679018" />, burns: ["Legs", "Cardio", "Fat"] }
  ],
  "body-recomp": [
    { name: "Push-Ups", icon: <FaUserFriends size={40} color="#b4751f" />, burns: ["Strength", "Upper Body", "Calories"] },
    { name: "Resistance Band Row", icon: <FaArrowsAltH size={40} color="#9273bd" />, burns: ["Back", "Arms", "Strength"] },
    { name: "Walking Lunges", icon: <FaWalking size={40} color="#16b353" />, burns: ["Legs", "Core", "Stamina"] }
  ],
  "muscle-gain": [
    { name: "Squats", icon: <FaDumbbell size={40} color="#b3302d" />, burns: ["Strength", "Legs", "Muscle"] },
    { name: "Bench Press", icon: <FaListUl size={40} color="#5375aa" />, burns: ["Chest", "Arms", "Power"] },
    { name: "Deadlift", icon: <FaDumbbell size={40} color="#3c373a" />, burns: ["Full Body", "Strength", "Muscle"] }
  ],
  "endurance": [
    { name: "Distance Running", icon: <FaRunning size={40} color="#1166d3" />, burns: ["Stamina", "Legs", "Cardio"] },
    { name: "Cycling", icon: <FaBiking size={40} color="#269428" />, burns: ["Legs", "Cardio", "Stamina"] },
    { name: "Jump Rope", icon: <FaHeartbeat size={40} color="#ed3a4b" />, burns: ["Coordination", "Full Body", "Cardio"] }
  ]
};

const goalPlans = [
  {
    key: "fat-loss",
    label: (<><FaFire className="goal-icon" color="#000" /> Fat Loss / Calorie Deficit</>),
    summary: "Goal: Fat loss | Daily Calories: ~1500–1700 kcal | Macro: High protein, low carb, low fat",
    meals: [
      { type: "Breakfast", desc: "Oats with skim milk + 1 boiled egg + black coffee", cals: 300 },
      { type: "Snack", desc: "Apple + green tea", cals: 100 },
      { type: "Lunch", desc: "Grilled chicken (100g) + quinoa (1 cup) + salad (olive oil, lemon dressing)", cals: 400 },
      { type: "Snack", desc: "Greek yogurt (low-fat) + 5 almonds", cals: 150 },
      { type: "Dinner", desc: "Stir-fried vegetables + tofu (100g) + soup", cals: 400 },
      { type: "Water", desc: "3–4 litres", cals: null },
    ],
  },
  {
    key: "body-recomp",
    label: (<><FaWeight className="goal-icon" color="#000" /> Weight Loss + Muscle Gain</>),
    summary: "Goal: Lose fat + build lean muscle | Daily Calories: ~1800–2000 kcal | Macro: High protein, moderate carb, moderate fat",
    meals: [
      { type: "Breakfast", desc: "2 eggs + 2 multigrain toasts + banana + black coffee", cals: 350 },
      { type: "Snack", desc: "Whey protein shake + 3 walnuts", cals: 200 },
      { type: "Lunch", desc: "Grilled fish/chicken (150g) + brown rice (1 cup) + veggies", cals: 500 },
      { type: "Snack", desc: "Boiled chickpeas (1 cup) or sprouts salad", cals: 200 },
      { type: "Dinner", desc: "Paneer 100g + mixed veggies + chapati (1)", cals: 450 },
      { type: "Water", desc: "3–4 litres", cals: null },
    ],
  },
  {
    key: "muscle-gain",
    label: (<><FaDumbbell className="goal-icon" color="#000" /> Muscle Gain (Bulking)</>),
    summary: "Goal: Build muscle mass | Daily Calories: ~2500–3000 kcal | Macro: High protein, high carb, moderate fat",
    meals: [
      { type: "Breakfast", desc: "4 egg whites + 2 whole eggs + oats + peanut butter + banana", cals: 600 },
      { type: "Snack", desc: "Protein smoothie (banana + milk + whey + peanut butter)", cals: 400 },
      { type: "Lunch", desc: "Grilled chicken (200g) + white rice (1.5 cups) + salad + curd", cals: 600 },
      { type: "Snack", desc: "Boiled eggs (2) + paneer sandwich + dry fruits", cals: 400 },
      { type: "Dinner", desc: "Salmon/Paneer (150g) + sweet potato (1 cup) + green veggies", cals: 500 },
      { type: "Post-Workout", desc: "Whey protein shake", cals: 200 },
      { type: "Water", desc: "4+ litres", cals: null },
    ],
  },
  {
    key: "endurance",
    label: (<><FaHeartbeat className="goal-icon" color="#000" /> Endurance & Stamina</>),
    summary: "Goal: Improve stamina | Daily Calories: ~2200–2500 kcal | Macro: High carbs, moderate protein, moderate fat",
    meals: [
      { type: "Breakfast", desc: "Whole wheat bread (2) + peanut butter + banana + coffee", cals: 400 },
      { type: "Snack", desc: "Energy bar/fruit + coconut water", cals: 200 },
      { type: "Lunch", desc: "Lean meat/legumes + whole grain pasta/rice + veggies", cals: 600 },
      { type: "Pre-Workout", desc: "Banana + oats + black coffee", cals: 200 },
      { type: "Post-Workout", desc: "Protein shake + 1 boiled egg", cals: 200 },
      { type: "Dinner", desc: "Lentil soup + chapati (2) + salad + curd", cals: 400 },
      { type: "Water", desc: "3–4 litres", cals: null },
    ],
  },
];

const WorkoutDietPage = () => {
  const [goalIdx, setGoalIdx] = useState(0);
  const currentKey = goalPlans[goalIdx].key;
  const workouts = workoutInfoByGoal[currentKey];

  return (
    <div className="diet-main-bg">
      <div className="diet-root-container">
        {/* Left Panel */}
        <div className="diet-left-panel">
          <div className="goal-list">
            {goalPlans.map((g, idx) => (
              <button
                key={g.key}
                className={`goal-btn${goalIdx === idx ? " selected" : ""}`}
                onClick={() => setGoalIdx(idx)}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="goal-summary-box">
            <span className="goal-summary-heading">About this Goal</span>
            <br />
            <span className="goal-summary-text">{goalPlans[goalIdx].summary}</span>
          </div>
        </div>
        {/* Right Panel */}
        <div className="diet-right-panel">
          <div className="diet-title">
            Diet &amp; Meal Plan
          </div>
          <ul className="meals-list">
            {goalPlans[goalIdx].meals.map((meal, i) => (
              <li
                key={`${meal.type}-${i}`}
                className="meal-list-item"
                style={{
                  borderBottom: i !== goalPlans[goalIdx].meals.length - 1
                    ? undefined : "none"
                }}
              >
                <span>
                  <strong className="meal-type">{meal.type}:</strong> {meal.desc}
                </span>
                {meal.cals ? (
                  <span className="meal-cals">
                    {meal.cals} kcal
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="diet-title" style={{ marginTop: 30, marginBottom: 8 }}>
            Recommended Workouts
          </div>
          <div className="workout-cards">
            {workouts.map((w) => (
              <div key={w.name} className="workout-card">
                <div className="workout-icon" style={{ marginBottom: 6 }}>
                  {w.icon}
                </div>
                <div className="workout-info">
                  <div className="workout-name">{w.name}</div>
                  <div className="workout-cats">
                    {w.burns.map(c => (
                      <span className="workout-cat" key={c}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDietPage;
