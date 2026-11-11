"use client";

import { useState, type FormEvent } from "react";
import { categories, type PantryItem } from "@/app/lib/demo-data";
import { useChef } from "../SecondChefProvider";
import Modal from "../Modal";

export default function PantryView() {
  const { pantry, setPantry, notify } = useChef();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const groups = pantry
    .filter((item) =>
      item.name.toLocaleLowerCase("hu").includes(query.toLocaleLowerCase("hu")),
    )
    .reduce<Record<string, PantryItem[]>>((result, item) => {
      (result[item.category] ??= []).push(item);
      return result;
    }, {});
  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    if (!name) return;
    const quantity = String(data.get("qty") ?? "");
    setPantry((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        qty: quantity ? Number(quantity) : null,
        unit: String(data.get("unit")),
        category: String(data.get("category")),
      },
    ]);
    form.reset();
    setAdding(false);
    notify("Alapanyag hozzáadva");
  }
  return (
    <>
      <header className="app-heading flex justify-between items-end mb-10 [&_h1]:font-display [&_h1]:text-[clamp(3rem,5.5vw,5.5rem)] [&_h1]:leading-[.9] [&_h1]:font-normal [&_h1]:mt-0 [&_h1]:mx-0 [&_h1]:mb-3.5 [&_h1]:tracking-[-.04em] [&_p]:mt-0 max-[680px]:items-start max-[680px]:gap-3 max-[680px]:grid max-[680px]:grid-cols-[minmax(0,1fr)_auto] max-[680px]:[&_h1]:text-[3.5rem] max-[680px]:[&_.filter-button]:[flex:0_0_auto] max-[680px]:[&_.filter-button]:py-2.5 max-[680px]:[&_.filter-button]:px-[13px] [&>div]:min-w-0 max-[680px]:[&_.muted]:whitespace-normal max-[680px]:[&_.muted]:[overflow-wrap:anywhere]">
        <div>
          <p className="eyebrow uppercase text-[.75rem] tracking-[.18em] font-bold mt-0 mx-0 mb-4.5 [&.dark]:text-sand dark">
            Ami már megvan
          </p>
          <h1>Kamrám</h1>
          <p className="muted text-[#637174]">
            {pantry.length} alapanyag, csoportosítva.
          </p>
        </div>
        <button
          className="pill-button inline-flex items-center justify-center border-0 rounded-full py-[15px] px-[23px] font-bold bg-deep text-cream cursor-pointer [transition:transform_.3s_var(--ease-chef),background_.3s] hover:[transform:translateY(-2px)_scale(1.015)] [&.small]:py-[11px] [&.small]:px-4.5 [&.small]:text-[.86rem] [&.coral]:bg-sand [&.coral:hover]:bg-[#aa5c42] coral"
          onClick={() => setAdding(true)}
        >
          + Alapanyag
        </button>
      </header>
      <div className="pantry-tools flex gap-3 mb-8 [&_input]:[flex:1] [&_input]:bg-cream [&_input]:[border:1px_solid_var(--color-line)] [&_input]:rounded-[14px] [&_input]:py-3.5 [&_input]:px-4.5 [&_button]:[border:1px_solid_var(--color-line)] [&_button]:rounded-[14px] [&_button]:bg-aqua [&_button]:font-bold [&_button]:py-0 [&_button]:px-5 [&_button]:cursor-pointer max-[680px]:flex-col max-[680px]:[&_button]:p-3.5">
        <input
          type="search"
          aria-label="Keresés a kamrában"
          placeholder="Keresés a kamrában…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          onClick={() =>
            notify("A fotófelismerés demóban kézi jóváhagyással működne.")
          }
        >
          ▣ Fotó elemzése
        </button>
      </div>
      <div className="pantry-groups grid grid-cols-2 gap-5 max-[980px]:grid-cols-1 max-[680px]:grid-cols-1">
        {Object.entries(groups).map(([category, items]) => (
          <section
            className="pantry-group bg-cream [border:1px_solid_rgba(48,76,83,.09)] rounded-3xl p-6 [&_h2]:font-display [&_h2]:text-[1.8rem] [&_h2]:font-normal [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-5"
            key={category}
          >
            <h2>{category}</h2>
            {items.map((item) => (
              <div
                className="pantry-item grid grid-cols-[1fr_auto_auto] items-center gap-3 [border-top:1px_solid_var(--color-line)] py-3.5 px-0 [&:first-of-type]:border-0 [&_strong]:text-[.92rem] [&_small]:block [&_small]:text-[#778487] [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[#9b6b5a] [&_button]:cursor-pointer"
                key={item.id}
              >
                <div>
                  <strong>{item.name}</strong>
                  <small>
                    {item.qty === null
                      ? "Mennyiség nincs megadva"
                      : "Készleten"}
                  </small>
                </div>
                <span>
                  {item.qty ?? "—"} {item.unit}
                </span>
                <button
                  aria-label={`${item.name} törlése`}
                  onClick={() => {
                    setPantry((current) =>
                      current.filter((value) => value.id !== item.id),
                    );
                    notify("Alapanyag eltávolítva");
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </section>
        ))}
        {!Object.keys(groups).length && (
          <div className="empty-state text-center py-17.5 px-5 bg-cream rounded-3xl [&_span]:font-display [&_span]:text-[4rem] [&_span]:text-sand">
            <span>⌕</span>
            <h2>Nincs találat.</h2>
            <p>Próbálj más kifejezést, vagy adj hozzá egy alapanyagot.</p>
          </div>
        )}
      </div>
      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        label="Alapanyag hozzáadása"
        small
      >
        <h2>Alapanyag hozzáadása</h2>
        <form onSubmit={addItem}>
          <label>
            Név
            <input name="name" required placeholder="pl. csicseriborsó" />
          </label>
          <div className="form-row grid grid-cols-2 gap-3 max-[680px]:grid-cols-1">
            <label>
              Mennyiség
              <input
                name="qty"
                type="number"
                min="0"
                step="0.1"
                placeholder="2"
              />
            </label>
            <label>
              Egység
              <select name="unit">
                {["db", "g", "kg", "ml", "csomag"].map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Kategória
            <select name="category">
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <button
            className="pill-button inline-flex items-center justify-center border-0 rounded-full py-[15px] px-[23px] font-bold bg-deep text-cream cursor-pointer [transition:transform_.3s_var(--ease-chef),background_.3s] hover:[transform:translateY(-2px)_scale(1.015)] [&.small]:py-[11px] [&.small]:px-4.5 [&.small]:text-[.86rem] [&.coral]:bg-sand [&.coral:hover]:bg-[#aa5c42] coral"
            type="submit"
          >
            Mentés a kamrába
          </button>
        </form>
      </Modal>
    </>
  );
}
