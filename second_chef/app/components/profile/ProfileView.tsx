'use client';

import { useEffect, useState } from 'react';
import { useChef } from '../SecondChefProvider';

const diets = ['Mindenevő', 'Vegetáriánus', 'Vegán', 'Halat fogyasztó'];
const allergyOptions = ['Tej', 'Glutén', 'Tojás', 'Diófélék'];
const macroLabels = ['Energia', 'Fehérje', 'Szénhidrát', 'Zsír'];

export default function ProfileView() {
  const { notify } = useChef();
  const [diet, setDiet] = useState('Mindenevő');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [macros, setMacros] = useState([550, 35, 55, 20]);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('secondchef-profile') ?? 'null');
      if (saved && diets.includes(saved.diet) && Array.isArray(saved.allergies) && saved.allergies.every((value: unknown) => typeof value === 'string' && allergyOptions.includes(value)) && Array.isArray(saved.macros) && saved.macros.length === 4 && saved.macros.every((value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0)) {
        setDiet(saved.diet); setAllergies(saved.allergies); setMacros(saved.macros);
      }
    } catch { /* Keep defaults when storage is unavailable. */ }
  }, []);
  function saveProfile() {
    try { localStorage.setItem('secondchef-profile', JSON.stringify({ diet, allergies, macros })); notify('Beállítások elmentve'); }
    catch { notify('A böngésző nem engedélyezi a beállítások mentését.'); }
  }
  return <>
    <header className="app-heading"><div><p className="eyebrow dark">Személyes beállítások</p><h1>Profil</h1><p className="muted">Ezek alapján személyre szabjuk a találatokat.</p></div><button className="pill-button coral" onClick={saveProfile}>Mentés</button></header>
    <div className="settings-grid">
      <article className="settings-card"><span>Étrend</span><h2>Mit szeretsz enni?</h2><div className="choice-grid">{diets.map(value => <button key={value} className={diet === value ? 'active' : ''} aria-pressed={diet === value} onClick={() => setDiet(value)}>{value}</button>)}</div></article>
      <article className="settings-card"><span>Allergiák</span><h2>Mit zárjunk ki?</h2><div className="choice-grid multi">{allergyOptions.map(value => <button key={value} className={allergies.includes(value) ? 'active' : ''} aria-pressed={allergies.includes(value)} onClick={() => setAllergies(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value])}>{value}</button>)}</div><p className="safety-note">A megadott allergénadatok szerint. Keresztszennyeződésre nem adható garancia.</p></article>
      <article className="settings-card wide"><span>Étkezésenkénti célok</span><h2>Makrók egy adaghoz</h2><div className="macro-inputs">{macroLabels.map((label, index) => <label key={label}>{label}<input type="number" min="0" value={macros[index]} onChange={event => { const value = Math.max(0, Number(event.target.value)); setMacros(current => current.map((macro, position) => position === index ? value : macro)); }} /><small>{index === 0 ? 'kcal' : 'g'}</small></label>)}</div></article>
    </div>
  </>;
}
