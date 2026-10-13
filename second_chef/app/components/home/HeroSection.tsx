export default function HeroSection() {
  return (
<section className="hero" id="hero">
        <img className="hero-image" src="/assets/hero-pasta.png" alt="Friss paradicsomos tészta sült paradicsommal és bazsalikommal" />
        <div className="hero-shade"></div>
        <div className="hero-orbit orbit-one" aria-hidden="true"></div>
        <div className="hero-orbit orbit-two" aria-hidden="true"></div>
        <div className="hero-content">
          <p className="eyebrow reveal">A második séf a konyhádban</p>
          <h1 className="hero-title" aria-label="Kevesebb keresés. Több főzés.">
            <span className="title-line">Kevesebb keresés.</span>
            <span className="title-line script">Több főzés.</span>
          </h1>
          <p className="hero-copy reveal">Mondd el, mi van otthon. Mi megmutatjuk, mi lehet belőle — az ízlésedhez, idődhöz és céljaidhoz igazítva.</p>
          <div className="hero-actions reveal">
            <a className="pill-button coral" href="#discover">Mutass recepteket</a>
            <a className="text-link" href="#pantry">Feltöltöm a kamrám <span>↘</span></a>
          </div>
        </div>
        <div className="hero-stat reveal">
          <span className="stat-number">18<small>perc</small></span>
          <span>és már az asztalon<br />lehet a vacsora</span>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span></span>Görgess</div>
      </section>
  );
}
