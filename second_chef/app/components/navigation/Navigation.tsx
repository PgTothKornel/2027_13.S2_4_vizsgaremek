"use client";

import { useEffect, useRef, useState } from "react";
import { navItems } from "@/app/lib/demo-data";
import { useChef } from "../SecondChefProvider";

export function SiteHeader() {
  const { route, setSearch, setFilter, notify } = useChef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchDialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [route]);
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    document.body.classList.toggle("search-open", searchOpen);
    if (searchOpen) input.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        searchButton.current?.focus();
      }
      if (event.key === "Tab" && searchOpen) {
        const controls =
          searchDialog.current?.querySelectorAll<HTMLElement>("button, input");
        if (!controls?.length) return;
        const first = controls[0],
          last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("menu-open", "search-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, searchOpen]);
  function performSearch(value: string) {
    const term = value.trim().toLocaleLowerCase("hu");
    setFilter(
      term.includes("fehérje")
        ? "high-protein"
        : term.includes("gyors")
          ? "quick"
          : "all",
    );
    setSearch(
      term.includes("fehérje") || term.includes("gyors") ? "" : value.trim(),
    );
    setSearchOpen(false);
    searchButton.current?.focus();
    window.location.hash = "discover";
    notify(`Találatok: ${value}`);
  }
  return (
    <>
      <header
        className={`site-header fixed z-100 left-[50%] top-4.5 [transform:translateX(-50%)] w-[min(1180px,calc(100%_-_40px))] h-16 pt-0 pr-2.5 pb-0 pl-5.5 rounded-[20px] flex items-center justify-between bg-[rgba(247,244,239,.88)] backdrop-blur-[18px] [border:1px_solid_rgba(255,255,255,.5)] shadow-[0_12px_40px_rgba(23,39,43,.1)] [transition:all_.45s_var(--ease-chef)] [&.app-mode]:top-0 [&.app-mode]:w-full [&.app-mode]:max-w-none [&.app-mode]:rounded-0 [&.app-mode]:bg-[rgba(247,244,239,.97)] [&.app-mode]:border-line [&.app-mode]:shadow-none max-[680px]:w-[calc(100%_-_24px)] max-[680px]:top-2.5 max-[680px]:h-14.5 max-[680px]:pl-4 max-[680px]:[&_.pill-button]:hidden ${route !== "home" ? " app-mode" : ""}`}
      >
        <a
          className="brand inline-flex items-center gap-[11px] font-bold tracking-[-.03em] text-[1.12rem] [&.light_.brand-mark]:bg-aqua [&.light_.brand-mark_i]:bg-cocoa max-[680px]:text-[1rem]"
          href="#home"
          aria-label="Second Chef kezdőlap"
        >
          <span
            className="brand-mark w-7 h-7 rounded-full bg-sand inline-grid place-items-center relative overflow-hidden [&_i]:absolute [&_i]:w-1 [&_i]:h-4.5 [&_i]:rounded-[9px] [&_i]:bg-paper [&_i]:[transform:rotate(45deg)] [&_i:last-child]:[transform:rotate(-45deg)] [&.large]:w-12 [&.large]:h-12 [&.large_i]:h-7.5 [&.large_i]:w-1.5"
            aria-hidden="true"
          >
            <i />
            <i />
          </span>
          <span>Second Chef</span>
        </a>
        <nav
          className="desktop-nav flex gap-7.5 text-[.9rem] font-semibold [&_a]:[transition:.25s] [&_a:hover]:text-sand max-[980px]:hidden"
          aria-label="Fő navigáció"
        >
          {navItems.slice(0, 4).map((item) => (
            <a key={item.route} href={`#${item.route}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions flex items-center gap-2">
          <button
            ref={searchButton}
            className="icon-button border-0 bg-transparent cursor-pointer w-10.5 h-10.5 rounded-full text-[1.65rem] grid place-items-center hover:bg-[rgba(48,76,83,.08)]"
            aria-label="Keresés megnyitása"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
          >
            ⌕
          </button>
          <a
            className="pill-button inline-flex items-center justify-center border-0 rounded-full py-[15px] px-[23px] font-bold bg-deep text-cream cursor-pointer [transition:transform_.3s_var(--ease-chef),background_.3s] hover:[transform:translateY(-2px)_scale(1.015)] [&.small]:py-[11px] [&.small]:px-4.5 [&.small]:text-[.86rem] [&.coral]:bg-sand [&.coral:hover]:bg-[#aa5c42] small"
            href="#discover"
          >
            Mit főzzek?
          </a>
          <button
            className="menu-button border-0 bg-transparent cursor-pointer hidden w-10.5 h-10.5 items-center justify-center flex-col gap-1.5 [&_span]:block [&_span]:w-4.5 [&_span]:h-0.5 [&_span]:bg-ink max-[980px]:flex"
            aria-label={menuOpen ? "Menü bezárása" : "Menü megnyitása"}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <nav
        className={`mobile-menu fixed z-99 inset-0 bg-aqua pt-30 px-7.5 pb-7.5 flex flex-col opacity-0 invisible [transform:translateY(-20px)] [transition:.45s_var(--ease-chef)] [&.open]:opacity-100 [&.open]:visible [&.open]:[transform:none] [&_a]:font-display [&_a]:text-[clamp(2.5rem,10vw,5rem)] [&_a]:leading-[1.05] [&_a]:[border-bottom:1px_solid_rgba(48,76,83,.25)] [&_a]:py-2 [&_a]:px-0 [&[hidden]]:hidden ${menuOpen ? " open" : ""}`}
        id="mobileMenu"
        hidden={!menuOpen}
        aria-label="Mobil menü"
      >
        <a href="#home" onClick={() => setMenuOpen(false)}>
          Kezdőlap
        </a>
        {navItems.map((item) => (
          <a
            key={item.route}
            href={`#${item.route}`}
            onClick={() => setMenuOpen(false)}
          >
            {item.route === "shopping" ? "Bevásárlólista" : item.label}
          </a>
        ))}
      </nav>
      <div
        ref={searchDialog}
        className={`search-overlay fixed z-300 inset-0 bg-deep text-cream flex flex-col items-center justify-center opacity-0 invisible [transition:.4s_var(--ease-chef)] p-7.5 [&.open]:opacity-100 [&.open]:visible [&_label]:font-display [&_label]:text-[clamp(2.5rem,7vw,6.5rem)] [&_label]:mb-7.5 [&_input]:w-[min(800px,100%)] [&_input]:border-0 [&_input]:[border-bottom:2px_solid_rgba(255,255,255,.5)] [&_input]:bg-transparent [&_input]:text-white [&_input]:py-5 [&_input]:px-0 [&_input]:text-[clamp(1.2rem,3vw,2rem)] [&_input]:[outline:none] [&_input::placeholder]:text-[rgba(255,255,255,.45)] [&[hidden]]:hidden ${searchOpen ? " open" : ""}`}
        hidden={!searchOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="searchLabel"
      >
        <button
          className="close-search absolute top-6 right-7.5 border-0 bg-transparent text-white text-[3rem] cursor-pointer"
          aria-label="Keresés bezárása"
          onClick={() => {
            setSearchOpen(false);
            searchButton.current?.focus();
          }}
        >
          ×
        </button>
        <label id="searchLabel" htmlFor="globalSearch">
          Mit ennél ma?
        </label>
        <input
          ref={input}
          id="globalSearch"
          type="search"
          placeholder="pl. gyors vacsora csirkéből"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") performSearch(query);
          }}
        />
        <div className="search-suggestions w-[min(800px,100%)] flex gap-2.5 flex-wrap mt-6 [&_button]:[border:1px_solid_rgba(255,255,255,.25)] [&_button]:bg-transparent [&_button]:text-white [&_button]:rounded-full [&_button]:py-2.5 [&_button]:px-4 [&_button]:cursor-pointer">
          {["Gyors vacsora", "Magas fehérje", "Paradicsom", "Lazac"].map(
            (suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  performSearch(suggestion);
                }}
              >
                {suggestion}
              </button>
            ),
          )}
        </div>
      </div>
    </>
  );
}

