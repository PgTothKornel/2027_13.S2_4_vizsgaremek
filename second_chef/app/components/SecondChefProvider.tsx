"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  defaultShopping,
  navItems,
  type PantryItem,
  type Recipe,
  type Route,
  type ShoppingItem,
} from "@/app/lib/demo-data";
import type { ChefData, Profile } from '@/app/lib/chef-data';

// Read browser storage after hydration so server and initial client markup agree.
function useStoredState<T>(
  key: string,
  fallback: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(fallback);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(`secondchef-${key}`) ?? "null",
      );
      if (Array.isArray(saved)) setValue(saved as T);
    } catch {
      /* Use defaults when storage is unavailable. */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(`secondchef-${key}`, JSON.stringify(value));
      } catch {
        /* State remains usable in memory. */
      }
    }
  }, [key, ready, value]);
  return [value, setValue];
}

type ChefState = {
  route: Route;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  pantry: PantryItem[];
  data: ChefData | null;
  recipes: Recipe[];
  loading: boolean;
  saving: boolean;
  error: string;
  refresh: () => Promise<void>;
  addPantry: (item: { ingredientId: number; qty: number | null; unit: string; category: string }) => Promise<boolean>;
  removePantry: (ingredientId: number) => Promise<boolean>;
  saveProfile: (profile: Profile) => Promise<boolean>;
  shopping: ShoppingItem[];
  setShopping: Dispatch<SetStateAction<ShoppingItem[]>>;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: Dispatch<SetStateAction<Recipe | null>>;
  notify: (message: string) => void;
};
const ChefContext = createContext<ChefState | null>(null);
export function useChef() {
  const context = useContext(ChefContext);
  if (!context) throw new Error("A SecondChefProvider komponens szükséges.");
  return context;
}

export default function SecondChefProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [route, setRoute] = useState<Route>("home");
  const [favorites, setFavorites] = useStoredState<string[]>("favorites", []);
  const [data, setData] = useState<ChefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errorNoticeOpen, setErrorNoticeOpen] = useState(false);
  const inFlight = useRef(false);
  const [shopping, setShopping] = useStoredState("shopping", defaultShopping);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = useCallback((text: string) => {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 2400);
  }, []);
  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    setErrorNoticeOpen(false);
    try {
      const response = await fetch('/api/chef', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Nem sikerült betölteni az adatokat.');
      setData(result);
    } catch (cause) {
      // Do not show stale recommendations after an allergy/profile change.
      setData(null);
      setError(cause instanceof Error ? cause.message : 'Nem sikerült betölteni az adatokat.');
      setErrorNoticeOpen(true);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    if (!errorNoticeOpen) return;
    const timeout = setTimeout(() => setErrorNoticeOpen(false), 6000);
    return () => clearTimeout(timeout);
  }, [errorNoticeOpen]);
  async function mutate(path: string, method: string, body: unknown) {
    if (inFlight.current) return false;
    inFlight.current = true;
    setSaving(true);
    try {
      const response = await fetch(`/api/chef/${path}`, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'A mentés nem sikerült.');
      setSelectedRecipe(null);
      await refresh();
      notify('Adatok elmentve az adatbázisba');
      return true;
    } catch (cause) {
      notify(cause instanceof Error ? cause.message : 'A mentés nem sikerült.');
      return false;
    } finally { inFlight.current = false; setSaving(false); }
  }
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    const updateRoute = () => {
      const hash = window.location.hash.slice(1);
      setRoute(
        navItems.some((item) => item.route === hash) ? (hash as Route) : "home",
      );
      setSelectedRecipe(null);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    updateRoute();
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);
  const toggleFavorite = (id: string) => {
    const saved = favorites.includes(id);
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    notify(saved ? "Eltávolítva a kedvencekből" : "Recept elmentve");
  };
  return (
    <ChefContext.Provider
      value={{
        route,
        favorites,
        toggleFavorite,
        pantry: data?.pantry ?? [],
        data,
        recipes: data?.recipes ?? [],
        loading,
        saving,
        error,
        refresh,
        addPantry: item => mutate('pantry', 'POST', item),
        removePantry: ingredientId => mutate('pantry', 'DELETE', { ingredientId }),
        saveProfile: profile => mutate('profile', 'PATCH', profile),
        shopping,
        setShopping,
        filter,
        setFilter,
        search,
        setSearch,
        selectedRecipe,
        setSelectedRecipe,
        notify,
      }}
    >
      {children}
      <div className="fixed bottom-20 min-[681px]:bottom-3 left-3 z-40 rounded-full bg-deep px-4 py-2 text-xs text-white" role="status">
        Tesztfiók{data ? ` · #${data.userId}` : ''} · közös adatbázisos profil
      </div>
      {error && errorNoticeOpen && <div className="pointer-events-none fixed bottom-32 min-[681px]:bottom-16 left-4 right-4 z-500 flex justify-end">
        <div role="alert" className="pointer-events-auto relative w-full max-w-sm rounded-2xl border border-line bg-cream p-4 pr-12 text-deep shadow-lg">
          <p className="m-0 text-sm">{error}</p>
          <button type="button" className="mt-2 underline text-sm disabled:opacity-50" disabled={loading}
            onClick={() => void refresh()}>Újrapróbálás</button>
          <button type="button" aria-label="Hibaüzenet bezárása"
            className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full text-2xl hover:bg-aqua focus-visible:outline-2 focus-visible:outline-deep"
            onClick={() => setErrorNoticeOpen(false)}>×</button>
        </div>
      </div>}
      <div
        className={`toast fixed z-500 left-[50%] bottom-7.5 [transform:translate(-50%,30px)] bg-deep text-white py-[13px] px-5 rounded-full text-[.88rem] opacity-0 pointer-events-none [transition:.35s_var(--ease-chef)] [&.show]:opacity-100 [&.show]:[transform:translate(-50%,0)] max-[680px]:bottom-[85px] max-[680px]:whitespace-nowrap ${message ? " show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </div>
    </ChefContext.Provider>
  );
}
