import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./components/UserPage";
import Sidebar from "./components/Sidebar";
import Sidebarbm from "./componentsbm/Sidebarbm"; // Import Sidebarbm
import Header from "./components/Header";
import Weekly from "./components/Weekly";
import Recipe from "./components/Recipe";
import Exercise from "./components/Exercise";
import ExerciseId from "./components/ExerciseId";
import RecipeId from "./components/RecipeId";
import Nutrition from "./components/Nutrition";
import Exercisebm from "./componentsbm/Exercisebm";
import ExerciseIdbm from "./componentsbm/ExerciseIdbm";
import Recipebm from "./componentsbm/Recipebm";
import RecipeIdbm from "./componentsbm/RecipeIdbm";
import Nutritionbm from "./componentsbm/Nutritionbm";
import Weeklybm from "./componentsbm/Weeklybm";
import UserPagebm from "./componentsbm/UserPagebm";

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation(); 

  const isBMRoute = location.pathname.includes('/bm');

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
        {isBMRoute ? <Sidebarbm /> : <Sidebar />}
        
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
            
            {/* bm route */}
            <Route path="/bm/" element={<UserPagebm />} />
            <Route path="/bm/userpage" element={<UserPagebm />} />
            <Route path="/bm/weekly" element={<Weeklybm />} />
            <Route path="/bm/nutrition" element={<Nutritionbm />} />
            <Route path="/bm/recipe/:id" element={<RecipeIdbm />} />
            <Route path="/bm/recipe" element={<Recipebm />} />
            <Route path="/bm/exercise" element={<Exercisebm />} />
            <Route path="/bm/exercise/:id" element={<ExerciseIdbm />} />
            <Route path="/bm/nutrition" element={<Nutritionbm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
