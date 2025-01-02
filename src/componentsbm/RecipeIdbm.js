import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/recipeid.css';

const DEFAULT_IMAGE = "https://via.placeholder.com/350x200?text=Image+Unavailable";

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

const RecipeIdbm = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [translatedHeader, setTranslatedHeader] = useState({});
  const [translatedRecipe, setTranslatedRecipe] = useState({});

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`https://protected-citadel-60147-8c18822cbed9.herokuapp.com/recipe-data/${id}`);
        const data = await response.json();
        setRecipe(data);

        const translatedIngredients = await Promise.all(
          data.extendedIngredients.map(async (ingredient) => ({
            ...ingredient,
            name: await bm(ingredient.name),
          }))
        );

        const translatedSteps = await Promise.all(
          data.analyzedInstructions[0]?.steps.map(async (step) => ({
            ...step,
            step: await bm(step.step),
          })) || []
        );

        const translatedDiets = await Promise.all(data.diets.map(bm));

        setTranslatedRecipe({
          ...data,
          title: await bm(data.title),
          diets: translatedDiets,
          extendedIngredients: translatedIngredients,
          analyzedInstructions: [
            {
              ...data.analyzedInstructions[0],
              steps: translatedSteps,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    const fetchTranslations = async () => {
      const translatedLoadingText = await bm("Loading...");
      setLoadingText(translatedLoadingText);

      setTranslatedHeader({
        healthScore: await bm("Health Score"),
        preparationTime: await bm("Preparation Time"),
        servings: await bm("Servings"),
        dietaryPreferences: await bm("Dietary Preferences"),
        ingredients: await bm("Ingredients"),
        instructions: await bm("Instructions"),
        fullRecipe: await bm("See full recipe on Foodista"),
      });
    };

    fetchRecipe();
    fetchTranslations();
  }, [id]);

  if (!recipe || Object.keys(translatedHeader).length === 0) {
    return (
      <div className="loading-container">
        {loadingText}
      </div>
    );
  }

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <h2>{translatedRecipe.title}</h2>
        <img
          src={recipe.image ? recipe.image : DEFAULT_IMAGE}
          alt={translatedRecipe.title}
          className="recipe-image"
        />
      </div>
      <div className="recipe-info">
        <p><strong>{translatedHeader.healthScore}:</strong> {recipe.healthScore}</p>
        <p><strong>{translatedHeader.preparationTime}:</strong> {recipe.readyInMinutes} minit</p>
        <p><strong>{translatedHeader.servings}:</strong> {recipe.servings}</p>
        <p><strong>{translatedHeader.dietaryPreferences}:</strong> {translatedRecipe.diets.join(', ')}</p>
      </div>
      <div className="recipe-ingredients">
        <h3>{translatedHeader.ingredients}</h3>
        <ul>
          {translatedRecipe.extendedIngredients.map((ingredient, index) => (
            <li key={index}>
              <img
                src={ingredient.image ? `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}` : DEFAULT_IMAGE}
                alt={ingredient.name}
                className="ingredient-image"
              />
              <span>{ingredient.amount} {ingredient.unit} daripada {ingredient.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="recipe-instructions">
        <h3>{translatedHeader.instructions}</h3>
        <ol>
          {translatedRecipe.analyzedInstructions[0]?.steps.map((step, index) => (
            <li key={index}>
              {step.step}
            </li>
          ))}
        </ol>
      </div>
      <div className="recipe-footer">
        <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
          {translatedHeader.fullRecipe}
        </a>
      </div>
    </div>
  );
};

export default RecipeIdbm;
