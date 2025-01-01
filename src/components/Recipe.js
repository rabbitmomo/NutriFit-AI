import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, Card, CardContent, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";

const capitalizeWords = (text) => {
  return text
    .split(" ") 
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ) 
    .join(" "); 
};

const Recipe = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(
          "https://polar-hamlet-33806-0d6c04df531d.herokuapp.com/latest-meal-data"
        );
        const data = await response.json();
        setMeals(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meals:", error);
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Latest Meals
      </Typography>

      <Grid container spacing={3}>
        {meals.map((meal) => (
          <Grid item xs={12} sm={4} key={meal.id}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component="img"
                height="200"
                image={meal.image}
                alt={meal.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Link to={`/recipe/${meal.id}`} style={{ textDecoration: "none" }}>
                  <Typography variant="h6" noWrap>
                    {capitalizeWords(meal.title)}
                  </Typography>
                </Link>
                <Typography variant="body2">Likes: {meal.likes}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Recipe;
