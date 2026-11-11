"use client";

import type { ReactNode } from "react";
import type { Route } from "@/app/lib/demo-data";
import { useChef } from "./SecondChefProvider";
import { AppSidebar } from "./navigation/Navigation";

export default function PageView({
  name,
  children,
}: {
  name: Route;
  children: ReactNode;
}) {
  const { route, error, loading, refresh } = useChef();
  const app = name !== "home";
  return (
    <section
      className={`page-view hidden animate-[pageIn_.6s_var(--ease-chef)] [&.active]:block ${app ? " app-page min-h-[100vh] bg-paper pt-16 max-[680px]:pt-14.5 max-[680px]:pb-18.5" : ""} ${route === name ? " active" : ""}`}
      data-route={name}
      hidden={route !== name}
      aria-label={name === "home" ? "Kezdőlap" : undefined}
    >
      {app ? (
        <div className="app-shell min-h-[calc(100vh_-_64px)] grid grid-cols-[235px_1fr] max-[980px]:grid-cols-[minmax(0,1fr)]">
          <AppSidebar />
          <section
            className={`app-content pt-15 px-[clamp(24px,5vw,80px)] pb-25 max-w-[1440px] w-full my-0 mx-auto min-w-0 max-[680px]:pt-10.5 max-[680px]:px-4 max-[680px]:pb-17.5 ${name === "shopping" ? " shopping-page [&.shopping-page]:max-w-[1050px]" : ""}`}
          >
            {error && name !== 'shopping' && <div role="status" className="mb-6 rounded-2xl border border-line bg-cream p-4 text-sm">
              <p className="m-0">{error}</p>
              <button type="button" className="mt-2 underline disabled:opacity-50" disabled={loading}
                onClick={() => void refresh()}>Adatok újratöltése</button>
            </div>}
            {children}
          </section>
        </div>
      ) : (
        children
      )}
    </section>
  );
}
