export default function Marquee() {
  return (
    <div
      className="marquee overflow-hidden bg-aqua text-deep py-[17px] px-0 [border-block:1px_solid_rgba(48,76,83,.25)] hidden!"
      aria-hidden="true"
    >
      <div className="marquee-track flex whitespace-nowrap gap-[35px] w-max font-bold text-[.82rem] tracking-[.16em] animate-[marquee_25s_linear_infinite] [&_b]:text-sand">
        <span>AMI OTTHON VAN</span>
        <b>✦</b>
        <span>AHOGY TE SZERETED</span>
        <b>✦</b>
        <span>PONT AMENNYI IDŐD VAN</span>
        <b>✦</b>
        <span>AMI OTTHON VAN</span>
        <b>✦</b>
        <span>AHOGY TE SZERETED</span>
        <b>✦</b>
        <span>PONT AMENNYI IDŐD VAN</span>
        <b>✦</b>
      </div>
    </div>
  );
}
