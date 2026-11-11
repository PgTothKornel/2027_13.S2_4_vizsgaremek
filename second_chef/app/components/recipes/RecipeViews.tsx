"use client";

import { recipes } from "@/app/lib/demo-data";
import { useChef } from "../SecondChefProvider";
import RecipeCard from "./RecipeCard";

const filters = [
  ["all", "Neked ajánljuk"],
  ["quick", "30 perc alatt"],
  ["high-protein", "Magas fehérje"],
  ["vegetarian", "Húsmentes"],
];

export function DiscoverView() {
  const { filter, setFilter, search, setSearch } = useChef();
  const term = search.toLocaleLowerCase("hu");
  const list = recipes.filter(
    (recipe) =>
      (filter === "all" || recipe.tags.includes(filter)) &&
      (!term ||
        `${recipe.title} ${recipe.type} ${recipe.ingredients.map((item) => item[0]).join(" ")}`
          .toLocaleLowerCase("hu")
          .includes(term)),
  );
  return (
    <>
      <header className="app-heading flex justify-between items-end mb-10 [&_h1]:font-display [&_h1]:text-[clamp(3rem,5.5vw,5.5rem)] [&_h1]:leading-[.9] [&_h1]:font-normal [&_h1]:mt-0 [&_h1]:mx-0 [&_h1]:mb-3.5 [&_h1]:tracking-[-.04em] [&_p]:mt-0 max-[680px]:items-start max-[680px]:gap-3 max-[680px]:grid max-[680px]:grid-cols-[minmax(0,1fr)_auto] max-[680px]:[&_h1]:text-[3.5rem] max-[680px]:[&_.filter-button]:[flex:0_0_auto] max-[680px]:[&_.filter-button]:py-2.5 max-[680px]:[&_.filter-button]:px-[13px] [&>div]:min-w-0 max-[680px]:[&_.muted]:whitespace-normal max-[680px]:[&_.muted]:[overflow-wrap:anywhere]">
        <div>
          <p className="eyebrow uppercase text-[.75rem] tracking-[.18em] font-bold mt-0 mx-0 mb-4.5 [&.dark]:text-sand dark">
            Személyre szabva
          </p>
          <h1>Mit főzzünk ma?</h1>
          <p className="muted text-[#637174]">
            {list.length} recept illik a keresésedhez és a szűrőidhez.
          </p>
        </div>
        <button
          className="filter-button [border:1px_solid_var(--color-line)] bg-cream py-3 px-4.5 rounded-full cursor-pointer font-semibold [&_span]:bg-sand [&_span]:text-white [&_span]:rounded-[20px] [&_span]:py-0.5 [&_span]:px-[7px] [&_span]:ml-1.5"
          onClick={() => {
            setFilter("all");
            setSearch("");
          }}
        >
          Szűrők törlése
        </button>
      </header>
      <div className="quick-filters flex gap-2 overflow-auto pb-4.5 [&_button]:[border:1px_solid_var(--color-line)] [&_button]:bg-transparent [&_button]:rounded-full [&_button]:py-2.5 [&_button]:px-4 [&_button]:whitespace-nowrap [&_button]:cursor-pointer [&_button.active]:bg-deep [&_button.active]:text-white">
        {filters.map(([value, label]) => (
          <button
            key={value}
            className={filter === value ? "active" : ""}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {search && (
        <p>
          Keresés: {search}{" "}
          <button
            className="subtle-button [border:1px_solid_var(--color-line)] bg-cream py-3 px-4.5 rounded-full cursor-pointer font-semibold"
            onClick={() => setSearch("")}
          >
            Törlés
          </button>
        </p>
      )}
      <div className="discover-grid grid grid-cols-3 gap-5 [&_.recipe-card_.image-wrap]:h-[250px] [&_.recipe-card_h3]:text-[1.7rem] max-[980px]:grid-cols-2 max-[680px]:grid-cols-1 max-[680px]:[&_.recipe-card_.image-wrap]:h-[300px]">
        {list.length ? (
          list.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
        ) : (
          <div className="empty-state text-center py-17.5 px-5 bg-cream rounded-3xl [&_span]:font-display [&_span]:text-[4rem] [&_span]:text-sand">
            <span>⌕</span>
            <h2>Nincs találat.</h2>
            <p>Próbálj más kifejezést vagy szűrőt.</p>
          </div>
        )}
      </div>
    </>
  );
}

export function FavoritesView() {
  const { favorites } = useChef();
  const list = recipes.filter((recipe) => favorites.includes(recipe.id));
  return (
    <>
      <header className="app-heading flex justify-between items-end mb-10 [&_h1]:font-display [&_h1]:text-[clamp(3rem,5.5vw,5.5rem)] [&_h1]:leading-[.9] [&_h1]:font-normal [&_h1]:mt-0 [&_h1]:mx-0 [&_h1]:mb-3.5 [&_h1]:tracking-[-.04em] [&_p]:mt-0 max-[680px]:items-start max-[680px]:gap-3 max-[680px]:grid max-[680px]:grid-cols-[minmax(0,1fr)_auto] max-[680px]:[&_h1]:text-[3.5rem] max-[680px]:[&_.filter-button]:[flex:0_0_auto] max-[680px]:[&_.filter-button]:py-2.5 max-[680px]:[&_.filter-button]:px-[13px] [&>div]:min-w-0 max-[680px]:[&_.muted]:whitespace-normal max-[680px]:[&_.muted]:[overflow-wrap:anywhere]">
        <div>
          <p className="eyebrow uppercase text-[.75rem] tracking-[.18em] font-bold mt-0 mx-0 mb-4.5 [&.dark]:text-sand dark">
            Elmentve későbbre
          </p>
          <h1>Kedvencek</h1>
          <p className="muted text-[#637174]">
            A szívecskével mentett receptjeid egy helyen.
          </p>
        </div>
      </header>
      <div className="discover-grid grid grid-cols-3 gap-5 [&_.recipe-card_.image-wrap]:h-[250px] [&_.recipe-card_h3]:text-[1.7rem] max-[980px]:grid-cols-2 max-[680px]:grid-cols-1 max-[680px]:[&_.recipe-card_.image-wrap]:h-[300px]">
        {list.length ? (
          list.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
        ) : (
          <div className="empty-state text-center py-17.5 px-5 bg-cream rounded-3xl [&_span]:font-display [&_span]:text-[4rem] [&_span]:text-sand">
            <span>♡</span>
            <h2>Még nincs itt semmi.</h2>
            <p>Ments el egy receptet a Felfedezés oldalon.</p>
            <a
              className="pill-button inline-flex items-center justify-center border-0 rounded-full py-[15px] px-[23px] font-bold bg-deep text-cream cursor-pointer [transition:transform_.3s_var(--ease-chef),background_.3s] hover:[transform:translateY(-2px)_scale(1.015)] [&.small]:py-[11px] [&.small]:px-4.5 [&.small]:text-[.86rem] [&.coral]:bg-sand [&.coral:hover]:bg-[#aa5c42] coral"
              href="#discover"
            >
              Receptek felfedezése
            </a>
          </div>
        )}
      </div>
    </>
  );
}
