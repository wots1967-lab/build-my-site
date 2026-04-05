import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
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
  const [focusedQ, setFocusedQ] = useState(0);
  const [showHints, setShowHints] = useState(true);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reset focused question when section changes
  useEffect(() => {
    setFocusedQ(0);
  }, [currentIdx]);

  // Scroll focused question into view
  useEffect(() => {
    const el = rowRefs.current[focusedQ];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusedQ]);

  // Auto-advance to next section when all questions answered
  const allAnswered = answeredInSection === sec.questions.length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'j':
        case 'J':
        case 'ArrowDown':
          e.preventDefault();
          setFocusedQ(prev => Math.min(prev + 1, sec.questions.length - 1));
          break;

        case 'k':
        case 'K':
        case 'ArrowUp':
          e.preventDefault();
          setFocusedQ(prev => Math.max(prev - 1, 0));
          break;

        case '1':
        case 'д':
        case 'Д':
          e.preventDefault();
          handleAnswer(focusedQ, true);
          if (focusedQ < sec.questions.length - 1) {
            setFocusedQ(prev => prev + 1);
          }
          break;

        case '2':
        case 'н':
        case 'Н':
          e.preventDefault();
          handleAnswer(focusedQ, false);
          if (focusedQ < sec.questions.length - 1) {
            setFocusedQ(prev => prev + 1);
          }
          break;

        case 'Enter':
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;

        case 'ArrowLeft':
        case 'Backspace':
          e.preventDefault();
          onPrev();
          break;

        case '?':
          e.preventDefault();
          setShowHints(prev => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNext, onPrev, sec.questions.length, focusedQ, handleAnswer]);

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 backdrop-blur-sm border-b border-brav-border px-3 sm:px-4 md:px-8 py-2.5 sm:py-3.5 flex items-center gap-2 sm:gap-3 md:gap-6" style={{ background: 'rgba(250,249,247,0.96)' }}>
        <div className="hidden md:block font-serif text-[15px] text-brav-text flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
          {sec.part === 1 ? 'Частина 1 — Домінування' : 'Частина 2 — Дефіцити'}
        </div>

        <div className="flex-[2] min-w-0 md:max-w-[320px]">
          <div className="flex justify-between text-[10px] sm:text-[11px] text-brav-light mb-1.5">
            <span>Блок {currentIdx + 1}/{total}</span>
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
          className="text-[10px] sm:text-[12px] px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full border whitespace-nowrap flex-shrink-0"
          style={{ color: colors.color, background: colors.bg, borderColor: colors.border }}
        >
          {meta.label}
        </div>
      </div>
      {/* Section Content */}
      <div className="max-w-[680px] mx-auto px-3 sm:px-4 md:px-6 pt-6 sm:pt-8 md:pt-12 pb-24 sm:pb-28 md:pb-32">
        <div className="mb-6 sm:mb-8">
          <div className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase mb-2" style={{ color: colors.color }}>
            {meta.label} · {sec.category}
          </div>
          <div className="font-serif text-[22px] sm:text-[26px] font-normal text-brav-text mb-2">
            {sec.category}
          </div>
          <div className="text-[13px] sm:text-[14px] text-brav-mid leading-relaxed">
            {sec.hint}
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          {sec.questions.map((q, qi) => {
            const key = `${sec.id}_${qi}`;
            const ans = answers[key];
            const isAnswered = ans !== undefined;
            const isFocused = focusedQ === qi;

            return (
              <div
                key={qi}
                ref={el => { rowRefs.current[qi] = el; }}
                onClick={() => setFocusedQ(qi)}
                className={`flex items-stretch bg-white border rounded-lg overflow-hidden transition-all cursor-pointer ${
                  isFocused
                    ? 'border-brav-accent ring-1 ring-brav-accent/30 shadow-sm'
                    : isAnswered ? 'border-brav-border' : 'border-brav-border-light hover:border-brav-border'
                }`}
              >
                <div className={`w-9 flex items-center justify-center text-[11px] flex-shrink-0 border-r border-brav-border-light transition-colors ${
                  isFocused ? 'text-brav-accent font-medium' : 'text-brav-light'
                }`}>
                  {qi + 1}
                </div>
                <div className="flex-1 px-4 py-3 text-[14px] leading-[1.55] text-brav-text">
                  {q}
                </div>
                <div className="flex flex-shrink-0 border-l border-brav-border-light">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAnswer(qi, true); }}
                    className={`w-13 md:w-16 border-none cursor-pointer text-[13px] font-sans flex items-center justify-center transition-all border-r border-brav-border-light ${
                      ans === true
                        ? 'bg-brav-warm text-brav-text font-medium'
                        : isFocused
                          ? 'bg-transparent text-brav-mid hover:bg-brav-warm'
                          : 'bg-transparent text-brav-light hover:bg-brav-warm hover:text-brav-mid'
                    }`}
                  >
                    Так
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAnswer(qi, false); }}
                    className={`w-13 md:w-16 border-none cursor-pointer text-[13px] font-sans flex items-center justify-center transition-all ${
                      ans === false
                        ? 'bg-brav-warm text-brav-mid font-medium'
                        : isFocused
                          ? 'bg-transparent text-brav-mid hover:bg-brav-warm'
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
      <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm border-t border-brav-border px-3 sm:px-4 md:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4" style={{ background: 'rgba(250,249,247,0.97)' }}>
        {currentIdx > 0 ? (
          <button
            onClick={onPrev}
            className="bg-transparent border border-brav-border text-brav-mid px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-sans text-[13px] sm:text-[14px] cursor-pointer transition-all hover:border-brav-mid hover:text-brav-text flex-shrink-0"
          >
            ←
          </button>
        ) : <div />}

        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="text-[12px] sm:text-[13px] text-brav-light whitespace-nowrap">
            <span className="text-brav-mid font-medium">{answeredInSection}</span>/{sec.questions.length}
          </div>

          {/* Keyboard hints */}
          {showHints && (
            <div className="hidden md:flex items-center gap-2 text-[11px] text-brav-light">
              <span className="px-1.5 py-0.5 bg-brav-warm border border-brav-border rounded text-[10px] font-mono">1</span>
              <span>Так</span>
              <span className="px-1.5 py-0.5 bg-brav-warm border border-brav-border rounded text-[10px] font-mono">2</span>
              <span>Ні</span>
              <span className="mx-1 text-brav-border">|</span>
              <span className="px-1.5 py-0.5 bg-brav-warm border border-brav-border rounded text-[10px] font-mono">↑↓</span>
              <span>Рядок</span>
              <span className="px-1.5 py-0.5 bg-brav-warm border border-brav-border rounded text-[10px] font-mono">Enter</span>
              <span>Далі</span>
            </div>
          )}
        </div>

        <button
          onClick={onNext}
          className={`border-none px-5 sm:px-8 py-2 sm:py-2.5 rounded-full font-sans text-[13px] sm:text-[14px] cursor-pointer transition-opacity hover:opacity-[0.78] flex-shrink-0 ${
            allAnswered ? 'bg-brav-text text-brav-bg' : 'bg-brav-text/70 text-brav-bg'
          }`}
        >
          {isLast ? 'Результати' : 'Далі →'}
        </button>
      </div>
    </div>
  );
};

export default TestScreen;
