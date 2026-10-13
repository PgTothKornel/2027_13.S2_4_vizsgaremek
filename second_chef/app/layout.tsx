import type { Metadata, Viewport } from 'next';
import '@/app/ui/global.css';
import '@/app/ui/second-chef.css';

export const metadata: Metadata = {
  title: 'Second Chef — Főzz abból, amid van',
  description: 'Second Chef – személyre szabott receptek abból, ami már otthon van.',
};

export const viewport: Viewport = { themeColor: '#304C53' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="hu"><body>{children}</body></html>;
}
