import { useCallback, useMemo, useEffect } from 'react';
import type { Section, NeuroKey } from '@/data/testData';
import { neuroMeta } from '@/data/testData';

interface TestScreenProps {
  sections: Section[];
  currentIdx: number;
  answers: Record<string, boolean>;
  onAnswer: (key: string, value: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
}

const neuroColors: Record<NeuroKey, { color: string; bg: string; border: string }> = {
  dopa: { color: '#6b5c8a', bg: '#f3f0f8', border: '#d6cfe8' },
  ach:  { color: '#3d7068', bg: '#eef5f4', border: '#c0d9d6' },
  gaba: { color: '#5a7a4a', bg: '#f0f5ec', border: '#c4d8ba' },
  sero: { color: '#8a6a30', bg: '#f7f2e8', border: '#ddd0b0' },
};

const TestScreen = ({ sections, currentIdx, answers, onAnswer, onNext, onPrev }: TestScreenProps) => {
  const sec = sections[currentIdx];
  const total = sections.length;
  const meta = neuroMeta[sec.neuro];
  const colors = neuroColors[sec.neuro];

  const doneQ = useMemo(() => {
    return sections.slice(0, currentIdx).reduce((a, s) => a + s.questions.length, 0);
  }, [sections, currentIdx]);

  const totalQ = useMemo(() => {
    return sections.reduce((a, s) => a + s.questions.length, 0);
  }, [sections]);

  const pct = Math.round((doneQ / totalQ) * 100);

  const answeredInSection = sec.questions.filter((_, i) =>
    answers[`${sec.id}_${i}`] !== undefined
  ).length;

  const handleAnswer = useCallback((qi: number, val: boolean) => {
    onAnswer(`${sec.id}_${qi}`, val);
  }, [sec.id, onAnswer]);

  const isLast = currentIdx === total - 1;

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 backdrop-blur-sm border-b border-brav-border px-4 md:px-8 py-3.5 flex items-center gap-3 md:gap-6" style={{ background: 'rgba(250,249,247,0.96)' }}>
        <div className="hidden md:block font-serif text-[15px] text-brav-text flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
          {sec.part === 1 ? 'Частина 1 — Природа' : 'Частина 2 — Дефіцити'}
        </div>

        <div className="flex-[2] md:max-w-[320px]">
          <div className="flex justify-between text-[11px] text-brav-light mb-1.5">
            <span>Блок {currentIdx + 1} з {total}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-0.5 bg-brav-border rounded-sm overflow-hidden">
            <div
              className="h-full bg-brav-accent rounded-sm transition-all duration-400"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div
          className="text-[12px] px-3.5 py-1 rounded-full border whitespace-nowrap"
          style={{ color: colors.color, background: colors.bg, borderColor: colors.border }}
        >
          {meta.label}
        </div>
      </div>

      {/* Section Content */}
      <div className="max-w-[680px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-28 md:pb-32">
        <div className="mb-8">
          <div className="text-[11px] tracking-[0.15em] uppercase mb-2" style={{ color: colors.color }}>
            {meta.label} · {sec.category}
          </div>
          <div className="font-serif text-[26px] font-normal text-brav-text mb-2">
            {sec.category}
          </div>
          <div className="text-[14px] text-brav-mid leading-relaxed">
            {sec.hint}
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          {sec.questions.map((q, qi) => {
            const key = `${sec.id}_${qi}`;
            const ans = answers[key];
            const isAnswered = ans !== undefined;

            return (
              <div
                key={qi}
                className={`flex items-stretch bg-white border rounded-lg overflow-hidden transition-colors ${
                  isAnswered ? 'border-brav-border' : 'border-brav-border-light hover:border-brav-border'
                }`}
              >
                <div className="w-9 flex items-center justify-center text-[11px] text-brav-light flex-shrink-0 border-r border-brav-border-light">
                  {qi + 1}
                </div>
                <div className="flex-1 px-4 py-3 text-[14px] leading-[1.55] text-brav-text">
                  {q}
                </div>
                <div className="flex flex-shrink-0 border-l border-brav-border-light">
                  <button
                    onClick={() => handleAnswer(qi, true)}
                    className={`w-13 md:w-16 border-none cursor-pointer text-[13px] font-sans flex items-center justify-center transition-all border-r border-brav-border-light ${
                      ans === true
                        ? 'bg-brav-warm text-brav-text font-medium'
                        : 'bg-transparent text-brav-light hover:bg-brav-warm hover:text-brav-mid'
                    }`}
                  >
                    Так
                  </button>
                  <button
                    onClick={() => handleAnswer(qi, false)}
                    className={`w-13 md:w-16 border-none cursor-pointer text-[13px] font-sans flex items-center justify-center transition-all ${
                      ans === false
                        ? 'bg-brav-warm text-brav-mid font-medium'
                        : 'bg-transparent text-brav-light hover:bg-brav-warm hover:text-brav-mid'
                    }`}
                  >
                    Ні
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm border-t border-brav-border px-4 md:px-8 py-4 flex items-center justify-between gap-4" style={{ background: 'rgba(250,249,247,0.97)' }}>
        {currentIdx > 0 ? (
          <button
            onClick={onPrev}
            className="bg-transparent border border-brav-border text-brav-mid px-6 py-2.5 rounded-full font-sans text-[14px] cursor-pointer transition-all hover:border-brav-mid hover:text-brav-text"
          >
            ← Назад
          </button>
        ) : <div />}

        <div className="text-[13px] text-brav-light">
          <span className="text-brav-mid font-medium">{answeredInSection}</span> з {sec.questions.length}
        </div>

        <button
          onClick={onNext}
          className="bg-brav-text text-brav-bg border-none px-8 py-2.5 rounded-full font-sans text-[14px] cursor-pointer transition-opacity hover:opacity-[0.78]"
        >
          {isLast ? 'Переглянути результати' : 'Далі'}
        </button>
      </div>
    </div>
  );
};

export default TestScreen;
