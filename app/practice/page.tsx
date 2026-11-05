import Link from "next/link";
import FirstWords from "../components/FirstWords";
import FirstWordsQuiz from "../components/FirstWordsQuiz";
import PageHeading from "../components/PageHeading";
import SentenceQuiz from "../components/SentenceQuiz";
import SimpleSentences from "../components/SimpleSentences";
import SyllableLesson from "../components/SyllableLesson";
import SyllableQuiz from "../components/SyllableQuiz";
import ToneQuiz from "../components/ToneQuiz";

export default function PracticePage() {
  return (
    <div className="space-y-8">
      <PageHeading eyebrow="ҚАЙТАЛАУ ЖӘНЕ ТЕКСЕРУ" title="Жаттығу орталығы" description="Қолданыстағы тесттерді осында жинадық. Пиньинь мен HSK курстары бөлек модульдерде оқытылады." />
      <nav className="flex flex-wrap gap-2" aria-label="Жаттығуға өту">
        <Link href="/learn/pinyin" className="min-h-11 inline-flex items-center rounded-lg bg-charcoal px-4 text-sm font-semibold text-white hover:bg-terracotta">Пиньинь курсы</Link>
        <Link href="/learn/hsk" className="min-h-11 inline-flex items-center rounded-lg border border-charcoal/15 px-4 text-sm font-semibold hover:border-terracotta/50">HSK 1 курсы</Link>
      </nav>
      <div className="space-y-2 rounded-xl border border-charcoal/10 bg-paper p-2 sm:p-4">
        <FirstWords />
        <FirstWordsQuiz />
        <SimpleSentences />
        <SentenceQuiz />
        <SyllableLesson />
        <SyllableQuiz />
        <div id="tone-practice" className="scroll-mt-24"><ToneQuiz /></div>
      </div>
    </div>
  );
}
