export default function TekCoinMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-terracotta/45 font-semibold leading-none text-terracotta ${className}`}
      aria-label="Tek Coin"
    >
      T
    </span>
  );
}
