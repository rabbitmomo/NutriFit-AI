import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get the exercise ID from the URL
import { Grid, Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

const capitalizeWords = (text) => {
  return text
    .split(' ') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
    .join(' '); 
};

const ExerciseId = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(
          `https://protected-citadel-60147-8c18822cbed9.herokuapp.com/exercise-data/${id}`
        );
        const data = await response.json();
        setExercise(data.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exercise:", error);
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  if (!exercise) {
    return <Typography variant="h6" align="center">No exercise found.</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Exercise Details
      </Typography>

      <Grid container justifyContent="center" spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <CardMedia
              component="img"
              height="400"
              image={exercise.gif_url || "https://via.placeholder.com/400"} // Fallback image
              alt={exercise.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                {capitalizeWords(exercise.name)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Body Part:</strong> {capitalizeWords(exercise.body_part)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Target:</strong> {capitalizeWords(exercise.target)}
              </Typography>
              {exercise.secondary_muscles?.length > 0 && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Secondary Muscles:</strong> {exercise.secondary_muscles.map(muscle => capitalizeWords(muscle)).join(", ")}
                </Typography>
              )}
              {exercise.instructions?.length > 0 && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Instructions:</strong>
                  <ul>
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExerciseId;
