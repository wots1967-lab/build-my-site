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

const barColors: Record<NeuroKey, string> = {
  dopa: '#4a6fa5',
  ach:  '#4a6fa5',
  gaba: '#8a9a3a',
  sero: '#8a9a3a',
};

const defBarColors: Record<NeuroKey, string> = {
  dopa: '#3a8a4a',
  ach:  '#8a9a3a',
  gaba: '#8a9a3a',
  sero: '#8a9a3a',
};

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

/* Segmented bar: renders filled blocks + empty blocks */
const SegmentedBar = ({
  value,
  max,
  color,
  blockSize = 1,
}: {
  value: number;
  max: number;
  color: string;
  blockSize?: number;
}) => {
  const totalBlocks = Math.ceil(max / blockSize);
  const filledBlocks = Math.ceil(value / blockSize);

  return (
    <div className="flex gap-[2px] items-center flex-1">
      {Array.from({ length: totalBlocks }, (_, i) => (
        <div
          key={i}
          className="h-5 flex-1 rounded-[2px]"
          style={{
            background: i < filledBlocks ? color : '#e8e6e1',
            minWidth: '3px',
          }}
        />
      ))}
    </div>
  );
};

/* Scale markers below the bar */
const ScaleMarkers = ({ thresholds }: { thresholds: { pos: number; label: string; color?: string }[] }) => (
  <div className="relative h-4 mt-0.5">
    {thresholds.map((t, i) => (
      <span
        key={i}
        className="absolute text-[10px] -translate-x-1/2"
        style={{ left: `${t.pos}%`, color: t.color || '#999' }}
      >
        {t.label}
      </span>
    ))}
  </div>
);

const ResultsScreen = ({ scores, onRestart }: ResultsScreenProps) => {
  const { dom, def, maxD, maxF } = scores;

  const dominant = neuroOrder.slice().sort((a, b) => dom[b] - dom[a])[0];
  const rd = resultData[dominant];
  const dc = neuroColors[dominant];

  // Calculate total max for Part 1 (all neuro combined max for scale)
  const totalMaxD = Math.max(...neuroOrder.map(k => maxD[k]));
  const totalMaxF = Math.max(...neuroOrder.map(k => maxF[k]));

  // Thresholds for dominance: [0 ... 70%][70% ... 100%]
  const domThreshold = Math.round(totalMaxD * 0.7);
  const domThresholdPct = (domThreshold / totalMaxD) * 100;

  // Thresholds for deficiency: [0...30%][30%...60%][60%...100%]
  const defT1 = Math.round(totalMaxF * 0.3);
  const defT2 = Math.round(totalMaxF * 0.6);
  const defT1Pct = (defT1 / totalMaxF) * 100;
  const defT2Pct = (defT2 / totalMaxF) * 100;

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

      {/* Dominance Chart */}
      <div className="bg-white border border-brav-border-light rounded-xl p-5 md:p-7 mb-3">
        <div className="text-[13px] font-medium text-brav-text text-center mb-6">
          Домінуючий тип
        </div>
        <div className="flex flex-col gap-3">
          {neuroOrder.map(k => (
            <div key={k} className="flex items-center gap-3">
              <div className="w-[100px] md:w-[120px] text-[13px] text-brav-mid text-right flex-shrink-0">
                {neuroMeta[k].label}
              </div>
              <SegmentedBar
                value={dom[k]}
                max={totalMaxD}
                color={neuroColors[k].color}
              />
              <div className="w-8 text-right text-[14px] font-medium text-brav-text flex-shrink-0">
                {dom[k]}
              </div>
            </div>
          ))}
        </div>
        {/* Scale */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-[100px] md:w-[120px] flex-shrink-0" />
          <div className="flex-1 relative">
            <ScaleMarkers thresholds={[
              { pos: 0, label: `[0`, color: '#4a90d9' },
              { pos: domThresholdPct, label: `${domThreshold}][${domThreshold + 1}`, color: '#4a90d9' },
              { pos: 100, label: `${totalMaxD}]`, color: '#4a90d9' },
            ]} />
          </div>
          <div className="w-8 flex-shrink-0" />
        </div>
      </div>

      {/* Deficiency Chart */}
      <div className="bg-white border border-brav-border-light rounded-xl p-5 md:p-7 mb-8">
        <div className="text-[13px] font-medium text-brav-text text-center mb-6">
          Дефіцит нейромедіаторів
        </div>
        <div className="flex flex-col gap-3">
          {neuroOrder.map(k => {
            const level = getDefLevel(def[k], maxF[k]);
            const lc = levelColors[level];
            return (
              <div key={k} className="flex items-center gap-3">
                <div className="w-[100px] md:w-[120px] text-[13px] text-brav-mid text-right flex-shrink-0">
                  {neuroMeta[k].label}
                </div>
                <SegmentedBar
                  value={def[k]}
                  max={totalMaxF}
                  color={lc.color}
                />
                <div className="w-8 text-right text-[14px] font-medium text-brav-text flex-shrink-0">
                  {def[k]}
                </div>
              </div>
            );
          })}
        </div>
        {/* Scale */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-[100px] md:w-[120px] flex-shrink-0" />
          <div className="flex-1 relative">
            <ScaleMarkers thresholds={[
              { pos: 0, label: `[0`, color: '#5a7a4a' },
              { pos: defT1Pct, label: `${defT1}][${defT1 + 1}`, color: '#8a6a30' },
              { pos: defT2Pct, label: `${defT2}][${defT2 + 1}`, color: '#b45454' },
              { pos: 100, label: `${totalMaxF}]`, color: '#b45454' },
            ]} />
          </div>
          <div className="w-8 flex-shrink-0" />
        </div>
        {/* Legend */}
        <div className="flex justify-center gap-4 mt-5 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: '#5a7a4a' }} /> Норма
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: '#8a6a30' }} /> Помірний
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: '#b45454' }} /> Виражений
          </span>
        </div>
      </div>

      <div className="w-12 h-px bg-brav-border mx-auto my-10" />

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

      {/* Deficiency Details */}
      <div className="text-[11px] tracking-[0.15em] uppercase text-brav-light mb-4">
        Деталі дефіцитів
      </div>
      <div className="flex flex-col gap-2.5">
        {neuroOrder.map(k => {
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
          Характерні риси — {rd.name}
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
        Результати мають інформаційний характер і не є медичним діагнозом.
        Методика базується на роботах Еріка Бравермана («The Edge Effect», 2005).
      </div>

      <button
        onClick={onRestart}
        className="block mx-auto mt-7 bg-transparent border border-brav-border text-brav-mid px-8 py-2.5 rounded-full font-sans text-[14px] cursor-pointer transition-all hover:border-brav-mid hover:text-brav-text"
      >
        Пройти оцінку повторно
      </button>
    </div>
  );
};

export default ResultsScreen;
