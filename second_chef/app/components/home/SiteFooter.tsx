export default function SiteFooter() {
  return (
    <footer className="site-footer bg-cocoa text-paper pt-20 px-[max(5vw,24px)] pb-7.5 max-[680px]:pt-15">
      <div className="footer-top flex justify-between items-start [border-bottom:1px_solid_rgba(255,255,255,.2)] pb-12.5 [&_p]:font-display [&_p]:text-[2.5rem] [&_p]:m-0 [&_p]:leading-[1] max-[680px]:flex-col max-[680px]:gap-[35px] max-[680px]:[&_p]:text-[2rem]">
        <a
          className="brand inline-flex items-center gap-[11px] font-bold tracking-[-.03em] text-[1.12rem] [&.light_.brand-mark]:bg-aqua [&.light_.brand-mark_i]:bg-cocoa max-[680px]:text-[1rem] light"
          href="#home"
        >
          <span className="brand-mark w-7 h-7 rounded-full bg-sand inline-grid place-items-center relative overflow-hidden [&_i]:absolute [&_i]:w-1 [&_i]:h-4.5 [&_i]:rounded-[9px] [&_i]:bg-paper [&_i]:[transform:rotate(45deg)] [&_i:last-child]:[transform:rotate(-45deg)] [&.large]:w-12 [&.large]:h-12 [&.large_i]:h-7.5 [&.large_i]:w-1.5">
            <i></i>
            <i></i>
          </span>
          <span>Second Chef</span>
        </a>
        <p>
          Okos recepttervezés,
          <br />
          emberi módon.
        </p>
      </div>
      <div className="footer-grid grid grid-cols-[1fr_1fr_1.5fr] gap-10 py-12.5 px-0 [&>div]:flex [&>div]:flex-col [&>div]:gap-2.5 [&_span]:text-[.7rem] [&_span]:uppercase [&_span]:tracking-[.15em] [&_span]:text-blush [&_span]:mb-2 [&_a]:w-max max-[680px]:grid-cols-2">
        <div>
          <span>Alkalmazás</span>
          <a href="#discover">Felfedezés</a>
          <a href="#pantry">Kamrám</a>
          <a href="#shopping">Bevásárlólista</a>
        </div>
        <div>
          <span>Információ</span>
          <a href="#home">Rólunk</a>
          <a href="#home">Adatvédelem</a>
          <a href="#home">Kapcsolat</a>
        </div>
        <div className="footer-note [&_p]:m-0 [&_p]:max-w-[460px] [&_p]:text-[#dcbeb4] max-[680px]:[grid-column:1/-1]">
          <span>Demó verzió</span>
          <p>
            A recept- és tápértékadatok bemutató adatok. Nem minősülnek
            egészségügyi tanácsnak.
          </p>
        </div>
      </div>
      <div className="footer-bottom flex justify-between text-[.72rem] text-[#dcbeb4] [border-top:1px_solid_rgba(255,255,255,.2)] pt-[25px] max-[680px]:flex-col max-[680px]:gap-2">
        <span>© 2026 Second Chef</span>
        <span>Budapest, HU</span>
      </div>
    </footer>
  );
}
