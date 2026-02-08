import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import WinScreen from "../components/WinScreen";
import { useProfile } from "../context/ProfileContext";
import { speak, playSuccess, playError } from "../hooks/useSound";
import recipes from "../data/recipes";
import "./CookingGame.css";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

const TOTAL_RECIPES = 5;

export default function CookingGame() {
  const [allRecipes] = useState(() => shuffle(recipes).slice(0, TOTAL_RECIPES));
  const [recipeIdx, setRecipeIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const proc = useRef(false);
  const { addStar, addSticker } = useProfile();

  const recipe = allRecipes[recipeIdx];
  const currentStep = recipe?.steps[stepIdx];
  const totalSteps = allRecipes.reduce((sum, r) => sum + r.steps.length, 0);
  const completedSteps = completed.length;

  const shuffledIngredients = useMemo(() => {
    if (!recipe) return [];
    return shuffle(recipe.steps.map((s, i) => ({ ...s, id: i })));
  }, [recipe]);

  useEffect(() => {
    if (recipe && !isWon) {
      const t = setTimeout(() => speak(`Gotujemy: ${recipe.name}! ${currentStep?.instruction}`), 400);
      return () => clearTimeout(t);
    }
  }, [recipeIdx, recipe, isWon, currentStep]);

  useEffect(() => {
    if (currentStep && !isWon && stepIdx > 0) {
      const t = setTimeout(() => speak(currentStep.instruction), 300);
      return () => clearTimeout(t);
    }
  }, [stepIdx, currentStep, isWon]);

  const handlePick = useCallback((ing) => {
    if (feedback || isWon || proc.current) return;
    proc.current = true;

    if (ing.id === stepIdx) {
      setFeedback({ type: "correct", id: ing.id });
      playSuccess();
      setCompleted(prev => [...prev, { recipe: recipeIdx, step: stepIdx, ingredient: ing.ingredient }]);

      setTimeout(() => {
        const nextStep = stepIdx + 1;
        if (nextStep >= recipe.steps.length) {
          const nextRecipe = recipeIdx + 1;
          if (nextRecipe >= allRecipes.length) {
            setIsWon(true);
            addStar("cookingGame");
            addSticker("👨‍🍳");
          } else {
            setRecipeIdx(nextRecipe);
            setStepIdx(0);
            speak("Brawo! Następny przepis!");
          }
        } else {
          setStepIdx(nextStep);
        }
        setFeedback(null);
        proc.current = false;
      }, 800);
    } else {
      setFeedback({ type: "wrong", id: ing.id });
      playError();
      setTimeout(() => { setFeedback(null); proc.current = false; }, 600);
    }
  }, [feedback, isWon, stepIdx, recipeIdx, recipe, allRecipes, addStar, addSticker]);

  const restart = () => window.location.reload();

  if (isWon) return <div className="game-page game-page--cooking"><WinScreen onPlayAgain={restart} sticker="👨‍🍳" /></div>;

  return (
    <div className="game-page game-page--cooking">
      <BackButton />
      <div className="game-page__progress"><ProgressBar current={completedSteps} total={totalSteps} /></div>

      <div className="cooking-recipe">
        <span className="cooking-recipe__emoji">{recipe?.emoji}</span>
        <h3 className="cooking-recipe__name">{recipe?.name}</h3>
        <span className="cooking-recipe__counter">Przepis {recipeIdx + 1}/{allRecipes.length}</span>
      </div>

      <div className="cooking-bowl">
        {completed.filter(c => c.recipe === recipeIdx).map((c, i) => (
          <span key={i} className="cooking-bowl__item">{c.ingredient}</span>
        ))}
      </div>

      <div className="cooking-step">
        <span className="cooking-step__number">Krok {stepIdx + 1}:</span>
        <span className="cooking-step__text">{currentStep?.instruction}</span>
      </div>

      <div className="cooking-ingredients">
        {shuffledIngredients
          .filter(ing => ing.id >= stepIdx)
          .map(ing => (
            <button
              key={ing.id}
              className={`cooking-ing ${feedback?.type === "correct" && ing.id === feedback.id ? "cooking-ing--correct" : ""} ${feedback?.type === "wrong" && ing.id === feedback.id ? "cooking-ing--wrong" : ""}`}
              onClick={() => handlePick(ing)}
              disabled={!!feedback}
            >
              <span className="cooking-ing__emoji">{ing.ingredient}</span>
              <span className="cooking-ing__label">{ing.label}</span>
            </button>
          ))}
      </div>
    </div>
  );
}
