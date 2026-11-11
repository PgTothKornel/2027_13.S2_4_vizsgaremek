"use client";

import type { FormEvent } from "react";
import { useChef } from "../SecondChefProvider";

export default function ShoppingView() {
  const { shopping, setShopping, notify } = useChef();
  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    if (!name) return;
    setShopping((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        qty: String(data.get("qty") ?? "").trim(),
        source: "Kézzel hozzáadva",
        bought: false,
      },
    ]);
    form.reset();
    notify("Tétel hozzáadva");
  }
  function clearBought() {
    const count = shopping.filter((item) => item.bought).length;
    setShopping((current) => current.filter((item) => !item.bought));
    notify(count ? `${count} megvett tétel törölve` : "Nincs megvett tétel");
  }
  return (
    <>
      <header className="app-heading flex justify-between items-end mb-10 [&_h1]:font-display [&_h1]:text-[clamp(3rem,5.5vw,5.5rem)] [&_h1]:leading-[.9] [&_h1]:font-normal [&_h1]:mt-0 [&_h1]:mx-0 [&_h1]:mb-3.5 [&_h1]:tracking-[-.04em] [&_p]:mt-0 max-[680px]:items-start max-[680px]:gap-3 max-[680px]:grid max-[680px]:grid-cols-[minmax(0,1fr)_auto] max-[680px]:[&_h1]:text-[3.5rem] max-[680px]:[&_.filter-button]:[flex:0_0_auto] max-[680px]:[&_.filter-button]:py-2.5 max-[680px]:[&_.filter-button]:px-[13px] [&>div]:min-w-0 max-[680px]:[&_.muted]:whitespace-normal max-[680px]:[&_.muted]:[overflow-wrap:anywhere]">
        <div>
          <p className="eyebrow uppercase text-[.75rem] tracking-[.18em] font-bold mt-0 mx-0 mb-4.5 [&.dark]:text-sand dark">
            Ami még hiányzik
          </p>
          <h1>Bevásárlólista</h1>
          <p className="muted text-[#637174]">
            A receptekből és kézzel hozzáadott tételekből.
          </p>
        </div>
        <button
          className="subtle-button [border:1px_solid_var(--color-line)] bg-cream py-3 px-4.5 rounded-full cursor-pointer font-semibold"
          onClick={clearBought}
        >
          Megvettek törlése
        </button>
      </header>
      <form
        className="add-item-form grid grid-cols-[1fr_180px_auto] gap-2.5 bg-aqua p-5.5 rounded-[22px] mb-6 [&_input]:border-0 [&_input]:rounded-xl [&_input]:py-[13px] [&_input]:px-4 [&_input]:bg-cream max-[680px]:grid-cols-2 max-[680px]:p-3.5 max-[680px]:[&_input:first-child]:[grid-column:1/-1] max-[680px]:[&_button]:p-3"
        onSubmit={addItem}
      >
        <input
          name="name"
          aria-label="Új tétel hozzáadása"
          placeholder="Új tétel hozzáadása"
          required
        />
        <input name="qty" aria-label="Mennyiség" placeholder="Mennyiség" />
        <button
          className="pill-button inline-flex items-center justify-center border-0 rounded-full py-[15px] px-[23px] font-bold bg-deep text-cream cursor-pointer [transition:transform_.3s_var(--ease-chef),background_.3s] hover:[transform:translateY(-2px)_scale(1.015)] [&.small]:py-[11px] [&.small]:px-4.5 [&.small]:text-[.86rem] [&.coral]:bg-sand [&.coral:hover]:bg-[#aa5c42] coral"
          type="submit"
        >
          Hozzáadás
        </button>
      </form>
      <div className="shopping-list bg-cream rounded-3xl overflow-hidden">
        {shopping.length ? (
          shopping.map((item) => (
            <div
              className={`shopping-row grid grid-cols-[38px_1fr_auto_auto] gap-3.5 items-center py-4.5 px-5.5 [border-bottom:1px_solid_var(--color-line)] [&:last-child]:border-0 [&_input[type=checkbox]]:appearance-none [&_input[type=checkbox]]:w-6 [&_input[type=checkbox]]:h-6 [&_input[type=checkbox]]:[border:1.5px_solid_var(--color-deep)] [&_input[type=checkbox]]:rounded-full [&_input[type=checkbox]]:grid [&_input[type=checkbox]]:place-content-center [&_input[type=checkbox]]:cursor-pointer [&_input[type=checkbox]:checked]:bg-deep [&_input[type=checkbox]:checked:after]:[content:"✓"] [&_input[type=checkbox]:checked:after]:text-white [&_input[type=checkbox]:checked:after]:text-[.75rem] [&.bought_strong]:line-through [&.bought_strong]:text-[#8a9496] [&_small]:text-[#7d898b] [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[#a36655] [&_button]:cursor-pointer max-[680px]:grid-cols-[30px_1fr_auto] max-[680px]:p-4 max-[680px]:[&_small]:[grid-column:2] ${item.bought ? " bought" : ""}`}
              key={item.id}
            >
              <input
                type="checkbox"
                checked={item.bought}
                aria-label={`${item.name} megjelölése`}
                onChange={(event) => {
                  const bought = event.target.checked;
                  setShopping((current) =>
                    current.map((value) =>
                      value.id === item.id ? { ...value, bought } : value,
                    ),
                  );
                }}
              />
              <div>
                <strong>{item.name}</strong>
                <small>{item.source || "Kézzel hozzáadva"}</small>
              </div>
              <span>{item.qty}</span>
              <button
                aria-label={`${item.name} törlése`}
                onClick={() =>
                  setShopping((current) =>
                    current.filter((value) => value.id !== item.id),
                  )
                }
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state text-center py-17.5 px-5 bg-cream rounded-3xl [&_span]:font-display [&_span]:text-[4rem] [&_span]:text-sand">
            <span>✓</span>
            <h2>A listád üres.</h2>
            <p>Minden megvan a következő főzéshez.</p>
          </div>
        )}
      </div>
    </>
  );
}
