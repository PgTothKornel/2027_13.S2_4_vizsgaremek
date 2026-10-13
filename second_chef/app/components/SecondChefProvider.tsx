'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { defaultPantry, defaultShopping, navItems, type PantryItem, type Recipe, type Route, type ShoppingItem } from '@/app/lib/demo-data';

// Read browser storage after hydration so server and initial client markup agree.
function useStoredState<T>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(fallback);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(`secondchef-${key}`) ?? 'null');
      if (Array.isArray(saved)) setValue(saved as T);
    } catch { /* Use defaults when storage is unavailable. */ }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) {
      try { localStorage.setItem(`secondchef-${key}`, JSON.stringify(value)); } catch { /* State remains usable in memory. */ }
    }
  }, [key, ready, value]);
  return [value, setValue];
}

type ChefState = {
  route: Route;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  pantry: PantryItem[];
  setPantry: Dispatch<SetStateAction<PantryItem[]>>;
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
  if (!context) throw new Error('A SecondChefProvider komponens szükséges.');
  return context;
}

export default function SecondChefProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [favorites, setFavorites] = useStoredState('favorites', ['pasta']);
  const [pantry, setPantry] = useStoredState('pantry', defaultPantry);
  const [shopping, setShopping] = useStoredState('shopping', defaultShopping);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = useCallback((text: string) => {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(''), 2400);
  }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    const updateRoute = () => {
      const hash = window.location.hash.slice(1);
      setRoute(navItems.some(item => item.route === hash) ? hash as Route : 'home');
      setSelectedRecipe(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    updateRoute();
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);
  const toggleFavorite = (id: string) => {
    const saved = favorites.includes(id);
    setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    notify(saved ? 'Eltávolítva a kedvencekből' : 'Recept elmentve');
  };
  return (
    <ChefContext.Provider value={{ route, favorites, toggleFavorite, pantry, setPantry, shopping, setShopping, filter, setFilter, search, setSearch, selectedRecipe, setSelectedRecipe, notify }}>
      {children}
      <div className={`toast${message ? ' show' : ''}`} role="status" aria-live="polite">{message}</div>
    </ChefContext.Provider>
  );
}
