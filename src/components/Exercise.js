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

const capitalizeWords = (text) => {
  return text
    .split(" ") 
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
    .join(" "); 
};

const Exercise = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(
          "https://protected-citadel-60147-8c18822cbed9.herokuapp.com/latest-exercise-data"
        );
        const data = await response.json();
        setExercises(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

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
        Latest Exercises
      </Typography>

      <Grid container spacing={3}>
        {exercises.map((exercise) => (
          <Grid item xs={12} sm={4} key={exercise.id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                borderRadius: "16px",
                boxShadow: 2,
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                height="400"
                image={exercise.gif_url}
                alt={exercise.name}
                sx={{
                  objectFit: "cover",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  component={Link}
                  to={`/exercise/${exercise.id}`} 
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
                  {capitalizeWords(exercise.name)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Body Part:</strong>{" "}
                  {capitalizeWords(exercise.body_part)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Target:</strong> {capitalizeWords(exercise.target)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Secondary Muscles:</strong>{" "}
                  {exercise.secondary_muscles
                    .map((muscle) => capitalizeWords(muscle))
                    .join(", ")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Instructions:</strong>
                  <ul>
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Exercise;
