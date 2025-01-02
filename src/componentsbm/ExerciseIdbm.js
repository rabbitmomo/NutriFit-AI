import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
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

const translateStaticText = (text) => {
  const translations = {
    "Body Part": "Bahagian Badan",
    "Target": "Sasaran",
    "Secondary Muscles": "Otot Sekunder",
    "Instructions": "Arahan",
    "Loading...": "Memuatkan...",
    "Exercise Details": "Butiran Latihan",
  };
  return translations[text] || text;
};

const ExerciseIdbm = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translatedExercise, setTranslatedExercise] = useState(null);
  const [translatedTitle, setTranslatedTitle] = useState("");

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(
          `https://protected-citadel-60147-8c18822cbed9.herokuapp.com/exercise-data/${id}`
        );
        const data = await response.json();
        setExercise(data.data);

        // Translate exercise data after fetching
        const translatedData = {
          name: await bm(data.data.name),
          body_part: await bm(data.data.body_part),
          target: await bm(data.data.target),
          secondary_muscles: await Promise.all(
            data.data.secondary_muscles.map((muscle) => bm(muscle))
          ),
          instructions: await Promise.all(
            data.data.instructions.map((instruction) => bm(instruction))
          ),
        };

        setTranslatedExercise(translatedData);
        setTranslatedTitle(await bm("Exercise Details")); // Translate title to BM
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exercise:", error);
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  if (loading) {
    return <Typography variant="h6" align="center">{translateStaticText("Loading...")}</Typography>;
  }

  if (!exercise || !translatedExercise) {
    return <Typography variant="h6" align="center">{translateStaticText("No exercise found")}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        {translatedTitle || translateStaticText("Exercise Details")}
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
                {capitalizeSentence(translatedExercise.name || capitalizeWords(exercise.name))}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>{translateStaticText("Body Part")}:</strong> {capitalizeSentence(translatedExercise.body_part || capitalizeWords(exercise.body_part))}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>{translateStaticText("Target")}:</strong> {capitalizeSentence(translatedExercise.target || capitalizeWords(exercise.target))}
              </Typography>
              {exercise.secondary_muscles?.length > 0 && (
                <Typography variant="body2" color="textSecondary">
                  <strong>{translateStaticText("Secondary Muscles")}:</strong> {translatedExercise.secondary_muscles
                    ? translatedExercise.secondary_muscles.map((muscle) => capitalizeWords(muscle)).join(", ")
                    : exercise.secondary_muscles.map((muscle) => capitalizeWords(muscle)).join(", ")}
                </Typography>
              )}
              {exercise.instructions?.length > 0 && (
                <Typography variant="body2" color="textSecondary">
                  <strong>{translateStaticText("Instructions")}:</strong>
                  <ul>
                    {translatedExercise.instructions
                      ? translatedExercise.instructions.map((instruction, index) => (
                          <li key={index}>{capitalizeSentence(instruction)}</li>
                        ))
                      : exercise.instructions.map((instruction, index) => (
                          <li key={index}>{capitalizeSentence(instruction)}</li>
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

export default ExerciseIdbm;
