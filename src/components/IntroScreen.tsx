interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen = ({ onStart }: IntroScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center max-w-[560px] mx-auto">
      <p className="text-[11px] tracking-[0.18em] uppercase text-brav-light mb-7">
        Оцінка Бравермана · BNA
      </p>

      <h1 className="font-serif text-brav-text leading-[1.15] mb-2.5" style={{ fontSize: 'clamp(32px, 6vw, 48px)' }}>
        Який нейромедіатор<br /><em className="italic text-brav-accent">формує тебе?</em>
      </h1>

      <p className="font-serif italic text-[17px] text-brav-mid mb-9">
        Нейрохімічний профіль особистості
      </p>

      <p className="text-[15px] leading-[1.8] text-brav-mid mb-10">
        Тест Бравермана визначає домінантний нейромедіатор, який керує твоїм темпераментом,
        поведінкою та самопочуттям. Він також виявляє можливі дефіцити — там, де варто приділити увагу.
      </p>

      <div className="flex gap-2 flex-wrap justify-center mb-11">
        <span className="px-4 py-1.5 rounded-full text-[13px] border bg-neuro-dopa-bg border-neuro-dopa-border text-neuro-dopa">Дофамін</span>
        <span className="px-4 py-1.5 rounded-full text-[13px] border bg-neuro-ach-bg border-neuro-ach-border text-neuro-ach">Ацетилхолін</span>
        <span className="px-4 py-1.5 rounded-full text-[13px] border bg-neuro-gaba-bg border-neuro-gaba-border text-neuro-gaba">ГАМК</span>
        <span className="px-4 py-1.5 rounded-full text-[13px] border bg-neuro-sero-bg border-neuro-sero-border text-neuro-sero">Серотонін</span>
      </div>

      <button
        onClick={onStart}
        className="bg-brav-text text-brav-bg border-none px-11 py-4 rounded-full font-sans text-[15px] cursor-pointer transition-opacity hover:opacity-[0.78]"
      >
        Почати
      </button>

      <p className="mt-5 text-[12px] text-brav-light">
        315 тверджень · Так або Ні · ~25 хвилин
      </p>

      <div className="w-10 h-px bg-brav-border my-8" />

      <p className="text-[12px] text-brav-light leading-[1.7] max-w-[400px]">
        Тест розроблено д-ром Еріком Браверманом («The Edge Effect»).
        Надається в інформаційних цілях і не є медичним висновком.
      </p>
    </div>
  );
};

export default IntroScreen;
