import {
  type NeuroKey,
  resultData,
  defNotes,
  neuroOrder,
  neuroMeta,
  levelMeta,
  getDefLevel,
} from '@/data/testData';

interface Scores {
  dom: Record<NeuroKey, number>;
  def: Record<NeuroKey, number>;
  maxD: Record<NeuroKey, number>;
  maxF: Record<NeuroKey, number>;
}

interface ResultsScreenProps {
  scores: Scores;
  onRestart: () => void;
}

const neuroColors: Record<NeuroKey, { color: string; bg: string; border: string }> = {
  dopa: { color: '#6b5c8a', bg: '#f3f0f8', border: '#d6cfe8' },
  ach:  { color: '#3d7068', bg: '#eef5f4', border: '#c0d9d6' },
  gaba: { color: '#5a7a4a', bg: '#f0f5ec', border: '#c4d8ba' },
  sero: { color: '#8a6a30', bg: '#f7f2e8', border: '#ddd0b0' },
};

const levelColors = {
  low:  { color: '#5a7a4a', bg: '#f0f5ec' },
  mid:  { color: '#8a6a30', bg: '#f7f2e8' },
  high: { color: '#b45454', bg: '#fdf0f0' },
};

const ResultsScreen = ({ scores, onRestart }: ResultsScreenProps) => {
  const { dom, def, maxD, maxF } = scores;

  // Determine dominant
  const dominant = neuroOrder.slice().sort((a, b) => dom[b] - dom[a])[0];
  const rd = resultData[dominant];
  const dc = neuroColors[dominant];

  return (
    <div className="max-w-[640px] mx-auto px-4 md:px-6 pt-16 pb-20">
      <p className="text-[11px] tracking-[0.18em] uppercase text-brav-light mb-3 text-center">
        Результати нейрохімічної оцінки
      </p>
      <h2 className="font-serif font-normal text-center text-brav-text mb-2 leading-[1.2]" style={{ fontSize: 'clamp(28px, 5vw, 40px)' }}>
        {rd.name}
      </h2>
      <p className="font-serif italic text-[16px] text-brav-mid text-center mb-12">
        {rd.tagline}
      </p>

      {/* Dominant Card */}
      <div
        className="rounded-xl p-7 md:p-9 mb-8 border"
        style={{ background: dc.bg, borderColor: dc.border }}
      >
        <div className="text-[11px] tracking-[0.15em] uppercase mb-3" style={{ color: dc.color }}>
          Домінантний нейромедіатор
        </div>
        <div className="font-serif text-[30px] font-normal mb-1.5 leading-[1.15]" style={{ color: dc.color }}>
          {rd.name}
        </div>
        <div className="font-serif italic text-[16px] mb-5 opacity-75" style={{ color: dc.color }}>
          {rd.tagline}
        </div>
        <div className="text-[14px] leading-[1.8] opacity-80">
          {rd.desc}
        </div>
      </div>

      <div className="w-12 h-px bg-brav-border mx-auto my-10" />

      {/* Dominance Scores */}
      <div className="text-[11px] tracking-[0.15em] uppercase text-brav-light mb-4">
        Профіль домінування — Частина 1
      </div>
      <div className="flex flex-col gap-3 mb-8">
        {neuroOrder.map(k => {
          const pct = maxD[k] > 0 ? Math.round((dom[k] / maxD[k]) * 100) : 0;
          return (
            <div key={k} className="flex items-center gap-3">
              <div className="w-[120px] text-[14px] text-brav-mid flex-shrink-0">
                {neuroMeta[k].label}
              </div>
              <div className="flex-1 h-1.5 bg-brav-warm rounded-md overflow-hidden border border-brav-border-light">
                <div
                  className="h-full rounded-md transition-all duration-700"
                  style={{ width: `${pct}%`, background: neuroColors[k].color }}
                />
              </div>
              <div className="w-10 text-right text-[13px] text-brav-light">
                {dom[k]}/{maxD[k]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-12 h-px bg-brav-border mx-auto my-10" />

      {/* Deficiency Cards */}
      <div className="text-[11px] tracking-[0.15em] uppercase text-brav-light mb-4">
        Оцінка дефіцитів — Частина 2
      </div>
      <div className="flex flex-col gap-2.5">
        {neuroOrder.map(k => {
          const pct = maxF[k] > 0 ? Math.round((def[k] / maxF[k]) * 100) : 0;
          const level = getDefLevel(def[k], maxF[k]);
          const lm = levelMeta[level];
          const lc = levelColors[level];
          const note = defNotes[k][level];

          return (
            <div key={k} className="bg-white border border-brav-border-light rounded-lg px-5 py-5">
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-[14px] font-medium text-brav-text">
                  {neuroMeta[k].label}
                </div>
                <span
                  className="text-[11px] px-2.5 py-0.5 rounded-full"
                  style={{ color: lc.color, background: lc.bg }}
                >
                  {lm.text}
                </span>
              </div>
              <div className="h-1 bg-brav-warm rounded overflow-hidden mb-2.5">
                <div
                  className="h-full rounded"
                  style={{ width: `${pct}%`, background: neuroColors[k].color }}
                />
              </div>
              <div className="text-[13px] text-brav-mid leading-relaxed">
                {note}
              </div>
            </div>
          );
        })}
      </div>

      {/* Traits */}
      <div className="mt-8 p-6 bg-brav-warm rounded-xl border border-brav-border-light">
        <div className="font-serif text-[18px] font-normal mb-4 text-brav-text">
          Ключові риси — {rd.name}
        </div>
        <div className="flex flex-wrap gap-2">
          {rd.traits.map((trait, i) => (
            <span
              key={i}
              className="text-[13px] px-3.5 py-1 bg-white border border-brav-border rounded-full text-brav-mid"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-10 text-[12px] text-brav-light leading-[1.7] text-center px-2">
        Цей результат є інформаційним і не замінює консультації фахівця.
        Тест базується на методиці Еріка Бравермана («The Edge Effect», 2005).
      </div>

      <button
        onClick={onRestart}
        className="block mx-auto mt-7 bg-transparent border border-brav-border text-brav-mid px-8 py-2.5 rounded-full font-sans text-[14px] cursor-pointer transition-all hover:border-brav-mid hover:text-brav-text"
      >
        Пройти тест знову
      </button>
    </div>
  );
};

export default ResultsScreen;
