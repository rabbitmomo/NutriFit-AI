import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, CardMedia } from '@mui/material';

const capitalizeWords = (text) => {
  return text
    .split(" ") 
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ) 
    .join(" "); 
};

const Nutrition = () => {
  const [nutritionData, setNutritionData] = useState([]);
  
  // Fetch the latest nutrition data
  useEffect(() => {
    fetch('https://polar-hamlet-33806-0d6c04df531d.herokuapp.com/latest-nutrition')
      .then((response) => response.json())
      .then((data) => setNutritionData(data))
      .catch((error) => console.error('Error fetching nutrition data:', error));
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Latest Nutrition Information
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {nutritionData.length > 0 ? (
          nutritionData.map((food) => (
            <Grid item xs={12} sm={4} md={3} key={food.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200" 
                  image={food.image_url} 
                  alt={food.food_name}
                  sx={{
                    objectFit: 'contain', 
                    width: '100%', 
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    {capitalizeWords(food.food_name)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Calories:</strong> {food.calories} kcal
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Total Fat:</strong> {food.total_fat} g
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Saturated Fat:</strong> {food.saturated_fat} g
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Sodium:</strong> {food.sodium} mg
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Carbohydrates:</strong> {food.total_carbohydrate} g
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Protein:</strong> {food.protein} g
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Potassium:</strong> {food.potassium} mg
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" align="center">
            Loading nutrition data...
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Nutrition;
