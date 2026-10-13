import { recipes } from '@/app/lib/demo-data';
import RecipeCard from '../recipes/RecipeCard';

export default function RecipeShowcase() {
  return <section className="recipe-showcase">
    <div className="showcase-head section-pad"><div><div className="section-kicker reveal"><span>04</span> Mai inspiráció</div><h2 className="display-heading reveal">Három ötlet.<br />Egy könnyebb döntés.</h2></div><a href="#discover" className="round-link" aria-label="Összes recept megnyitása">Összes<br />recept <span>↗</span></a></div>
    <div className="recipe-rail section-pad">{recipes.slice(0, 3).map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
  </section>;
}
