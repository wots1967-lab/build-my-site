import { useState, useCallback } from 'react';
import IntroScreen from '@/components/IntroScreen';
import TestScreen from '@/components/TestScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ResultsScreen from '@/components/ResultsScreen';
import { testData, neuroOrder, type NeuroKey, type Section } from '@/data/testData';

type Screen = 'intro' | 'test' | 'loading' | 'results';

const allSections: Section[] = [...testData.part1.sections, ...testData.part2.sections];

const Index = () => {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<{
    dom: Record<NeuroKey, number>;
    def: Record<NeuroKey, number>;
    maxD: Record<NeuroKey, number>;
    maxF: Record<NeuroKey, number>;
  } | null>(null);

  const handleStart = useCallback(() => {
    setCurrentIdx(0);
    setAnswers({});
    setScreen('test');
    window.scrollTo(0, 0);
  }, []);

  const handleAnswer = useCallback((key: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }, []);

  const calculateScores = useCallback(() => {
    const dom = { dopa: 0, ach: 0, gaba: 0, sero: 0 };
    const def = { dopa: 0, ach: 0, gaba: 0, sero: 0 };
    const maxD = { dopa: 0, ach: 0, gaba: 0, sero: 0 };
    const maxF = { dopa: 0, ach: 0, gaba: 0, sero: 0 };

    testData.part1.sections.forEach(s => {
      maxD[s.neuro] += s.questions.length;
      s.questions.forEach((_, i) => {
        if (answers[`${s.id}_${i}`] === true) dom[s.neuro]++;
      });
    });

    testData.part2.sections.forEach(s => {
      maxF[s.neuro] += s.questions.length;
      s.questions.forEach((_, i) => {
        if (answers[`${s.id}_${i}`] === true) def[s.neuro]++;
      });
    });

    return { dom, def, maxD, maxF };
  }, [answers]);

  const handleNext = useCallback(() => {
    if (currentIdx === allSections.length - 1) {
      setScreen('loading');
      const result = calculateScores();
      setTimeout(() => {
        setScores(result);
        setScreen('results');
        window.scrollTo(0, 0);
      }, 1200);
    } else {
      setCurrentIdx(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  }, [currentIdx, calculateScores]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  }, [currentIdx]);

  const handleRestart = useCallback(() => {
    setAnswers({});
    setCurrentIdx(0);
    setScores(null);
    setScreen('intro');
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {screen === 'intro' && <IntroScreen onStart={handleStart} />}
      {screen === 'test' && (
        <TestScreen
          sections={allSections}
          currentIdx={currentIdx}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      {screen === 'loading' && <LoadingScreen />}
      {screen === 'results' && scores && (
        <ResultsScreen scores={scores} onRestart={handleRestart} />
      )}
    </>
  );
};

export default Index;
