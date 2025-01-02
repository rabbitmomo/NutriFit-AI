import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, CardMedia } from '@mui/material';
import axios from 'axios';

const bm = async (text) => {
  try {
    const response = await axios.post(
      "https://protected-citadel-60147-8c18822cbed9.herokuapp.com/translate-to-bm",
      { text: text }
    );
    return response.data.translatedText || text;
  } catch (err) {
    console.error("Translation error", err);
    return text;
  }
};

const capitalizeWords = (text) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Nutritionbm = () => {
  const [nutritionData, setNutritionData] = useState([]);
  const [translatedHeaders, setTranslatedHeaders] = useState(null); // Start as null to detect loading state
  const [loadingText, setLoadingText] = useState("Memuatkan data pemakanan...");

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await fetch(
          "https://protected-citadel-60147-8c18822cbed9.herokuapp.com/latest-nutrition"
        );
        const data = await response.json();

        const translatedData = await Promise.all(
          data.map(async (food) => ({
            ...food,
            food_name: await bm(food.food_name),
          }))
        );

        setNutritionData(translatedData);
      } catch (error) {
        console.error("Error fetching nutrition data:", error);
      }
    };

    const translateHeaders = async () => {
      try {
        setLoadingText(await bm("Loading nutrition data..."));
        setTranslatedHeaders({
          latestNutrition: await bm("Latest Nutrition Information"),
          calories: await bm("Calories"),
          totalFat: await bm("Total Fat"),
          saturatedFat: await bm("Saturated Fat"),
          sodium: await bm("Sodium"),
          carbohydrates: await bm("Carbohydrates"),
          protein: await bm("Protein"),
          potassium: await bm("Potassium"),
        });
      } catch (error) {
        console.error("Error translating headers:", error);
      }
    };

    fetchNutritionData();
    translateHeaders();
  }, []);

  if (!translatedHeaders) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h6">{loadingText}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        {translatedHeaders.latestNutrition}
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
                    <strong>{translatedHeaders.calories}:</strong> {food.calories} kcal
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>{translatedHeaders.totalFat}:</strong> {food.total_fat} g
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>{translatedHeaders.saturatedFat}:</strong> {food.saturated_fat} g
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>{translatedHeaders.sodium}:</strong> {food.sodium} mg
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>{translatedHeaders.carbohydrates}:</strong> {food.total_carbohydrate} g
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>{translatedHeaders.protein}:</strong> {food.protein} g
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>{translatedHeaders.potassium}:</strong> {food.potassium} mg
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" align="center">
            {loadingText}
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Nutritionbm;
