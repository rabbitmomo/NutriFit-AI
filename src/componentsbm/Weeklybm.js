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
import axios from "axios";
import "../css/weekly.css";

// Translate text to Bahasa Malaysia (BM)
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

const Weeklybm = () => {
  const [recipes, setRecipes] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translatedRecipes, setTranslatedRecipes] = useState([]);
  const [translatedExercises, setTranslatedExercises] = useState({
    names: [],
    bodyParts: [],
    targets: [],
    secondaryMuscles: [],
    instructions: [],
  });
  const [loadingText, setLoadingText] = useState("Memuatkan...");
  const [translationsLoaded, setTranslationsLoaded] = useState(false);

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

        const translatedRecipeTitles = await Promise.all(
          recipesData.recipes.map((meal) => bm(meal.title || ""))
        );
        const translatedExerciseNames = await Promise.all(
          exercisesData.exercises.map((exercise) => bm(exercise.name || ""))
        );
        const translatedBodyParts = await Promise.all(
          exercisesData.exercises.map((exercise) =>
            bm(exercise.bodyPart || "")
          )
        );
        const translatedTargets = await Promise.all(
          exercisesData.exercises.map((exercise) => bm(exercise.target || ""))
        );
        const translatedSecondaryMuscles = await Promise.all(
          exercisesData.exercises.map((exercise) =>
            bm(exercise.secondaryMuscles.join(", ") || "")
          )
        );
        const translatedInstructions = await Promise.all(
          exercisesData.exercises.map((exercise) =>
            Promise.all(
              exercise.instructions.map((instruction) => bm(instruction))
            )
          )
        );

        setTranslatedRecipes(translatedRecipeTitles);
        setTranslatedExercises({
          names: translatedExerciseNames,
          bodyParts: translatedBodyParts,
          targets: translatedTargets,
          secondaryMuscles: translatedSecondaryMuscles,
          instructions: translatedInstructions,
        });

        setTranslationsLoaded(true);
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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
      .join(" ");
  };

  if (loading || !translationsLoaded) {
    return (
      <Typography variant="h6" align="center">
        {loadingText}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          marginBottom: 2.5,
          fontSize: "3em",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        RANCANGAN MINGGUAN
      </Typography>

      {Array.from({ length: 7 }).map((_, day) => (
        <Box key={day} sx={{ marginBottom: 3, padding: 8 }}>
          <Typography
            variant="h5"
            sx={{
              marginBottom: 2.5,
              fontSize: "2em",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Hari {day + 1}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Grid container direction="column" spacing={2}>
                {getMealsForDay(day).map((meal, index) => (
                  <Grid item xs={12} key={meal.id || index}>
                    <Typography
                      variant="subtitle2"
                      align="center"
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "1.5em",
                        textAlign: "center",
                      }}
                    >
                      {index === 0
                        ? "Sarapan"
                        : index === 1
                        ? "Makan Tengahari"
                        : "Makan Malam"}
                    </Typography>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "450px",
                        width: "90%",
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
                            {translatedRecipes[index] || "Tiada tajuk"} {/* Use index for translated title */}
                          </Typography>
                        </Link>
                        <Typography variant="body2" sx={{ marginTop: "auto" }}>
                          Suka: {meal.likes || "0"}
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
                sx={{
                  marginBottom: 0.5,
                  fontSize: "1.5em",
                  textAlign: "center",
                }}
              >
                Latihan untuk Hari ini
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      textAlign: "center",
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
                          fontSize: "1.5rem",
                          "&:hover": {
                            color: "secondary.main",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {translatedExercises.names[day] || "Tiada latihan"} {/* Use day index */}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Bahagian Badan:</strong>{" "}
                        {translatedExercises.bodyParts[day] || "Tidak ditentukan"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Objektif:</strong>{" "}
                        {translatedExercises.targets[day] || "Tidak ditentukan"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Otot Sekunder:</strong>{" "}
                        {translatedExercises.secondaryMuscles[day] || "Tiada"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Arahan:</strong>
                        <ol>
                          {(translatedExercises.instructions[day] || []).map(
                            (instruction, index) => (
                              <li key={index}>{instruction}</li>
                            )
                          )}
                        </ol>
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

export default Weeklybm;
