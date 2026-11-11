"use client";

import type { Recipe } from "@/app/lib/demo-data";
import { useChef } from "../SecondChefProvider";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { favorites, toggleFavorite, setSelectedRecipe } = useChef();
  const saved = favorites.includes(recipe.id);
  return (
    <article
      className="recipe-card relative bg-cream rounded-[26px] overflow-hidden cursor-pointer min-w-0 shadow-[0_14px_35px_rgba(48,76,83,.07)] [transition:transform_.45s_var(--ease-chef),box-shadow_.45s] hover:[transform:translateY(-8px)] hover:shadow-[0_24px_50px_rgba(48,76,83,.14)] [&_.image-wrap]:h-[330px] [&_.image-wrap]:overflow-hidden [&_.image-wrap]:relative [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:[transition:transform_.8s_var(--ease-chef)] [&:hover_img]:[transform:scale(1.045)] [&_.image-wrap.placeholder]:[background:linear-gradient(135deg,var(--color-aqua),var(--color-deep))] [&_.image-wrap.placeholder]:grid [&_.image-wrap.placeholder]:place-items-center [&_.image-wrap.placeholder]:text-white [&_.image-wrap.placeholder]:font-display [&_.image-wrap.placeholder]:text-[4rem] [&_h3]:font-display [&_h3]:text-[2rem] [&_h3]:font-normal [&_h3]:leading-[1] [&_h3]:my-[15px] [&_h3]:mx-0 max-[980px]:snap-start max-[680px]:[&_.image-wrap]:h-[290px] focus-visible:[outline:3px_solid_var(--color-sand)] focus-visible:[outline-offset:4px]"
      tabIndex={0}
      aria-label={`${recipe.title} recept megnyitása`}
      onClick={() => setSelectedRecipe(recipe)}
      onKeyDown={(event) => {
        if (
          event.target === event.currentTarget &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          setSelectedRecipe(recipe);
        }
      }}
    >
      <button
        className={`heart-button absolute right-4 top-4 w-9.5 h-9.5 border-0 rounded-full bg-[rgba(247,244,239,.9)] text-[1.25rem] cursor-pointer z-2 [&.saved]:bg-sand [&.saved]:text-white ${saved ? " saved" : ""}`}
        aria-label={
          saved ? "Eltávolítás a kedvencekből" : "Mentés a kedvencekhez"
        }
        aria-pressed={saved}
        onClick={(event) => {
          event.stopPropagation();
          toggleFavorite(recipe.id);
        }}
      >
        {saved ? "♥" : "♡"}
      </button>
      <div className={`image-wrap ${recipe.image ? "" : " placeholder"}`}>
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} loading="lazy" />
        ) : (
          <span>{recipe.title.charAt(0)}</span>
        )}
        <div className="match-chip absolute left-4 top-4 bg-[rgba(247,244,239,.9)] backdrop-blur-[8px] rounded-full py-2 px-3 text-[.72rem] font-bold">
          {recipe.match}% egyezés
        </div>
      </div>
      <div className="recipe-body p-5.5">
        <div className="recipe-topline flex justify-between items-center text-[.72rem] text-[#6a787b] uppercase tracking-[.08em]">
          <span>{recipe.type}</span>
          <span>{recipe.time} perc</span>
        </div>
        <h3>{recipe.title}</h3>
        <div className="recipe-meta flex gap-3.5 text-[.78rem] text-[#59676a]">
          <span>{recipe.kcal} kcal</span>
          <span>{recipe.protein} g fehérje</span>
          <span>{recipe.servings} adag</span>
        </div>
      </div>
    </article>
  );
}
