const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-brav-bg z-[100] flex items-center justify-center flex-col gap-4">
      <div className="w-7 h-7 border-[1.5px] border-brav-border border-t-brav-accent rounded-full animate-spin" />
      <div className="font-serif italic text-[16px] text-brav-mid">
        Аналізуємо відповіді…
      </div>
    </div>
  );
};

export default LoadingScreen;
