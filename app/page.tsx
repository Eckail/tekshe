import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Courses from "./components/Courses";
import About from "./components/About";
import Footer from "./components/Footer";
import PinyinList from "./components/PinyinList";
import ToneQuiz from "./components/ToneQuiz";
import PlayerProgress from "./components/PlayerProgress";
import DailyQuests from "./components/DailyQuests";
import Achievements from "./components/Achievements";
import LearningPath from "./components/LearningPath";
import CourseCompletionButton from "./components/CourseCompletionButton";
import SyllableLesson from "./components/SyllableLesson";
import SyllableQuiz from "./components/SyllableQuiz";
import FirstWords from "./components/FirstWords";
import FirstWordsQuiz from "./components/FirstWordsQuiz";
import SimpleSentences from "./components/SimpleSentences";
import SentenceQuiz from "./components/SentenceQuiz";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F3EDE1] text-[#242321]">

     <Navbar />

      <Hero />

     

      {/* Introduction strip */}
      <section className="border-y border-[#242321]/20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-7 text-xs tracking-[0.2em] md:flex-row md:px-12">
          <span>01 / ТІЛ</span>
          <span>02 / МӘДЕНИЕТ</span>
          <span>03 / БІЛІМ</span>
          <span className="text-[#B85F3D]">LEARN SOMETHING NEW ↗</span>
        </div>
      </section>

      <PlayerProgress />

      <DailyQuests />

      <Achievements />

      <LearningPath />

      <Courses />

<div id="pinyin-basics">
  <PinyinList />

  <div className="mx-auto max-w-5xl px-6 pb-12">
    <CourseCompletionButton courseId="pinyin-basics" />
  </div>
</div>

<div id="tone-practice">
  <ToneQuiz />
</div>

      <SyllableLesson />

      <SyllableQuiz />

      <FirstWords />  

      <FirstWordsQuiz />

      <SimpleSentences />

      <SentenceQuiz />


      <About />

      <Footer />

    </main>
  );
}
