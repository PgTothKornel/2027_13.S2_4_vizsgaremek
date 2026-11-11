"use client";

import { useState } from "react";
import type { Recipe } from "@/app/lib/demo-data";
import { useChef } from "../SecondChefProvider";
import Modal from "../Modal";

function RecipeDetails({ recipe }: { recipe: Recipe }) {
  const { favorites, toggleFavorite, shopping, setShopping, notify } =
    useChef();
  const [servings, setServings] = useState(recipe.servings);
  const factor = servings / recipe.servings;
  function addMissing() {
    const missing = recipe.ingredients.filter(
      ([name, , , has]) =>
        !has && !shopping.some((item) => item.name === name && !item.bought),
    );
    setShopping((current) => [
      ...current,
      ...missing.map(([name, qty, unit], index) => ({
        id: Date.now() + index,
        name,
        qty: `${Number((qty * factor).toFixed(1))} ${unit}`,
        source: recipe.title,
        bought: false,
      })),
    ]);
    notify(
      missing.length
        ? `${missing.length} tétel a bevásárlólistán`
        : "Ezek már a listán vannak",
    );
  }
  return (
    <div className="recipe-modal-grid grid grid-cols-2 max-[680px]:grid-cols-1">
      <div className="recipe-modal-image min-h-[640px] relative [&_img]:absolute [&_img]:w-full [&_img]:h-full [&_img]:object-cover max-[680px]:min-h-[300px]">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} />
        ) : (
          <div className="image-wrap placeholder">
            <span>{recipe.title[0]}</span>
          </div>
        )}
      </div>
      <div className="recipe-modal-copy py-[55px] px-[45px] max-h-[85vh] overflow-auto [&_.eyebrow]:text-sand [&_h2]:font-display [&_h2]:text-[3.6rem] [&_h2]:leading-[.9] [&_h2]:font-normal [&_h2]:mt-3 [&_h2]:mx-0 [&_h2]:mb-5 max-[680px]:py-[35px] max-[680px]:px-5.5 max-[680px]:max-h-none max-[680px]:[&_h2]:text-[2.8rem]">
        <p className="eyebrow uppercase text-[.75rem] tracking-[.18em] font-bold mt-0 mx-0 mb-4.5 [&.dark]:text-sand">
          {recipe.type}
        </p>
        <h2>{recipe.title}</h2>
        <p>{recipe.description}</p>
        <div className="modal-meta flex gap-4.5 [border-block:1px_solid_var(--color-line)] py-4.5 px-0 my-5.5 mx-0 text-[.85rem]">
          <span>◷ {recipe.time} perc</span>
          <span>◉ {recipe.kcal} kcal / adag</span>
          <span>● {recipe.protein} g fehérje</span>
        </div>
        <div className="serving-control flex items-center justify-between bg-aqua py-3.5 px-4.5 rounded-[14px] [&_div]:flex [&_div]:gap-2.5 [&_div]:items-center [&_button]:w-7.5 [&_button]:h-7.5 [&_button]:border-0 [&_button]:bg-white [&_button]:rounded-full [&_button]:cursor-pointer">
          <span>Adagok száma</span>
          <div>
            <button
              aria-label="Adag csökkentése"
              disabled={servings <= 1}
              onClick={() => setServings((value) => Math.max(1, value - 1))}
            >
              −
            </button>
            <strong>{servings}</strong>
            <button
              aria-label="Adag növelése"
              disabled={servings >= 20}
              onClick={() => setServings((value) => Math.min(20, value + 1))}
            >
              +
            </button>
          </div>
        </div>
        <ul className="ingredients list-none p-0 my-6 mx-0 [&_li]:flex [&_li]:justify-between [&_li]:py-[9px] [&_li]:px-0 [&_li]:[border-bottom:1px_solid_var(--color-line)] [&_li]:text-[.88rem]">
          {recipe.ingredients.map(([name, qty, unit, has]) => (
            <li key={name}>
              <span>
                {has ? "●" : "○"} {name}
              </span>
              <strong>
                {Number((qty * factor).toFixed(1))} {unit}
              </strong>
            </li>
          ))}
        </ul>
        <p className="safety-note text-[.76rem] text-[#778487] mt-5 mx-0 mb-0">
          ● megvan a kamrában · ○ hiányzik vagy a mennyiség nem ellenőrizhető
        </p>
        <div className="modal-actions flex gap-2.5 mt-6 max-[680px]:flex-col">
          <button
            className="pill-button inline-flex items-center justify-center border-0 rounded-full py-[15px] px-[23px] font-bold bg-deep text-cream cursor-pointer [transition:transform_.3s_var(--ease-chef),background_.3s] hover:[transform:translateY(-2px)_scale(1.015)] [&.small]:py-[11px] [&.small]:px-4.5 [&.small]:text-[.86rem] [&.coral]:bg-sand [&.coral:hover]:bg-[#aa5c42] coral"
            onClick={addMissing}
          >
            Hiányzók a listára
          </button>
          <button
            className="subtle-button [border:1px_solid_var(--color-line)] bg-cream py-3 px-4.5 rounded-full cursor-pointer font-semibold"
            onClick={() => toggleFavorite(recipe.id)}
          >
            {favorites.includes(recipe.id) ? "♥ Mentve" : "♡ Mentés"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecipeModal() {
  const { selectedRecipe, setSelectedRecipe } = useChef();
  return (
    <Modal
      open={!!selectedRecipe}
      onClose={() => setSelectedRecipe(null)}
      label={selectedRecipe?.title ?? "Recept"}
    >
      {selectedRecipe && (
        <RecipeDetails key={selectedRecipe.id} recipe={selectedRecipe} />
      )}
    </Modal>
  );
}
