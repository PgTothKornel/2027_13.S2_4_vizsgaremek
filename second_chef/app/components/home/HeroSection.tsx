export default function HeroSection() {
  return (
    <section
      className="hero min-h-[100svh] relative overflow-hidden bg-cocoa text-white flex items-center pt-37.5 px-[max(5vw,24px)] pb-22.5 max-[680px]:pt-30 max-[680px]:px-5 max-[680px]:pb-20 max-[680px]:items-end max-[680px]:min-h-[800px]"
      id="hero"
    >
      <img
        className="hero-image absolute inset-0 w-full h-full object-cover [transform:scale(1.06)] will-change-transform [filter:saturate(.92)]"
        src="/assets/hero-pasta.png"
        alt="Friss paradicsomos tészta sült paradicsommal és bazsalikommal"
      />
      <div className="hero-shade absolute inset-0 w-full h-full object-cover [background:linear-gradient(90deg,rgba(23,29,29,.78)_0%,rgba(23,29,29,.2)_58%,rgba(23,29,29,.35)_100%),linear-gradient(0deg,rgba(31,17,12,.6),transparent_50%)] max-[680px]:[background:linear-gradient(0deg,rgba(24,23,20,.84),rgba(24,23,20,.05)_72%)]"></div>
      <div
        className="hero-orbit absolute z-1 [border:1px_solid_rgba(255,255,255,.27)] rounded-full pointer-events-none orbit-one w-[38vw] h-[38vw] right-[-12vw] top-[-12vw]"
        aria-hidden="true"
      ></div>
      <div
        className="hero-orbit absolute z-1 [border:1px_solid_rgba(255,255,255,.27)] rounded-full pointer-events-none orbit-two w-[22vw] h-[22vw] right-[12vw] bottom-[-13vw]"
        aria-hidden="true"
      ></div>
      <div className="hero-content relative z-2 w-[min(800px,74vw)] max-[980px]:w-full">
        <p className="eyebrow uppercase text-[.75rem] tracking-[.18em] font-bold mt-0 mx-0 mb-4.5 [&.dark]:text-sand reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
          A második séf a konyhádban
        </p>
        <h1
          className="hero-title font-display font-normal tracking-[-.055em] text-[clamp(4rem,9vw,9.6rem)] leading-[.78] m-0 [&_span]:block [&_.script]:italic [&_.script]:ml-[8vw] [&_.script]:text-aqua max-[680px]:text-[clamp(3.75rem,17vw,6.1rem)] max-[680px]:leading-[.82] max-[680px]:[&_.script]:ml-0"
          aria-label="Kevesebb keresés. Több főzés."
        >
          <span className="title-line">Kevesebb keresés.</span>
          <span className="title-line script">Több főzés.</span>
        </h1>
        <p className="hero-copy text-[clamp(1.05rem,1.4vw,1.3rem)] max-w-[570px] mt-8.5 mx-0 mb-7 max-[680px]:text-[1rem] reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
          Mondd el, mi van otthon. Mi megmutatjuk, mi lehet belőle — az
          ízlésedhez, idődhöz és céljaidhoz igazítva.
        </p>
        <div className="hero-actions flex gap-6 items-center max-[680px]:items-start max-[680px]:flex-col max-[680px]:gap-4.5 reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
          <a
            className="pill-button inline-flex items-center justify-center border-0 rounded-full py-[15px] px-[23px] font-bold bg-deep text-cream cursor-pointer [transition:transform_.3s_var(--ease-chef),background_.3s] hover:[transform:translateY(-2px)_scale(1.015)] [&.small]:py-[11px] [&.small]:px-4.5 [&.small]:text-[.86rem] [&.coral]:bg-sand [&.coral:hover]:bg-[#aa5c42] coral"
            href="#discover"
          >
            Mutass recepteket
          </a>
          <a
            className="text-link font-bold [border-bottom:1px_solid_rgba(255,255,255,.5)] pb-[5px] [&_span]:ml-2"
            href="#pantry"
          >
            Feltöltöm a kamrám <span>↘</span>
          </a>
        </div>
      </div>
      <div className="hero-stat absolute z-2 right-[5vw] bottom-15.5 flex items-center gap-[15px] text-[.78rem] leading-[1.3] max-[980px]:hidden reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
        <span className="stat-number font-display text-[4.4rem] leading-[.8] [&_small]:font-sans [&_small]:text-[.65rem] [&_small]:ml-1">
          18<small>perc</small>
        </span>
        <span>
          és már az asztalon
          <br />
          lehet a vacsora
        </span>
      </div>
      <div
        className="scroll-cue absolute z-2 left-[50%] bottom-6 [transform:translateX(-50%)] text-[.65rem] tracking-[.18em] uppercase flex items-center gap-2 [&_span]:block [&_span]:w-8.5 [&_span]:h-[1px] [&_span]:bg-white [&_span]:animate-[stretch_1.8s_infinite] max-[680px]:hidden"
        aria-hidden="true"
      >
        <span></span>Görgess
      </div>
    </section>
  );
}
