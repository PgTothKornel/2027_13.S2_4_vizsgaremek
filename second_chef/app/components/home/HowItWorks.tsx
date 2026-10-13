export default function HowItWorks() {
  return (
<section className="scroll-story" id="scrollStory">
        <div className="story-sticky">
          <div className="story-copy">
            <div className="section-kicker light"><span>02</span> Így működik</div>
            <div className="story-step active" data-step="0"><span>01</span><h3>Te mutatod,<br />mi van otthon.</h3><p>Add hozzá kézzel az alapanyagokat. Mennyiséggel vagy anélkül — a bizonytalanságot mindig jelezzük.</p></div>
            <div className="story-step" data-step="1"><span>02</span><h3>Mi kizárjuk,<br />ami nem neked való.</h3><p>Allergia, étrend, nem kedvelt hozzávalók és időkeret. A kötelező szűrők mindig megelőzik a rangsorolást.</p></div>
            <div className="story-step" data-step="2"><span>03</span><h3>Megkapod a<br />legjobb következő ételt.</h3><p>Látod, mi van meg, mi hiányzik és miért ezt ajánljuk. A hiányzó tételek egy mozdulattal a listára kerülnek.</p></div>
          </div>
          <div className="story-visual" aria-hidden="true">
            <div className="orbit-label label-a">12 hozzávaló</div><div className="orbit-label label-b">22 perc</div><div className="orbit-label label-c">32 g fehérje</div>
            <div className="plate-wrap"><img src="/assets/shakshuka.png" alt="" /><div className="plate-ring"></div></div>
            <div className="match-badge"><strong>86%</strong><span>kamra-egyezés</span></div>
          </div>
          <div className="story-dots" aria-hidden="true"><i className="active"></i><i></i><i></i></div>
        </div>
      </section>
  );
}
