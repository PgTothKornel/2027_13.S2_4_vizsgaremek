'use client';

import { useState, type FormEvent } from 'react';
import { categories, type PantryItem } from '@/app/lib/demo-data';
import { useChef } from '../SecondChefProvider';
import Modal from '../Modal';

export default function PantryView() {
  const { pantry, setPantry, notify } = useChef();
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const groups = pantry.filter(item => item.name.toLocaleLowerCase('hu').includes(query.toLocaleLowerCase('hu'))).reduce<Record<string, PantryItem[]>>((result, item) => {
    (result[item.category] ??= []).push(item);
    return result;
  }, {});
  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    if (!name) return;
    const quantity = String(data.get('qty') ?? '');
    setPantry(current => [...current, { id: Date.now(), name, qty: quantity ? Number(quantity) : null, unit: String(data.get('unit')), category: String(data.get('category')) }]);
    form.reset();
    setAdding(false);
    notify('Alapanyag hozzáadva');
  }
  return <>
    <header className="app-heading"><div><p className="eyebrow dark">Ami már megvan</p><h1>Kamrám</h1><p className="muted">{pantry.length} alapanyag, csoportosítva.</p></div><button className="pill-button coral" onClick={() => setAdding(true)}>+ Alapanyag</button></header>
    <div className="pantry-tools"><input type="search" aria-label="Keresés a kamrában" placeholder="Keresés a kamrában…" value={query} onChange={event => setQuery(event.target.value)} /><button onClick={() => notify('A fotófelismerés demóban kézi jóváhagyással működne.')}>▣ Fotó elemzése</button></div>
    <div className="pantry-groups">{Object.entries(groups).map(([category, items]) => <section className="pantry-group" key={category}><h2>{category}</h2>{items.map(item => <div className="pantry-item" key={item.id}><div><strong>{item.name}</strong><small>{item.qty === null ? 'Mennyiség nincs megadva' : 'Készleten'}</small></div><span>{item.qty ?? '—'} {item.unit}</span><button aria-label={`${item.name} törlése`} onClick={() => { setPantry(current => current.filter(value => value.id !== item.id)); notify('Alapanyag eltávolítva'); }}>×</button></div>)}</section>)}
      {!Object.keys(groups).length && <div className="empty-state"><span>⌕</span><h2>Nincs találat.</h2><p>Próbálj más kifejezést, vagy adj hozzá egy alapanyagot.</p></div>}
    </div>
    <Modal open={adding} onClose={() => setAdding(false)} label="Alapanyag hozzáadása" small>
      <h2>Alapanyag hozzáadása</h2><form onSubmit={addItem}><label>Név<input name="name" required placeholder="pl. csicseriborsó" /></label><div className="form-row"><label>Mennyiség<input name="qty" type="number" min="0" step="0.1" placeholder="2" /></label><label>Egység<select name="unit">{['db', 'g', 'kg', 'ml', 'csomag'].map(unit => <option key={unit}>{unit}</option>)}</select></label></div><label>Kategória<select name="category">{categories.map(category => <option key={category}>{category}</option>)}</select></label><button className="pill-button coral" type="submit">Mentés a kamrába</button></form>
    </Modal>
  </>;
}
