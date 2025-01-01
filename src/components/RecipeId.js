import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook
import '../css/recipeid.css';

const DEFAULT_IMAGE = "https://via.placeholder.com/350x200?text=Image+Unavailable";

const RecipeId = () => {
  const { id } = useParams(); 
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`https://protected-citadel-60147-8c18822cbed9.herokuapp.com/recipe-data/${id}`)
      .then(response => response.json())
      .then(data => setRecipe(data))
      .catch(error => console.error('Error fetching recipe:', error));
  }, [id]); 

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <h2>{recipe.title}</h2>
        <img 
          src={recipe.image ? recipe.image : DEFAULT_IMAGE} 
          alt={recipe.title} 
          className="recipe-image" 
        />
      </div>
      <div className="recipe-info">
        <p><strong>Health Score:</strong> {recipe.healthScore}</p>
        <p><strong>Preparation Time:</strong> {recipe.readyInMinutes} minutes</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
        <p><strong>Dietary Preferences:</strong> {recipe.diets.join(', ')}</p>
      </div>
      <div className="recipe-ingredients">
        <h3>Ingredients</h3>
        <ul>
          {recipe.extendedIngredients.map((ingredient, index) => (
            <li key={index}>
              <img 
                src={ingredient.image ? `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}` : DEFAULT_IMAGE} 
                alt={ingredient.name} 
                className="ingredient-image" 
              />
              <span>{ingredient.amount} {ingredient.unit} of {ingredient.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="recipe-instructions">
        <h3>Instructions</h3>
        <ol>
          {recipe.analyzedInstructions[0]?.steps.map((step, index) => (
            <li key={index}>
              {step.step}
            </li>
          ))}
        </ol>
      </div>
      <div className="recipe-footer">
        <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">See full recipe on Foodista</a>
      </div>
    </div>
  );
};

export default RecipeId;
