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

const capitalizeWords = (text) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const capitalizeSentence = (sentence) => {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
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

const Exercisebm = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translatedTexts, setTranslatedTexts] = useState({});

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(
          "https://protected-citadel-60147-8c18822cbed9.herokuapp.com/latest-exercise-data"
        );
        const data = await response.json();
        setExercises(data.data);
        setLoading(false);

        const translatedData = {};
        for (let exercise of data.data) {
          translatedData[exercise.id] = {
            name: await bm(exercise.name),
            body_part: await bm(exercise.body_part),
            target: await bm(exercise.target),
            secondary_muscles: await Promise.all(
              exercise.secondary_muscles.map((muscle) => bm(muscle))
            ),
            instructions: await Promise.all(
              exercise.instructions.map((instruction) => bm(instruction))
            ),
          };
        }
        setTranslatedTexts(translatedData);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const translateStaticText = (text) => {
    const translations = {
      "Body Part": "Bahagian Badan",
      "Target": "Sasaran",
      "Secondary Muscles": "Otot Sekunder",
      "Instructions": "Arahan",
      "Loading...": "Memuatkan...",
      "Latest Exercises": "Latihan Terbaru",
    };
    return translations[text] || text;
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        {translateStaticText("Loading...")}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        {translatedTexts["header"] ? translatedTexts["header"] : translateStaticText("Latest Exercises")}
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
                  {capitalizeSentence(translatedTexts[exercise.id]?.name || capitalizeWords(exercise.name))}
                </Typography>
                
                <Typography variant="body2" color="textSecondary">
                  <strong>{translateStaticText("Body Part")}:</strong>{" "}
                  {capitalizeSentence(translatedTexts[exercise.id]?.body_part || capitalizeWords(exercise.body_part))}
                </Typography>
                
                <Typography variant="body2" color="textSecondary">
                  <strong>{translateStaticText("Target")}:</strong> {capitalizeSentence(translatedTexts[exercise.id]?.target || capitalizeWords(exercise.target))}
                </Typography>
                
                <Typography variant="body2" color="textSecondary">
                  <strong>{translateStaticText("Secondary Muscles")}:</strong>{" "}
                  {translatedTexts[exercise.id]?.secondary_muscles
                    ? translatedTexts[exercise.id]?.secondary_muscles.map((muscle) => capitalizeWords(muscle)).join(", ")
                    : exercise.secondary_muscles.map((muscle) => capitalizeWords(muscle)).join(", ")}
                </Typography>
                
                <Typography variant="body2" color="textSecondary">
                  <strong>{translateStaticText("Instructions")}:</strong>
                  <ul>
                    {translatedTexts[exercise.id]?.instructions
                      ? translatedTexts[exercise.id]?.instructions.map((instruction, index) => (
                          <li key={index}>{capitalizeSentence(instruction)}</li>
                        ))
                      : exercise.instructions.map((instruction, index) => (
                          <li key={index}>{capitalizeSentence(instruction)}</li>
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

export default Exercisebm;
