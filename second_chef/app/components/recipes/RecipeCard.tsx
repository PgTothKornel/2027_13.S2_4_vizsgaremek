'use client';

import type { Recipe } from '@/app/lib/demo-data';
import { useChef } from '../SecondChefProvider';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { favorites, toggleFavorite, setSelectedRecipe } = useChef();
  const saved = favorites.includes(recipe.id);
  return <article className="recipe-card" tabIndex={0} aria-label={`${recipe.title} recept megnyitása`} onClick={() => setSelectedRecipe(recipe)} onKeyDown={event => {
    if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setSelectedRecipe(recipe); }
  }}>
    <button className={`heart-button${saved ? ' saved' : ''}`} aria-label={saved ? 'Eltávolítás a kedvencekből' : 'Mentés a kedvencekhez'} aria-pressed={saved} onClick={event => { event.stopPropagation(); toggleFavorite(recipe.id); }}>{saved ? '♥' : '♡'}</button>
    <div className={`image-wrap${recipe.image ? '' : ' placeholder'}`}>
      {recipe.image ? <img src={recipe.image} alt={recipe.title} loading="lazy" /> : <span>{recipe.title.charAt(0)}</span>}
      <div className="match-chip">{recipe.match}% egyezés</div>
    </div>
    <div className="recipe-body"><div className="recipe-topline"><span>{recipe.type}</span><span>{recipe.time} perc</span></div><h3>{recipe.title}</h3><div className="recipe-meta"><span>{recipe.kcal} kcal</span><span>{recipe.protein} g fehérje</span><span>{recipe.servings} adag</span></div></div>
  </article>;
}
