"use client";

import { useEffect, useState } from 'react';
import { defaultMacros, type Profile } from '@/app/lib/chef-data';
import { useChef } from '../SecondChefProvider';

const card = 'bg-cream p-7 rounded-3xl';
const choice = 'border border-line rounded-full px-4 py-2.5 cursor-pointer';
const labels = ['Energia', 'Fehérje', 'Szénhidrát', 'Zsír'];

export default function ProfileView() {
  const { data, loading, saving, saveProfile } = useChef();
  const [profile, setProfile] = useState<Profile>({ preference: '', allergyIds: [], macros: [...defaultMacros] });
  useEffect(() => { if (data) setProfile(data.profile); }, [data]);
  return <>
    <header className="mb-10 flex items-end justify-between gap-4">
      <div><p className="text-xs uppercase tracking-widest text-sand">Személyes beállítások</p>
        <h1 className="font-display text-6xl mb-3">Profil</h1>
        <p>Ezek alapján személyre szabjuk a találatokat.</p>
      </div>
      <button type="button" disabled={saving || loading || !data}
        className="rounded-full bg-sand text-white px-6 py-3 disabled:opacity-50"
        onClick={() => void saveProfile(profile)}>{saving ? 'Mentés…' : 'Mentés'}</button>
    </header>
    {loading && <p role="status">Profil betöltése…</p>}
    <fieldset disabled={loading || saving || !data} className="grid grid-cols-2 gap-5 max-[680px]:grid-cols-1 disabled:opacity-60">
      <section className={card}>
        <h2 className="font-display text-3xl mb-5">Kedvenc receptkategória</h2>
        <p className="mb-4 text-sm">Az ajánlott receptek ebből a kategóriából kerülnek ki, a kamrád alapján.</p>
        <label className="block">Kategória
          <select className="block w-full mt-2 border border-line rounded-xl p-3 bg-paper"
            value={profile.preference} onChange={event => setProfile(current => ({ ...current, preference: event.target.value }))}>
            <option value="">Bármelyik kategória</option>
            {data?.categories.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
          </select>
        </label>
      </section>
      <section className={card}>
        <h2 className="font-display text-3xl mb-5">Mit zárjunk ki?</h2>
        <div className="flex flex-wrap gap-2">{data?.allergens.map(item => {
          const selected = profile.allergyIds.includes(item.id);
          return <button key={item.id} type="button" aria-pressed={selected}
            className={`${choice} ${selected ? 'bg-deep text-white' : ''}`}
            onClick={() => setProfile(current => ({ ...current, allergyIds: selected
              ? current.allergyIds.filter(id => id !== item.id) : [...current.allergyIds, item.id] }))}>{item.name}</button>;
        })}</div>
        <p className="text-xs text-[#778487] mt-5">A kizárás az adatbázisban rögzített allergénadatokra épül. Keresztszennyeződésre nem adható garancia.</p>
      </section>
      <section className={`${card} col-span-full`}>
        <h2 className="font-display text-3xl mb-5">Makrócélok egy adaghoz</h2>
        <p className="text-sm mb-4">Azonos alapanyag-egyezésnél a céljaidhoz közelebbi receptek kerülnek előrébb.</p>
        <div className="grid grid-cols-4 gap-3 max-[680px]:grid-cols-2">
          {labels.map((label, index) => <label key={label}>{label} ({index === 0 ? 'kcal' : 'g'})
            <input className="block w-full mt-2 p-3 border border-line rounded-xl bg-paper" type="number"
              min={0} max={index === 0 ? 20000 : 2000} value={profile.macros[index]}
              onChange={event => {
                const value = Math.min(index === 0 ? 20000 : 2000, Math.max(0, Number(event.target.value)));
                setProfile(current => ({ ...current, macros: current.macros.map((macro, position) =>
                  position === index ? value : macro) as Profile['macros'] }));
              }} />
          </label>)}
        </div>
      </section>
    </fieldset>
  </>;
}
