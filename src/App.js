import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserPage from "./components/UserPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Weekly from "./components/Weekly";
import Recipe from "./components/Recipe";
import Exercise from "./components/Exercise";
import ExerciseId from "./components/ExerciseId";
import RecipeId from "./components/RecipeId";
import Nutrition from "./components/Nutrition";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />

        <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
          <Sidebar />
          <div
            style={{
              flex: 1,
              marginLeft: "20px", 
              overflowY: "auto", 
            }}
          >
            <Routes>
              <Route path="/" element={<UserPage />} />
              <Route path="/userpage" element={<UserPage />} />
              <Route path="/weekly" element={<Weekly />} />
              <Route path="/recipe" element={<Recipe />} />
              <Route path="/recipe/:id" element={<RecipeId />} />
              <Route path="/exercise" element={<Exercise />} />
              <Route path="/exercise/:id" element={<ExerciseId />} />
              <Route path="/nutrition" element={<Nutrition />} />
              {/* can add more routes here */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