export function AppSidebar() {
  const { route } = useChef();
  return (
    <aside
      className="app-sidebar [border-right:1px_solid_var(--color-line)] py-12.5 px-5.5 sticky top-16 h-[calc(100vh_-_64px)] flex flex-col gap-2 [&_a]:flex [&_a]:items-center [&_a]:gap-3 [&_a]:py-3 [&_a]:px-3.5 [&_a]:rounded-xl [&_a]:font-semibold [&_a]:text-[.9rem] [&_a]:text-[#5d6b6e] [&_a_span]:w-7 [&_a_span]:h-7 [&_a_span]:[border:1px_solid_var(--color-line)] [&_a_span]:rounded-[9px] [&_a_span]:grid [&_a_span]:place-items-center [&_a.active]:bg-aqua [&_a.active]:text-deep [&_a:hover]:bg-aqua [&_a:hover]:text-deep [&_a:last-child]:mt-auto max-[980px]:hidden"
      aria-label="Alkalmazás navigáció"
    >
      {navItems.map((item) => (
        <a
          key={item.route}
          href={`#${item.route}`}
          className={route === item.route ? "active" : ""}
          aria-current={route === item.route ? "page" : undefined}
        >
          <span>{item.icon}</span>
          {item.label}
        </a>
      ))}
    </aside>
  );
}

export function MobileAppNav() {
  const { route } = useChef();
  return (
    <nav
      className={`mobile-app-nav hidden max-[680px]:[&.show]:grid max-[680px]:[&.show]:grid-cols-4 max-[680px]:[&.show]:fixed max-[680px]:[&.show]:z-90 max-[680px]:[&.show]:bottom-0 max-[680px]:[&.show]:left-0 max-[680px]:[&.show]:right-0 max-[680px]:[&.show]:bg-[rgba(247,244,239,.96)] max-[680px]:[&.show]:backdrop-blur-[14px] max-[680px]:[&.show]:[border-top:1px_solid_var(--color-line)] max-[680px]:[&.show]:pt-2 max-[680px]:[&.show]:px-1 max-[680px]:[&.show]:pb-[max(8px,env(safe-area-inset-bottom))] max-[680px]:[&_a]:text-[.62rem] max-[680px]:[&_a]:text-center max-[680px]:[&_a]:text-[#607073] max-[680px]:[&_a_span]:block max-[680px]:[&_a_span]:text-[1.25rem] max-[680px]:[&_a_span]:leading-[1.1] max-[680px]:[&_a_span]:mb-[3px] max-[680px]:[&_a.active]:text-sand ${route !== "home" ? " show" : ""}`}
      aria-label="Mobil alkalmazás navigáció"
    >
      {navItems.slice(0, 4).map((item) => (
        <a
          key={item.route}
          href={`#${item.route}`}
          className={route === item.route ? "active" : ""}
          aria-current={route === item.route ? "page" : undefined}
        >
          <span>{item.icon}</span>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
