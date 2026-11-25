export default function TeksheLogo() {
  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <svg
        viewBox="0 0 64 64"
        className="h-10 w-10 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="tekshe-mark" x1="7" y1="9" x2="55" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1AC6FF"/>
            <stop offset="48%" stopColor="#3B7BFF"/>
            <stop offset="100%" stopColor="#6D4AFF"/>
          </linearGradient>
        </defs>
        <path
          d="M7 21.5C14 13.8 24.1 9.5 39.2 9.5H55C50.8 15.5 45.8 19.2 37.6 21.4L25.2 24.8C19.1 26.5 14.8 31 11.8 37.7L7 48.5C5.1 39.3 5.2 28.9 11.2 22.7L7 21.5Z"
          fill="url(#tekshe-mark)"
        />
        <path
          d="M22.5 31.1C28.3 27.3 35.6 25.5 45.5 25.5C42.2 30.5 38.1 33.7 32.3 35.7L26.6 37.7L23.2 49.1C21.8 53.5 18.1 56.5 12.8 58L15.1 44.2C16.1 38.5 18.4 33.9 22.5 31.1Z"
          fill="url(#tekshe-mark)"
        />
      </svg>

      <span className="min-w-0">
        <span className="block text-[21px] font-semibold leading-tight tracking-[-0.055em] text-text-primary">
          tekshe
        </span>
        <span className="mt-0.5 block text-[9px] font-medium tracking-[0.14em] text-text-secondary">
          中文学习
        </span>
      </span>
    </span>
  );
}
