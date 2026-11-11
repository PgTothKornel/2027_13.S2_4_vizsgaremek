import { recipes } from "@/app/lib/demo-data";
import RecipeCard from "../recipes/RecipeCard";

export default function RecipeShowcase() {
  return (
    <section className="recipe-showcase bg-paper overflow-hidden">
      <div className="showcase-head flex justify-between items-end pb-15 max-[680px]:items-start section-pad py-30 px-[max(5vw,24px)] max-[680px]:py-20.5 max-[680px]:px-5">
        <div>
          <div className="section-kicker text-[.72rem] uppercase tracking-[.15em] font-bold flex items-center gap-2.5 mb-12.5 [&_span]:grid [&_span]:place-items-center [&_span]:w-7 [&_span]:h-7 [&_span]:[border:1px_solid_currentColor] [&_span]:rounded-full [&.light]:text-aqua reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
            <span>04</span> Mai inspiráció
          </div>
          <h2 className="display-heading font-display font-normal tracking-[-.045em] text-[clamp(3.2rem,7vw,7.5rem)] leading-[.91] m-0 [&_em]:text-sand [&_em]:font-normal max-[680px]:text-[clamp(3.2rem,14vw,5.2rem)] reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
            Három ötlet.
            <br />
            Egy könnyebb döntés.
          </h2>
        </div>
        <a
          href="#discover"
          className="round-link w-[115px] h-[115px] rounded-full bg-deep text-white flex items-center justify-center text-center text-[.8rem] [transition:.4s_var(--ease-chef)] hover:[transform:rotate(8deg)_scale(1.06)] [&_span]:ml-1.5 max-[680px]:w-20.5 max-[680px]:h-20.5 max-[680px]:[flex:0_0_auto]"
          aria-label="Összes recept megnyitása"
        >
          Összes
          <br />
          recept <span>↗</span>
        </a>
      </div>
      <div className="recipe-rail pt-0 grid grid-cols-[repeat(3,minmax(280px,1fr))] gap-5.5 max-[980px]:grid-cols-[repeat(3,72vw)] max-[980px]:overflow-auto max-[980px]:snap-x max-[980px]:snap-mandatory max-[980px]:pr-6 max-[680px]:grid-cols-[repeat(3,85vw)] max-[680px]:pl-5 section-pad py-30 px-[max(5vw,24px)] max-[680px]:py-20.5 max-[680px]:px-5">
        {recipes.slice(0, 3).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}
