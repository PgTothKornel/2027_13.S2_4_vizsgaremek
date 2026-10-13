'use client';

import type { ReactNode } from 'react';
import type { Route } from '@/app/lib/demo-data';
import { useChef } from './SecondChefProvider';
import { AppSidebar } from './navigation/Navigation';

export default function PageView({ name, children }: { name: Route; children: ReactNode }) {
  const { route } = useChef();
  const app = name !== 'home';
  return <section className={`page-view${app ? ' app-page' : ''}${route === name ? ' active' : ''}`} data-route={name} hidden={route !== name} aria-label={name === 'home' ? 'Kezdőlap' : undefined}>
    {app ? <div className="app-shell"><AppSidebar /><section className={`app-content${name === 'shopping' ? ' shopping-page' : ''}`}>{children}</section></div> : children}
  </section>;
}
