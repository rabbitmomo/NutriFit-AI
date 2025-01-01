import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

const Weekly = () => {
  const [recipes, setRecipes] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipesResponse = await fetch(
          "https://protected-citadel-60147-8c18822cbed9.herokuapp.com/latest-data-with-recipes"
        );
        const exercisesResponse = await fetch(
          "https://protected-citadel-60147-8c18822cbed9.herokuapp.com/latest-data-with-exercises"
        );

        const recipesData = await recipesResponse.json();
        const exercisesData = await exercisesResponse.json();

        setRecipes(recipesData.recipes || []); 
        setExercises(exercisesData.exercises || []); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMealsForDay = (day) => {
    if (!recipes || recipes.length === 0) {
      return []; 
    }
    return [
      recipes[(day * 3) % recipes.length], // Breakfast
      recipes[(day * 3 + 1) % recipes.length], // Lunch
      recipes[(day * 3 + 2) % recipes.length], // Dinner
    ];
  };

  const getExerciseForDay = (day) => {
    if (!exercises || exercises.length === 0) {
      return {}; 
    }
    return exercises[day % exercises.length]; // Exercise
  };

  const capitalizeWords = (text) => {
    return text
      .split(" ") 
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
      .join(" "); 
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Weekly Plan
      </Typography>

      {/* Displaying Day 1 to Day 7 */}
      {Array.from({ length: 7 }).map((_, day) => (
        <Box key={day} sx={{ marginBottom: 3, padding: 10 }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Day {day + 1}
          </Typography>

          <Grid container spacing={3}>
            {/* First Column: Meals (Breakfast, Lunch, Dinner) */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" align="center">
                Meals for the Day
              </Typography>
              <Grid container direction="column" spacing={2}>
                {getMealsForDay(day).map((meal, index) => (
                  <Grid item xs={12} key={meal.id || index}>
                    <Typography variant="subtitle2" align="center">
                      {index === 0
                        ? "Breakfast"
                        : index === 1
                        ? "Lunch"
                        : "Dinner"}
                    </Typography>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "450px", 
                        width: "100%", 
                        maxWidth: "100%", 
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="350" 
                        image={meal.image || "fallback-image-url.jpg"} 
                        alt={meal.title || "No title"}
                        sx={{ objectFit: "cover" }} 
                      />
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          height: "120px", 
                          overflow: "hidden",
                          padding: 1,
                        }}
                      >
                        <Link
                          to={`/recipe/${meal.id}`} 
                          style={{
                            textDecoration: "none", 
                            color: "blue", 
                            display: "block", 
                            overflow: "hidden",
                            textOverflow: "ellipsis", 
                            whiteSpace: "pre-line", 
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              overflow: "hidden", 
                              textOverflow: "ellipsis", 
                              whiteSpace: "pre-line", 
                              flexShrink: 0, 
                              marginBottom: "auto", 
                              "&:hover": {
                                color: "secondary.main", 
                                textDecoration: "underline", 
                              },
                            }}
                          >
                            {meal.title ? (meal.title.length > 50 ? (
                              <>
                                {meal.title.substring(0, 50)}
                                <br /> 
                                {meal.title.substring(50)}{" "}
                              </>
                            ) : (
                              meal.title
                            )) : "No title"}
                          </Typography>
                        </Link>
                        <Typography variant="body2" sx={{ marginTop: "auto" }}>
                          Likes: {meal.likes || "0"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                align="center"
                sx={{ marginBottom: 2.5 }}
              >
                Exercise for the Day
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="1050" 
                      image={getExerciseForDay(day).gifUrl || "fallback-image-url.gif"} 
                      alt={getExerciseForDay(day).name || "No exercise"}
                      sx={{ objectFit: "cover" }} 
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component={Link}
                        to={`/exercise/${getExerciseForDay(day).id}`} 
                        sx={{
                          textDecoration: "none",
                          color: "primary.main", 
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          "&:hover": {
                            color: "secondary.main", 
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {capitalizeWords(getExerciseForDay(day).name || "No exercise")}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Body Part:</strong>{" "}
                        {capitalizeWords(getExerciseForDay(day).bodyPart || "Not specified")}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Target:</strong>{" "}
                        {capitalizeWords(getExerciseForDay(day).target || "Not specified")}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Secondary Muscles:</strong>{" "}
                        {(getExerciseForDay(day).secondaryMuscles || [])
                          .map((muscle) => capitalizeWords(muscle))
                          .join(", ") || "None"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Instructions:</strong>
                        <ul>
                          {(getExerciseForDay(day).instructions || []).map(
                            (instruction, index) => (
                              <li key={index}>{instruction}</li>
                            )
                          )}
                        </ul>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default Weekly;
