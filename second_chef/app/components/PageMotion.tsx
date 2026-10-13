'use client';

import { useEffect, useRef } from 'react';
import { useChef } from './SecondChefProvider';

// These effects only animate existing elements; React owns markup and app state.
export default function PageMotion() {
  const { route } = useChef();
  const progressBar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = document.querySelector<HTMLElement>('#hero');
    const image = document.querySelector<HTMLElement>('.hero-image');
    const story = document.querySelector<HTMLElement>('#scrollStory');
    const plate = document.querySelector<HTMLElement>('.plate-wrap');
    const steps = document.querySelectorAll('.story-step');
    const dots = document.querySelectorAll('.story-dots i');
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar.current) progressBar.current.style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
      if (route !== 'home' || !story) return;
      const distance = story.offsetHeight - window.innerHeight;
      const progress = distance > 0 ? Math.max(0, Math.min(1, -story.getBoundingClientRect().top / distance)) : 0;
      const step = Math.min(2, Math.floor(progress * 3));
      steps.forEach((element, index) => element.classList.toggle('active', index === step));
      dots.forEach((element, index) => element.classList.toggle('active', index === step));
      if (!reduce && plate) plate.style.transform = `rotate(${progress * 210 - 20}deg) scale(${.9 + progress * .13})`;
      if (!reduce && image) image.style.transform = `scale(${1.06 + Math.min(window.scrollY / 5000, .05)}) translateY(${Math.min(window.scrollY * .08, 45)}px)`;
    };
    let frame = 0;
    const scheduleScroll = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; onScroll(); }); };
    const onPointerMove = (event: PointerEvent) => {
      if (!reduce && image) image.style.transform = `scale(1.08) translate(${(event.clientX / innerWidth - .5) * 12}px,${(event.clientY / innerHeight - .5) * 8}px)`;
    };
    hero?.addEventListener('pointermove', onPointerMove);
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    onScroll();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); hero?.removeEventListener('pointermove', onPointerMove); window.removeEventListener('scroll', scheduleScroll); };
  }, [route]);
  return <><div ref={progressBar} className="scroll-progress" aria-hidden="true" /><div className="noise" aria-hidden="true" /></>;
}
