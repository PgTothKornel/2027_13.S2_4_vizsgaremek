'use client';

import { recipes } from '@/app/lib/demo-data';
import { useChef } from '../SecondChefProvider';
import RecipeCard from './RecipeCard';

const filters = [['all', 'Neked ajánljuk'], ['quick', '30 perc alatt'], ['high-protein', 'Magas fehérje'], ['vegetarian', 'Húsmentes']];

export function DiscoverView() {
  const { filter, setFilter, search, setSearch } = useChef();
  const term = search.toLocaleLowerCase('hu');
  const list = recipes.filter(recipe => (filter === 'all' || recipe.tags.includes(filter)) && (!term || `${recipe.title} ${recipe.type} ${recipe.ingredients.map(item => item[0]).join(' ')}`.toLocaleLowerCase('hu').includes(term)));
  return <>
    <header className="app-heading"><div><p className="eyebrow dark">Személyre szabva</p><h1>Mit főzzünk ma?</h1><p className="muted">{list.length} recept illik a keresésedhez és a szűrőidhez.</p></div><button className="filter-button" onClick={() => { setFilter('all'); setSearch(''); }}>Szűrők törlése</button></header>
    <div className="quick-filters">{filters.map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
    {search && <p>Keresés: {search} <button className="subtle-button" onClick={() => setSearch('')}>Törlés</button></p>}
    <div className="discover-grid">{list.length ? list.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />) : <div className="empty-state"><span>⌕</span><h2>Nincs találat.</h2><p>Próbálj más kifejezést vagy szűrőt.</p></div>}</div>
  </>;
}

export function FavoritesView() {
  const { favorites } = useChef();
  const list = recipes.filter(recipe => favorites.includes(recipe.id));
  return <>
    <header className="app-heading"><div><p className="eyebrow dark">Elmentve későbbre</p><h1>Kedvencek</h1><p className="muted">A szívecskével mentett receptjeid egy helyen.</p></div></header>
    <div className="discover-grid">{list.length ? list.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />) : <div className="empty-state"><span>♡</span><h2>Még nincs itt semmi.</h2><p>Ments el egy receptet a Felfedezés oldalon.</p><a className="pill-button coral" href="#discover">Receptek felfedezése</a></div>}</div>
  </>;
}
