export default function CallToAction() {
  return (
    <section className="cta-scene min-h-[820px] bg-aqua relative overflow-hidden grid place-items-center py-25 px-6 max-[680px]:min-h-[680px]">
      <div
        className="cta-word absolute font-display text-[32vw] text-[rgba(48,76,83,.11)] leading-[1] tracking-[-.08em] whitespace-nowrap"
        aria-hidden="true"
      >
        FŐZZ
      </div>
      <div className="cta-card relative bg-paper text-center py-15 px-[clamp(30px,6vw,90px)] rounded-[40px] max-w-[860px] shadow-[0_30px_70px_rgba(48,76,83,.12)] [&_p]:mt-6 [&_p]:mx-0 [&_p]:mb-3.5 [&_h2]:font-display [&_h2]:text-[clamp(3.2rem,7vw,6.8rem)] [&_h2]:leading-[.85] [&_h2]:font-normal [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-[35px] [&_h2_em]:text-sand [&_h2_em]:font-normal max-[680px]:py-12.5 max-[680px]:px-5.5 max-[680px]:rounded-[30px] reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
        <span className="brand-mark w-7 h-7 rounded-full bg-sand inline-grid place-items-center relative overflow-hidden [&_i]:absolute [&_i]:w-1 [&_i]:h-4.5 [&_i]:rounded-[9px] [&_i]:bg-paper [&_i]:[transform:rotate(45deg)] [&_i:last-child]:[transform:rotate(-45deg)] [&.large]:w-12 [&.large]:h-12 [&.large_i]:h-7.5 [&.large_i]:w-1.5 large">
          <i></i>
          <i></i>
        </span>
        <p>A ma esti vacsora közelebb van, mint gondolnád.</p>
        <h2>
          Nyisd ki a kamrát.
          <br />
          <em>Mi folytatjuk.</em>
        </h2>
        <a
          href="#pantry"
          className="pill-button inline-flex items-center justify-center border-0 rounded-full py-[15px] px-[23px] font-bold bg-deep text-cream cursor-pointer [transition:transform_.3s_var(--ease-chef),background_.3s] hover:[transform:translateY(-2px)_scale(1.015)] [&.small]:py-[11px] [&.small]:px-4.5 [&.small]:text-[.86rem] [&.coral]:bg-sand [&.coral:hover]:bg-[#aa5c42] coral"
        >
          Kamra feltöltése
        </a>
      </div>
    </section>
  );
}
