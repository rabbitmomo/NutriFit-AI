import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, Card, CardContent, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const capitalizeWords = (text) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const bm = async (text) => {
  try {
    const response = await axios.post("https://protected-citadel-60147-8c18822cbed9.herokuapp.com/translate-to-bm", {
      text: text,
    });
    return response.data.translatedText || text;
  } catch (err) {
    console.error("Translation error", err);
    return text;
  }
};

const Recipebm = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translatedTitle, setTranslatedTitle] = useState("");  // For translating the title "Latest Meals"
  const [translatedLoading, setTranslatedLoading] = useState("");  // For translating "Loading..."
  const [translatedLikes, setTranslatedLikes] = useState(""); // For translating "Likes"
  const [translatedMealTitles, setTranslatedMealTitles] = useState([]); // For translating meal titles

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(
          "https://protected-citadel-60147-8c18822cbed9.herokuapp.com/latest-meal-data"
        );
        const data = await response.json();
        setMeals(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meals:", error);
        setLoading(false);
      }
    };

    const fetchTranslations = async () => {
      setTranslatedTitle(await bm("Latest Meals"));
      setTranslatedLoading(await bm("Loading..."));
      setTranslatedLikes(await bm("Likes"));

      const translatedTitles = await Promise.all(
        meals.map((meal) => bm(meal.title))
      );
      setTranslatedMealTitles(translatedTitles);
    };

    fetchMeals();
    fetchTranslations();
  }, []);

  useEffect(() => {
    if (meals.length > 0) {
      const translateMealTitles = async () => {
        const translatedTitles = await Promise.all(
          meals.map((meal) => bm(meal.title))
        );
        setTranslatedMealTitles(translatedTitles);
      };

      translateMealTitles();
    }
  }, [meals]);

  if (loading) {
    return <Typography variant="h6" align="center">{translatedLoading || "Loading..."}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        {translatedTitle || "Latest Meals"}
      </Typography>

      <Grid container spacing={3}>
        {meals.map((meal, index) => (
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
                    {capitalizeWords(translatedMealTitles[index] || meal.title)}
                  </Typography>
                </Link>
                <Typography variant="body2">
                  {`${translatedLikes || "Likes"}: ${meal.likes}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Recipebm;
