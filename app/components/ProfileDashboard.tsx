"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import AppIcon from "./AppIcon";
import PageHeading from "./PageHeading";
import { learningSummaryStore } from "../data/learningSummary";

export default function ProfileDashboard() {
  const summary = useSyncExternalStore(learningSummaryStore.subscribe, learningSummaryStore.getSnapshot, learningSummaryStore.getServerSnapshot);
  return (
    <div className="space-y-8">
      <PageHeading eyebrow="ҚҰРЫЛҒЫДАҒЫ ОҚУШЫ ПРОФИЛІ" title="Профиль" description="Қазір Tekshe-де тіркелгі немесе бұлттық синхрондау жоқ. Жеке дерек сұралмайды." />
      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-xl border border-charcoal/10 bg-paper p-5 sm:p-7">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sand/50 text-charcoal"><AppIcon name="user" className="h-7 w-7" /></div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/50">ОҚУШЫ</p>
          <h2 className="mt-2 text-2xl font-semibold">Қонақ оқушы</h2>
          <p className="mt-2 text-sm text-charcoal/60">Аты-жөні сақталмайды</p>
        </div>
        <div className="rounded-xl border border-charcoal/10 bg-paper p-5 sm:p-7">
          <h2 className="text-lg font-semibold">Осы бета-нұсқа туралы</h2>
          <dl className="mt-4 divide-y divide-charcoal/10 text-sm">
            <div className="flex justify-between gap-4 py-3"><dt className="text-charcoal/60">Оқыту тілі</dt><dd className="font-medium">Қазақша</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-charcoal/60">Үйренетін тіл</dt><dd className="font-medium">Мандарин қытай тілі</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-charcoal/60">Деректер орны</dt><dd className="text-right font-medium">Осы браузердегі localStorage</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-charcoal/60">Басқа құрылғымен синхрондау</dt><dd className="font-medium">Жоқ</dd></div>
          </dl>
          <p className="mt-4 rounded-lg bg-sand/30 p-3 text-xs leading-5 text-charcoal/65">Браузердің сайт деректерін тазаласаңыз, оқу барысы мен Tek Coin журналы өшуі мүмкін. Әзірге тіркелгі, экспорт не серверлік көшірме жоқ.</p>
        </div>
      </section>
      <Link href={summary.continueHref} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-charcoal px-4 text-sm font-semibold text-white transition-colors hover:bg-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta">Соңғы сабақты ашу <AppIcon name="arrow" className="h-4 w-4" /></Link>
    </div>
  );
}
