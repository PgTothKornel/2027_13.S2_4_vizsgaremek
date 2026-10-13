'use client';

import { useState } from 'react';
import type { Recipe } from '@/app/lib/demo-data';
import { useChef } from '../SecondChefProvider';
import Modal from '../Modal';

function RecipeDetails({ recipe }: { recipe: Recipe }) {
  const { favorites, toggleFavorite, shopping, setShopping, notify } = useChef();
  const [servings, setServings] = useState(recipe.servings);
  const factor = servings / recipe.servings;
  function addMissing() {
    const missing = recipe.ingredients.filter(([name, , , has]) => !has && !shopping.some(item => item.name === name && !item.bought));
    setShopping(current => [...current, ...missing.map(([name, qty, unit], index) => ({ id: Date.now() + index, name, qty: `${Number((qty * factor).toFixed(1))} ${unit}`, source: recipe.title, bought: false }))]);
    notify(missing.length ? `${missing.length} tétel a bevásárlólistán` : 'Ezek már a listán vannak');
  }
  return <div className="recipe-modal-grid">
    <div className="recipe-modal-image">{recipe.image ? <img src={recipe.image} alt={recipe.title} /> : <div className="image-wrap placeholder"><span>{recipe.title[0]}</span></div>}</div>
    <div className="recipe-modal-copy"><p className="eyebrow">{recipe.type}</p><h2>{recipe.title}</h2><p>{recipe.description}</p>
      <div className="modal-meta"><span>◷ {recipe.time} perc</span><span>◉ {recipe.kcal} kcal / adag</span><span>● {recipe.protein} g fehérje</span></div>
      <div className="serving-control"><span>Adagok száma</span><div><button aria-label="Adag csökkentése" disabled={servings <= 1} onClick={() => setServings(value => Math.max(1, value - 1))}>−</button><strong>{servings}</strong><button aria-label="Adag növelése" disabled={servings >= 20} onClick={() => setServings(value => Math.min(20, value + 1))}>+</button></div></div>
      <ul className="ingredients">{recipe.ingredients.map(([name, qty, unit, has]) => <li key={name}><span>{has ? '●' : '○'} {name}</span><strong>{Number((qty * factor).toFixed(1))} {unit}</strong></li>)}</ul>
      <p className="safety-note">● megvan a kamrában · ○ hiányzik vagy a mennyiség nem ellenőrizhető</p>
      <div className="modal-actions"><button className="pill-button coral" onClick={addMissing}>Hiányzók a listára</button><button className="subtle-button" onClick={() => toggleFavorite(recipe.id)}>{favorites.includes(recipe.id) ? '♥ Mentve' : '♡ Mentés'}</button></div>
    </div>
  </div>;
}

export default function RecipeModal() {
  const { selectedRecipe, setSelectedRecipe } = useChef();
  return <Modal open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} label={selectedRecipe?.title ?? 'Recept'}>{selectedRecipe && <RecipeDetails key={selectedRecipe.id} recipe={selectedRecipe} />}</Modal>;
}
