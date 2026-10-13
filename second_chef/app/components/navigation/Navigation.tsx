'use client';

import { useEffect, useRef, useState } from 'react';
import { navItems } from '@/app/lib/demo-data';
import { useChef } from '../SecondChefProvider';

export function SiteHeader() {
  const { route, setSearch, setFilter, notify } = useChef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchDialog = useRef<HTMLDivElement>(null);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [route]);
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    document.body.classList.toggle('search-open', searchOpen);
    if (searchOpen) input.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); searchButton.current?.focus(); }
      if (event.key === 'Tab' && searchOpen) {
        const controls = searchDialog.current?.querySelectorAll<HTMLElement>('button, input');
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.classList.remove('menu-open', 'search-open'); window.removeEventListener('keydown', onKeyDown); };
  }, [menuOpen, searchOpen]);
  function performSearch(value: string) {
    const term = value.trim().toLocaleLowerCase('hu');
    setFilter(term.includes('fehérje') ? 'high-protein' : term.includes('gyors') ? 'quick' : 'all');
    setSearch(term.includes('fehérje') || term.includes('gyors') ? '' : value.trim());
    setSearchOpen(false);
    searchButton.current?.focus();
    window.location.hash = 'discover';
    notify(`Találatok: ${value}`);
  }
  return <>
    <header className={`site-header${route !== 'home' ? ' app-mode' : ''}`}>
      <a className="brand" href="#home" aria-label="Second Chef kezdőlap"><span className="brand-mark" aria-hidden="true"><i /><i /></span><span>Second Chef</span></a>
      <nav className="desktop-nav" aria-label="Fő navigáció">{navItems.slice(0, 4).map(item => <a key={item.route} href={`#${item.route}`}>{item.label}</a>)}</nav>
      <div className="header-actions">
        <button ref={searchButton} className="icon-button" aria-label="Keresés megnyitása" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>⌕</button>
        <a className="pill-button small" href="#discover">Mit főzzek?</a>
        <button className="menu-button" aria-label={menuOpen ? 'Menü bezárása' : 'Menü megnyitása'} aria-expanded={menuOpen} aria-controls="mobileMenu" onClick={() => setMenuOpen(open => !open)}><span /><span /></button>
      </div>
    </header>
    <nav className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobileMenu" hidden={!menuOpen} aria-label="Mobil menü">
      <a href="#home" onClick={() => setMenuOpen(false)}>Kezdőlap</a>
      {navItems.map(item => <a key={item.route} href={`#${item.route}`} onClick={() => setMenuOpen(false)}>{item.route === 'shopping' ? 'Bevásárlólista' : item.label}</a>)}
    </nav>
    <div ref={searchDialog} className={`search-overlay${searchOpen ? ' open' : ''}`} hidden={!searchOpen} role="dialog" aria-modal="true" aria-labelledby="searchLabel">
      <button className="close-search" aria-label="Keresés bezárása" onClick={() => { setSearchOpen(false); searchButton.current?.focus(); }}>×</button>
      <label id="searchLabel" htmlFor="globalSearch">Mit ennél ma?</label>
      <input ref={input} id="globalSearch" type="search" placeholder="pl. gyors vacsora csirkéből" autoComplete="off" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') performSearch(query); }} />
      <div className="search-suggestions">{['Gyors vacsora', 'Magas fehérje', 'Paradicsom', 'Lazac'].map(suggestion => <button key={suggestion} onClick={() => { setQuery(suggestion); performSearch(suggestion); }}>{suggestion}</button>)}</div>
    </div>
  </>;
}

export function AppSidebar() {
  const { route } = useChef();
  return <aside className="app-sidebar" aria-label="Alkalmazás navigáció">{navItems.map(item => <a key={item.route} href={`#${item.route}`} className={route === item.route ? 'active' : ''} aria-current={route === item.route ? 'page' : undefined}><span>{item.icon}</span>{item.label}</a>)}</aside>;
}

export function MobileAppNav() {
  const { route } = useChef();
  return <nav className={`mobile-app-nav${route !== 'home' ? ' show' : ''}`} aria-label="Mobil alkalmazás navigáció">{navItems.slice(0, 4).map(item => <a key={item.route} href={`#${item.route}`} className={route === item.route ? 'active' : ''} aria-current={route === item.route ? 'page' : undefined}><span>{item.icon}</span>{item.label}</a>)}</nav>;
}
