export default function About() {
  return (
    <section
      id="about"
      className="bg-charcoal px-6 py-24 text-cream md:px-12 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
        <div>
          <p className="mb-6 text-xs tracking-[0.3em] text-terracotta/70">
            02 — БІЗ ТУРАЛЫ
          </p>

          <h2 className="text-4xl font-medium leading-tight md:text-6xl">
            Тіл үйрену —
            <br />
            жаңа әлемге
            <br />
            <span className="text-terracotta/70">жол ашу.</span>
          </h2>
        </div>

        <div className="flex items-end">
          <p className="max-w-md text-sm leading-8 text-cream/70">
            Tekshe — қазақ тілінде қытай тілін үйренуге
            арналған білім беру платформасы.
            Біздің мақсатымыз — күрделі нәрсені
            қарапайым әрі қызықты ету.
          </p>
        </div>
      </div>
    </section>
  );
}