
import BauhausArtwork from "./BauhausArtwork";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-12 md:py-28">
      <div>
        <p className="mb-8 text-xs tracking-[0.3em] text-[#B85F3D]">
          ҚАЗАҚ ТІЛІНДЕ · 中文学习
        </p>

        <h1 className="max-w-xl text-5xl font-medium leading-[1.1] tracking-tight md:text-7xl">
          Тілімнің шегі —
          <br />
          <span className="text-[#B85F3D]">
            әлемімнің шегі.
          </span>
        </h1>

        <div className="my-10 h-px w-20 bg-[#242321]" />

        <p className="max-w-md text-base leading-8 text-[#6E685F]">
          Қытай тілін нөлден бастап үйрен.
          Пиньинь, сөздер және күнделікті диалогтар.
          Барлығы бір жерде.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a
            href="#courses"
            className="bg-[#B85F3D] px-8 py-4 text-sm text-white transition hover:bg-[#98482D]"
          >
            ОҚУДЫ БАСТАУ ↗
          </a>

          <span className="text-xs tracking-widest text-[#6E685F]">
            БІРІНШІ ҚАДАМ · 你好
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[420px]">
        <BauhausArtwork />
      </div>
    </section>
  );
}
