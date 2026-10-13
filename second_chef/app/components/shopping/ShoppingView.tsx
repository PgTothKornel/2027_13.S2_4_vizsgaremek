'use client';

import type { FormEvent } from 'react';
import { useChef } from '../SecondChefProvider';

export default function ShoppingView() {
  const { shopping, setShopping, notify } = useChef();
  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    if (!name) return;
    setShopping(current => [...current, { id: Date.now(), name, qty: String(data.get('qty') ?? '').trim(), source: 'Kézzel hozzáadva', bought: false }]);
    form.reset();
    notify('Tétel hozzáadva');
  }
  function clearBought() {
    const count = shopping.filter(item => item.bought).length;
    setShopping(current => current.filter(item => !item.bought));
    notify(count ? `${count} megvett tétel törölve` : 'Nincs megvett tétel');
  }
  return <>
    <header className="app-heading"><div><p className="eyebrow dark">Ami még hiányzik</p><h1>Bevásárlólista</h1><p className="muted">A receptekből és kézzel hozzáadott tételekből.</p></div><button className="subtle-button" onClick={clearBought}>Megvettek törlése</button></header>
    <form className="add-item-form" onSubmit={addItem}><input name="name" aria-label="Új tétel hozzáadása" placeholder="Új tétel hozzáadása" required /><input name="qty" aria-label="Mennyiség" placeholder="Mennyiség" /><button className="pill-button coral" type="submit">Hozzáadás</button></form>
    <div className="shopping-list">{shopping.length ? shopping.map(item => <div className={`shopping-row${item.bought ? ' bought' : ''}`} key={item.id}>
      <input type="checkbox" checked={item.bought} aria-label={`${item.name} megjelölése`} onChange={event => { const bought = event.target.checked; setShopping(current => current.map(value => value.id === item.id ? { ...value, bought } : value)); }} />
      <div><strong>{item.name}</strong><small>{item.source || 'Kézzel hozzáadva'}</small></div><span>{item.qty}</span><button aria-label={`${item.name} törlése`} onClick={() => setShopping(current => current.filter(value => value.id !== item.id))}>×</button>
    </div>) : <div className="empty-state"><span>✓</span><h2>A listád üres.</h2><p>Minden megvan a következő főzéshez.</p></div>}</div>
  </>;
}
