export default function FeaturesSection() {
  return (
    <section className="feature-band bg-blush section-pad py-30 px-[max(5vw,24px)] max-[680px]:py-20.5 max-[680px]:px-5">
      <div className="section-kicker text-[.72rem] uppercase tracking-[.15em] font-bold flex items-center gap-2.5 mb-12.5 [&_span]:grid [&_span]:place-items-center [&_span]:w-7 [&_span]:h-7 [&_span]:[border:1px_solid_currentColor] [&_span]:rounded-full [&.light]:text-aqua reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
        <span>03</span> Nem fekete doboz
      </div>
      <div className="feature-layout grid grid-cols-2 gap-[7vw] items-start max-[980px]:grid-cols-1 max-[980px]:gap-15">
        <h2 className="display-heading font-display font-normal tracking-[-.045em] text-[clamp(3.2rem,7vw,7.5rem)] leading-[.91] m-0 [&_em]:text-sand [&_em]:font-normal max-[680px]:text-[clamp(3.2rem,14vw,5.2rem)] reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
          Érthető ajánlások.
          <br />
          <em>Valódi döntések.</em>
        </h2>
        <div className="feature-list [border-top:1px_solid_rgba(90,47,37,.3)]">
          <article className="feature-row grid grid-cols-[44px_1fr_70px] gap-4.5 [border-bottom:1px_solid_rgba(90,47,37,.3)] py-7.5 px-0 items-start [&>span]:text-[.7rem] [&_h3]:mt-0 [&_h3]:mx-0 [&_h3]:mb-2 [&_h3]:text-[1.15rem] [&_p]:m-0 [&_p]:text-[.9rem] [&_p]:max-w-[430px] [&_p]:text-[#6d4c43] [&>b]:font-display [&>b]:text-[2.5rem] [&>b]:font-normal max-[680px]:grid-cols-[30px_1fr_45px] max-[680px]:gap-2.5 max-[680px]:[&>b]:text-[1.7rem] reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
            <span>01</span>
            <div>
              <h3>Kamra-egyezés</h3>
              <p>
                Pontosan látod, melyik alapanyag van meg, és melyikhez kell még
                bevásárolni.
              </p>
            </div>
            <b>65%</b>
          </article>
          <article className="feature-row grid grid-cols-[44px_1fr_70px] gap-4.5 [border-bottom:1px_solid_rgba(90,47,37,.3)] py-7.5 px-0 items-start [&>span]:text-[.7rem] [&_h3]:mt-0 [&_h3]:mx-0 [&_h3]:mb-2 [&_h3]:text-[1.15rem] [&_p]:m-0 [&_p]:text-[.9rem] [&_p]:max-w-[430px] [&_p]:text-[#6d4c43] [&>b]:font-display [&>b]:text-[2.5rem] [&>b]:font-normal max-[680px]:grid-cols-[30px_1fr_45px] max-[680px]:gap-2.5 max-[680px]:[&>b]:text-[1.7rem] reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
            <span>02</span>
            <div>
              <h3>Célhoz igazítva</h3>
              <p>
                A személyes étkezésenkénti makrócélokhoz illesztve — adagonként,
                nem az egész fazékra.
              </p>
            </div>
            <b>25%</b>
          </article>
          <article className="feature-row grid grid-cols-[44px_1fr_70px] gap-4.5 [border-bottom:1px_solid_rgba(90,47,37,.3)] py-7.5 px-0 items-start [&>span]:text-[.7rem] [&_h3]:mt-0 [&_h3]:mx-0 [&_h3]:mb-2 [&_h3]:text-[1.15rem] [&_p]:m-0 [&_p]:text-[.9rem] [&_p]:max-w-[430px] [&_p]:text-[#6d4c43] [&>b]:font-display [&>b]:text-[2.5rem] [&>b]:font-normal max-[680px]:grid-cols-[30px_1fr_45px] max-[680px]:gap-2.5 max-[680px]:[&>b]:text-[1.7rem] reveal opacity-0 [transform:translateY(35px)] [transition:opacity_.8s_var(--ease-chef),transform_.8s_var(--ease-chef)] [&.visible]:opacity-100 [&.visible]:[transform:none]">
            <span>03</span>
            <div>
              <h3>Belefér az idődbe</h3>
              <p>
                A teljes elkészítési idő számít. A hiányzó adat nem válik
                automatikusan pozitív találattá.
              </p>
            </div>
            <b>10%</b>
          </article>
        </div>
      </div>
    </section>
  );
}
