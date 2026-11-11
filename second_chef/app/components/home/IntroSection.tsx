export default function IntroSection() {
  return (
    <section className="intro bg-paper section-pad py-30 px-[max(5vw,24px)] max-[680px]:py-20.5 max-[680px]:px-5">
      <div className="section-kicker text-[.72rem] uppercase tracking-[.15em] font-bold flex items-center gap-2.5 mb-12.5 [&_span]:grid [&_span]:place-items-center [&_span]:w-7 [&_span]:h-7 [&_span]:[border:1px_solid_currentColor] [&_span]:rounded-full [&.light]:text-aqua reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
        <span>01</span> A napi kérdés
      </div>
      <div className="intro-grid grid grid-cols-[1.4fr_.65fr] gap-[7vw] items-end max-[980px]:grid-cols-1 max-[680px]:gap-10">
        <h2 className="display-heading font-display font-normal tracking-[-.045em] text-[clamp(3.2rem,7vw,7.5rem)] leading-[.91] m-0 [&_em]:text-sand [&_em]:font-normal max-[680px]:text-[clamp(3.2rem,14vw,5.2rem)] reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
          Nem az a kérdés,
          <br />
          mit ennél.
        </h2>
        <div className="intro-answer text-[clamp(1.3rem,2vw,2rem)] max-w-[570px] [&_.muted]:text-[1rem] [&_.muted]:mt-7.5 max-[980px]:ml-auto max-[680px]:text-[1.35rem] reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
          <p>Hanem hogy mi készülhet abból, ami már nálad van.</p>
          <p className="muted text-[#637174]">
            A Second Chef összehangolja a kamrádat, az idődet, a preferenciáidat
            és a tápanyagcéljaidat — majd érthetően megmutatja a legjobb
            következő fogást.
          </p>
        </div>
      </div>
    </section>
  );
}
