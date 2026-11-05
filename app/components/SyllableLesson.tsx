
import { pinyinSyllables, pinyinToneDescriptions } from "../data/pinyin";

export default function SyllableLesson() {
  return (
    <section
      id="syllables"
      className="border-t border-charcoal/20 px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <p className="mb-4 text-xs tracking-[0.25em] text-terracotta">
            03 / ҚЫТАЙ ТІЛІНІҢ ҚҰРЫЛЫСЫ
          </p>

          <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Буын қалай құралады?
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-8 text-charcoal/70">
            Қытай тілінде әр буын белгілі бір дыбыстық құрылымнан тұрады.
            Көп жағдайда буынды үш негізгі бөлікке ажыратуға болады:
            бастапқы дыбыс, негізгі дыбыстық бөлік және тон.
            Бұл бөліктер қытай тілінде 声母、韵母 және 声调 деп аталады.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-charcoal/20 p-6">
            <span className="text-xs tracking-widest text-terracotta">
              01 / INITIAL
            </span>
            <h3 className="mt-4 text-2xl font-semibold">声母</h3>
            <p className="mt-2 text-sm text-charcoal/60">
              Бастапқы дауыссыз дыбыс
            </p>
            <p className="mt-8 text-5xl font-semibold">m</p>
            <p className="mt-3 text-sm text-charcoal/60">
              Мысалы: mā сөзіндегі m.
            </p>
          </div>

          <div className="border border-charcoal/20 p-6">
            <span className="text-xs tracking-widest text-terracotta">
              02 / FINAL
            </span>
            <h3 className="mt-4 text-2xl font-semibold">韵母</h3>
            <p className="mt-2 text-sm text-charcoal/60">
              Буынның негізгі дыбыстық бөлігі
            </p>
            <p className="mt-8 text-5xl font-semibold">ao</p>
            <p className="mt-3 text-sm text-charcoal/60">
              Мысалы: hǎo сөзіндегі ao.
            </p>
          </div>

          <div className="border border-charcoal/20 p-6">
            <span className="text-xs tracking-widest text-terracotta">
              03 / TONE
            </span>
            <h3 className="mt-4 text-2xl font-semibold">声调</h3>
            <p className="mt-2 text-sm text-charcoal/60">
              Буынның айтылу әуені
            </p>
            <p className="mt-8 text-5xl font-semibold">ˇ</p>
            <p className="mt-3 text-sm text-charcoal/60">
              Мысалы: mǎ сөзіндегі үшінші тон.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <p className="text-xs tracking-[0.2em] text-terracotta">
            01 / БУЫНДЫҢ ҚҰРЫЛЫМЫ
          </p>
          <h3 className="mt-4 text-3xl font-semibold">
            Буынды бөліктерге ажырату
          </h3>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-charcoal/65">
            Төмендегі мысалдардан әр буынның声母, 韵母 және声调 бөліктерін
            салыстыр. Бірдей声母 мен韵母 әртүрлі тон арқылы басқа мағына
            бере алады.
          </p>

          <div className="mt-8 space-y-4">
            {pinyinSyllables.map((item) => (
              <div
                key={item.pinyin}
                className="border border-charcoal/20 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-semibold">
                      {item.pinyin}
                    </span>
                    <span className="text-2xl text-charcoal/50">
                      {item.hanzi}
                    </span>
                  </div>
                  <span className="text-sm text-charcoal/60">
                    {item.meaning}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  <div className="bg-charcoal/5 p-3">
                    <p className="text-xs text-charcoal/50">声母</p>
                    <p className="mt-2 text-xl font-semibold">
                      {item.initial}
                    </p>
                  </div>

                  <div className="bg-charcoal/5 p-3">
                    <p className="text-xs text-charcoal/50">韵母</p>
                    <p className="mt-2 text-xl font-semibold">
                      {item.final}
                    </p>
                  </div>

                  <div className="bg-charcoal/5 p-3">
                    <p className="text-xs text-charcoal/50">声调</p>
                    <p className="mt-2 text-xl font-semibold">
                      {item.tone}-тон
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm font-medium text-terracotta">
                  {item.structure}
                </p>
                <p className="mt-2 text-sm leading-7 text-charcoal/65">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <p className="text-xs tracking-[0.2em] text-terracotta">
            02 / 韵母
          </p>
          <h3 className="mt-4 text-3xl font-semibold">
            韵母 түрлері
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-charcoal/65">
            韵母 бір немесе бірнеше дыбыстан құралуы мүмкін.
            Бастапқы кезеңде оларды қарапайым және күрделі韵母 деп
            ажыратып үйренген дұрыс.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="border border-charcoal/20 p-6">
              <h4 className="text-xl font-semibold">Қарапайым韵母</h4>
              <p className="mt-3 text-3xl font-semibold">a · o · e · i · u · ü</p>
              <p className="mt-4 text-sm leading-7 text-charcoal/65">
                Бұлар жеке дауысты дыбыстардан тұратын негізгі韵母 түрлері.
                Мысалы: mā сөзіндегі a, yī сөзіндегі i.
              </p>
            </div>

            <div className="border border-charcoal/20 p-6">
              <h4 className="text-xl font-semibold">Күрделі韵母</h4>
              <p className="mt-3 text-3xl font-semibold">ai · ei · ao · ou</p>
              <p className="mt-4 text-sm leading-7 text-charcoal/65">
                Бұлар бірнеше дауысты дыбыстың бірігуінен жасалады.
                Мысалы: ài сөзіндегі ai, hǎo сөзіндегі ao.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <p className="text-xs tracking-[0.2em] text-terracotta">
            03 / 零声母
          </p>
          <h3 className="mt-4 text-3xl font-semibold">
            Нөлдік бастапқы дыбыс
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-charcoal/65">
            Қытай тіліндегі әр буын міндетті түрде дауыссыз дыбыстан
            басталмайды. Егер буын声母 дыбысынсыз басталса, оны
            零声母 деп атайды.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="border border-charcoal/20 p-5">
              <p className="text-3xl font-semibold">ài</p>
              <p className="mt-2 text-xl">爱</p>
              <p className="mt-2 text-sm text-charcoal/60">сүю</p>
              <p className="mt-4 text-sm text-terracotta">零声母 + ai</p>
            </div>

            <div className="border border-charcoal/20 p-5">
              <p className="text-3xl font-semibold">yī</p>
              <p className="mt-2 text-xl">衣</p>
              <p className="mt-2 text-sm text-charcoal/60">киім</p>
              <p className="mt-4 text-sm text-terracotta">零声母 + i</p>
            </div>

            <div className="border border-charcoal/20 p-5">
              <p className="text-3xl font-semibold">wǒ</p>
              <p className="mt-2 text-xl">我</p>
              <p className="mt-2 text-sm text-charcoal/60">мен</p>
              <p className="mt-4 text-sm text-terracotta">零声母 + uo</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-charcoal/60">
            Ескерту: y және w кейбір буындардың пиньинь жазылуында
            қолданылады. Олар бұл мысалдарда жеке声母 ретінде
            талданбайды.
          </p>
        </div>

        <div className="mt-20">
          <p className="text-xs tracking-[0.2em] text-terracotta">
            04 / 声调
          </p>
          <h3 className="mt-4 text-3xl font-semibold">
            Төрт негізгі тон
          </h3>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {pinyinToneDescriptions.map((item) => (
              <div
                key={item.name}
                className="border border-charcoal/20 p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-charcoal/60">{item.name}</p>
                  <p className="text-4xl font-semibold text-terracotta">
                    {item.mark}
                  </p>
                </div>
                <p className="mt-4 text-lg font-semibold">{item.tone}</p>
                <p className="mt-2 text-sm leading-7 text-charcoal/65">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-l-2 border-terracotta bg-charcoal/5 p-6">
          <h3 className="text-lg font-semibold">Есте сақта</h3>
          <p className="mt-3 text-sm leading-7 text-charcoal/70">
            Қытай буынын талдағанда алдымен声母 дыбысын анықта.
            Содан кейін韵母 бөлігін тап. Соңында声调 белгісіне назар аудар.
            Кейбір буындарда声母 болмайтынын ұмытпа.
          </p>
        </div>
      </div>
    </section>
  );
}
