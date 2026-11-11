export default function HowItWorks() {
  return (
    <section
      className="scroll-story h-[300vh] bg-deep text-white"
      id="scrollStory"
    >
      <div className="story-sticky h-[100vh] sticky top-0 grid grid-cols-[1fr_1.1fr] pt-27.5 px-[max(5vw,24px)] pb-12.5 overflow-hidden max-[980px]:grid-cols-1 max-[980px]:pt-25 max-[680px]:pt-23 max-[680px]:px-5 max-[680px]:pb-10">
        <div className="story-copy relative z-2 max-[980px]:z-3">
          <div className="section-kicker text-[.72rem] uppercase tracking-[.15em] font-bold flex items-center gap-2.5 mb-12.5 [&_span]:grid [&_span]:place-items-center [&_span]:w-7 [&_span]:h-7 [&_span]:[border:1px_solid_currentColor] [&_span]:rounded-full [&.light]:text-aqua light">
            <span>02</span> Így működik
          </div>
          <div
            className="story-step absolute left-[max(5vw,24px)] top-[32%] max-w-[540px] opacity-0 [transform:translateY(35px)] [transition:.65s_var(--ease-chef)] pointer-events-none [&.active]:opacity-100 [&.active]:[transform:none] [&>span]:text-[.75rem] [&>span]:tracking-[.2em] [&>span]:text-blush [&_h3]:font-display [&_h3]:text-[clamp(3rem,5.5vw,6.4rem)] [&_h3]:leading-[.9] [&_h3]:font-normal [&_h3]:mt-4.5 [&_h3]:mx-0 [&_h3]:mb-6 [&_h3]:tracking-[-.04em] [&_p]:max-w-[470px] [&_p]:text-[#cbd8da] [&_p]:text-[1.05rem] max-[980px]:top-[18%] max-[980px]:max-w-[460px] max-[980px]:[&_h3]:text-[clamp(3rem,8vw,5rem)] max-[980px]:[&_p]:max-w-[390px] max-[680px]:left-5 max-[680px]:right-5 max-[680px]:top-[21%] max-[680px]:[&_h3]:text-[3.5rem] max-[680px]:[&_p]:text-[.9rem] max-[680px]:[&_p]:max-w-[330px] active"
            data-step="0"
          >
            <span>01</span>
            <h3>
              Te mutatod,
              <br />
              mi van otthon.
            </h3>
            <p>
              Add hozzá kézzel az alapanyagokat. Mennyiséggel vagy anélkül — a
              bizonytalanságot mindig jelezzük.
            </p>
          </div>
          <div
            className="story-step absolute left-[max(5vw,24px)] top-[32%] max-w-[540px] opacity-0 [transform:translateY(35px)] [transition:.65s_var(--ease-chef)] pointer-events-none [&.active]:opacity-100 [&.active]:[transform:none] [&>span]:text-[.75rem] [&>span]:tracking-[.2em] [&>span]:text-blush [&_h3]:font-display [&_h3]:text-[clamp(3rem,5.5vw,6.4rem)] [&_h3]:leading-[.9] [&_h3]:font-normal [&_h3]:mt-4.5 [&_h3]:mx-0 [&_h3]:mb-6 [&_h3]:tracking-[-.04em] [&_p]:max-w-[470px] [&_p]:text-[#cbd8da] [&_p]:text-[1.05rem] max-[980px]:top-[18%] max-[980px]:max-w-[460px] max-[980px]:[&_h3]:text-[clamp(3rem,8vw,5rem)] max-[980px]:[&_p]:max-w-[390px] max-[680px]:left-5 max-[680px]:right-5 max-[680px]:top-[21%] max-[680px]:[&_h3]:text-[3.5rem] max-[680px]:[&_p]:text-[.9rem] max-[680px]:[&_p]:max-w-[330px]"
            data-step="1"
          >
            <span>02</span>
            <h3>
              Mi kizárjuk,
              <br />
              ami nem neked való.
            </h3>
            <p>
              Allergia, étrend, nem kedvelt hozzávalók és időkeret. A kötelező
              szűrők mindig megelőzik a rangsorolást.
            </p>
          </div>
          <div
            className="story-step absolute left-[max(5vw,24px)] top-[32%] max-w-[540px] opacity-0 [transform:translateY(35px)] [transition:.65s_var(--ease-chef)] pointer-events-none [&.active]:opacity-100 [&.active]:[transform:none] [&>span]:text-[.75rem] [&>span]:tracking-[.2em] [&>span]:text-blush [&_h3]:font-display [&_h3]:text-[clamp(3rem,5.5vw,6.4rem)] [&_h3]:leading-[.9] [&_h3]:font-normal [&_h3]:mt-4.5 [&_h3]:mx-0 [&_h3]:mb-6 [&_h3]:tracking-[-.04em] [&_p]:max-w-[470px] [&_p]:text-[#cbd8da] [&_p]:text-[1.05rem] max-[980px]:top-[18%] max-[980px]:max-w-[460px] max-[980px]:[&_h3]:text-[clamp(3rem,8vw,5rem)] max-[980px]:[&_p]:max-w-[390px] max-[680px]:left-5 max-[680px]:right-5 max-[680px]:top-[21%] max-[680px]:[&_h3]:text-[3.5rem] max-[680px]:[&_p]:text-[.9rem] max-[680px]:[&_p]:max-w-[330px]"
            data-step="2"
          >
            <span>03</span>
            <h3>
              Megkapod a<br />
              legjobb következő ételt.
            </h3>
            <p>
              Látod, mi van meg, mi hiányzik és miért ezt ajánljuk. A hiányzó
              tételek egy mozdulattal a listára kerülnek.
            </p>
          </div>
        </div>
        <div
          className="story-visual relative grid place-items-center max-[980px]:absolute max-[980px]:right-[-15%] max-[980px]:bottom-[-5%] max-[980px]:w-[68%] max-[980px]:h-[68%] max-[980px]:opacity-80 max-[680px]:w-[85%] max-[680px]:h-[55%] max-[680px]:right-[-30%] max-[680px]:bottom-[-2%]"
          aria-hidden="true"
        >
          <div className="orbit-label absolute [border:1px_solid_rgba(255,255,255,.25)] bg-[rgba(48,76,83,.75)] backdrop-blur-[10px] py-2.5 px-3.5 rounded-full text-[.75rem] z-2 max-[680px]:hidden label-a top-[20%] left-0">
            12 hozzávaló
          </div>
          <div className="orbit-label absolute [border:1px_solid_rgba(255,255,255,.25)] bg-[rgba(48,76,83,.75)] backdrop-blur-[10px] py-2.5 px-3.5 rounded-full text-[.75rem] z-2 max-[680px]:hidden label-b top-[24%] right-[1%]">
            22 perc
          </div>
          <div className="orbit-label absolute [border:1px_solid_rgba(255,255,255,.25)] bg-[rgba(48,76,83,.75)] backdrop-blur-[10px] py-2.5 px-3.5 rounded-full text-[.75rem] z-2 max-[680px]:hidden label-c bottom-[18%] left-[3%]">
            32 g fehérje
          </div>
          <div className="plate-wrap w-[min(36vw,520px)] h-[min(36vw,520px)] rounded-full p-4.5 bg-paper shadow-[0_40px_90px_rgba(0,0,0,.35)] relative will-change-transform [transition:.6s_var(--ease-chef)] [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:rounded-full max-[980px]:w-[min(55vw,470px)] max-[980px]:h-[min(55vw,470px)] max-[680px]:w-[70vw] max-[680px]:h-[70vw]">
            <img src="/assets/shakshuka.png" alt="" />
            <div className="plate-ring absolute inset-[-35px] [border:1px_solid_rgba(175,224,231,.4)] rounded-full"></div>
          </div>
          <div className="match-badge absolute right-[4%] bottom-[11%] bg-sand w-[145px] h-[145px] rounded-full flex items-center justify-center flex-col [transform:rotate(8deg)] shadow-[0_15px_40px_rgba(0,0,0,.2)] [&_strong]:font-display [&_strong]:text-[3rem] [&_strong]:leading-[1] [&_span]:text-[.68rem] max-[680px]:w-25 max-[680px]:h-25 max-[680px]:right-[8%] max-[680px]:bottom-[6%] max-[680px]:[&_strong]:text-[2rem]">
            <strong>86%</strong>
            <span>kamra-egyezés</span>
          </div>
        </div>
        <div
          className="story-dots absolute right-7 top-[50%] flex flex-col gap-2 [&_i]:w-1.5 [&_i]:h-1.5 [&_i]:rounded-full [&_i]:bg-[rgba(255,255,255,.25)] [&_i]:[transition:.3s] [&_i.active]:h-7 [&_i.active]:rounded-lg [&_i.active]:bg-aqua max-[680px]:right-3"
          aria-hidden="true"
        >
          <i className="active"></i>
          <i></i>
          <i></i>
        </div>
      </div>
    </section>
  );
}
