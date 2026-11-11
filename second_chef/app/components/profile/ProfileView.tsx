"use client";

import { useEffect, useState } from "react";
import { useChef } from "../SecondChefProvider";

const diets = ["Mindenevő", "Vegetáriánus", "Vegán", "Halat fogyasztó"];
const allergyOptions = ["Tej", "Glutén", "Tojás", "Diófélék"];
const macroLabels = ["Energia", "Fehérje", "Szénhidrát", "Zsír"];

export default function ProfileView() {
  const { notify } = useChef();
  const [diet, setDiet] = useState("Mindenevő");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [macros, setMacros] = useState([550, 35, 55, 20]);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("secondchef-profile") ?? "null",
      );
      if (
        saved &&
        diets.includes(saved.diet) &&
        Array.isArray(saved.allergies) &&
        saved.allergies.every(
          (value: unknown) =>
            typeof value === "string" && allergyOptions.includes(value),
        ) &&
        Array.isArray(saved.macros) &&
        saved.macros.length === 4 &&
        saved.macros.every(
          (value: unknown) =>
            typeof value === "number" && Number.isFinite(value) && value >= 0,
        )
      ) {
        setDiet(saved.diet);
        setAllergies(saved.allergies);
        setMacros(saved.macros);
      }
    } catch {
      /* Keep defaults when storage is unavailable. */
    }
  }, []);
  function saveProfile() {
    try {
      localStorage.setItem(
        "secondchef-profile",
        JSON.stringify({ diet, allergies, macros }),
      );
      notify("Beállítások elmentve");
    } catch {
      notify("A böngésző nem engedélyezi a beállítások mentését.");
    }
  }
  return (
    <>
      <header className="app-heading flex justify-between items-end mb-10 [&_h1]:font-display [&_h1]:text-[clamp(3rem,5.5vw,5.5rem)] [&_h1]:leading-[.9] [&_h1]:font-normal [&_h1]:mt-0 [&_h1]:mx-0 [&_h1]:mb-3.5 [&_h1]:tracking-[-.04em] [&_p]:mt-0 max-[680px]:items-start max-[680px]:gap-3 max-[680px]:grid max-[680px]:grid-cols-[minmax(0,1fr)_auto] max-[680px]:[&_h1]:text-[3.5rem] max-[680px]:[&_.filter-button]:[flex:0_0_auto] max-[680px]:[&_.filter-button]:py-2.5 max-[680px]:[&_.filter-button]:px-[13px] [&>div]:min-w-0 max-[680px]:[&_.muted]:whitespace-normal max-[680px]:[&_.muted]:[overflow-wrap:anywhere]">
        <div>
          <p className="eyebrow uppercase text-[.75rem] tracking-[.18em] font-bold mt-0 mx-0 mb-4.5 [&.dark]:text-sand dark">
            Személyes beállítások
          </p>
          <h1>Profil</h1>
          <p className="muted text-[#637174]">
            Ezek alapján személyre szabjuk a találatokat.
          </p>
        </div>
        <button
          className="pill-button inline-flex items-center justify-center border-0 rounded-full py-[15px] px-[23px] font-bold bg-deep text-cream cursor-pointer [transition:transform_.3s_var(--ease-chef),background_.3s] hover:[transform:translateY(-2px)_scale(1.015)] [&.small]:py-[11px] [&.small]:px-4.5 [&.small]:text-[.86rem] [&.coral]:bg-sand [&.coral:hover]:bg-[#aa5c42] coral"
          onClick={saveProfile}
        >
          Mentés
        </button>
      </header>
      <div className="settings-grid grid grid-cols-2 gap-5 max-[680px]:grid-cols-1">
        <article className="settings-card bg-cream p-7 rounded-3xl [&.wide]:[grid-column:1/-1] [&>span]:text-[.7rem] [&>span]:text-sand [&>span]:uppercase [&>span]:tracking-[.15em] [&_h2]:font-display [&_h2]:text-[2rem] [&_h2]:font-normal [&_h2]:mt-2.5 [&_h2]:mx-0 [&_h2]:mb-6 max-[680px]:[&.wide]:[grid-column:auto]">
          <span>Étrend</span>
          <h2>Mit szeretsz enni?</h2>
          <div className="choice-grid [&_button]:[border:1px_solid_var(--color-line)] [&_button]:bg-transparent [&_button]:rounded-full [&_button]:py-2.5 [&_button]:px-4 [&_button]:whitespace-nowrap [&_button]:cursor-pointer [&_button.active]:bg-deep [&_button.active]:text-white flex gap-2 flex-wrap">
            {diets.map((value) => (
              <button
                key={value}
                className={diet === value ? "active" : ""}
                aria-pressed={diet === value}
                onClick={() => setDiet(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </article>
        <article className="settings-card bg-cream p-7 rounded-3xl [&.wide]:[grid-column:1/-1] [&>span]:text-[.7rem] [&>span]:text-sand [&>span]:uppercase [&>span]:tracking-[.15em] [&_h2]:font-display [&_h2]:text-[2rem] [&_h2]:font-normal [&_h2]:mt-2.5 [&_h2]:mx-0 [&_h2]:mb-6 max-[680px]:[&.wide]:[grid-column:auto]">
          <span>Allergiák</span>
          <h2>Mit zárjunk ki?</h2>
          <div className="choice-grid [&_button]:[border:1px_solid_var(--color-line)] [&_button]:bg-transparent [&_button]:rounded-full [&_button]:py-2.5 [&_button]:px-4 [&_button]:whitespace-nowrap [&_button]:cursor-pointer [&_button.active]:bg-deep [&_button.active]:text-white flex gap-2 flex-wrap multi">
            {allergyOptions.map((value) => (
              <button
                key={value}
                className={allergies.includes(value) ? "active" : ""}
                aria-pressed={allergies.includes(value)}
                onClick={() =>
                  setAllergies((current) =>
                    current.includes(value)
                      ? current.filter((item) => item !== value)
                      : [...current, value],
                  )
                }
              >
                {value}
              </button>
            ))}
          </div>
          <p className="safety-note text-[.76rem] text-[#778487] mt-5 mx-0 mb-0">
            A megadott allergénadatok szerint. Keresztszennyeződésre nem adható
            garancia.
          </p>
        </article>
        <article className="settings-card bg-cream p-7 rounded-3xl [&.wide]:[grid-column:1/-1] [&>span]:text-[.7rem] [&>span]:text-sand [&>span]:uppercase [&>span]:tracking-[.15em] [&_h2]:font-display [&_h2]:text-[2rem] [&_h2]:font-normal [&_h2]:mt-2.5 [&_h2]:mx-0 [&_h2]:mb-6 max-[680px]:[&.wide]:[grid-column:auto] wide">
          <span>Étkezésenkénti célok</span>
          <h2>Makrók egy adaghoz</h2>
          <div className="macro-inputs grid grid-cols-4 gap-3 [&_label]:text-[.76rem] [&_label]:text-[#68777a] [&_label]:relative [&_input]:block [&_input]:w-full [&_input]:mt-[7px] [&_input]:[border:1px_solid_var(--color-line)] [&_input]:rounded-xl [&_input]:pt-3.5 [&_input]:pr-10.5 [&_input]:pb-3.5 [&_input]:pl-[13px] [&_input]:bg-paper [&_small]:absolute [&_small]:right-3 [&_small]:bottom-3.5 max-[680px]:grid-cols-2">
            {macroLabels.map((label, index) => (
              <label key={label}>
                {label}
                <input
                  type="number"
                  min="0"
                  value={macros[index]}
                  onChange={(event) => {
                    const value = Math.max(0, Number(event.target.value));
                    setMacros((current) =>
                      current.map((macro, position) =>
                        position === index ? value : macro,
                      ),
                    );
                  }}
                />
                <small>{index === 0 ? "kcal" : "g"}</small>
              </label>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}
