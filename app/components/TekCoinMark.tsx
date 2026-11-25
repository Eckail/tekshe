export default function TekCoinMark({
  className = "h-6 w-6",
}: {
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-current/35 bg-card/85 font-semibold leading-none text-current shadow-sm backdrop-blur-sm ${className}`}
      aria-label="Tek Coin"
    >
      T
    </span>
  );
}
