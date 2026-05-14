import { BottomNav } from "@/components/navigation/BottomNav";
import { DailyCheckInCard } from "@/components/home/DailyCheckInCard";
import { HomeHeader } from "@/components/home/HomeHeader";
import { IntentionGrid } from "@/components/home/IntentionGrid";
import { JourneyCard } from "@/components/home/JourneyCard";
import { QuoteBanner } from "@/components/home/QuoteBanner";
import { RitualCard } from "@/components/home/RitualCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  bottomNavItems,
  dailyCheckIn,
  heroContent,
  homeHeader,
  intentions,
  journeyCard,
  quoteBanner,
  ritualCard,
} from "@/lib/home-data";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-[linear-gradient(180deg,#fffdfa_0%,#fff8fb_26%,#f8f4ff_58%,#fffdf9_100%)] text-[var(--color-navy)]">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-[-6rem] top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,186,224,0.22)_0%,rgba(255,186,224,0)_72%)] blur-2xl" />
          <div className="absolute right-[-5rem] top-48 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(193,170,255,0.24)_0%,rgba(193,170,255,0)_70%)] blur-3xl" />
          <div className="absolute bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,226,170,0.18)_0%,rgba(255,226,170,0)_72%)] blur-3xl" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[430px] flex-col gap-6 px-5 pb-32 pt-[calc(env(safe-area-inset-top)+20px)] sm:px-6">
          <HomeHeader {...homeHeader} />

          <SectionHeading
            title={heroContent.title}
            highlightedTitle={heroContent.highlightedTitle}
          />

          <IntentionGrid items={intentions} />

          <RitualCard {...ritualCard} />

          <section
            aria-label="Wellness highlights"
            className="grid grid-cols-2 gap-4"
          >
            <DailyCheckInCard {...dailyCheckIn} />
            <JourneyCard {...journeyCard} />
          </section>

          <QuoteBanner {...quoteBanner} />
        </div>
      </main>

      <BottomNav items={bottomNavItems} />
    </>
  );
}
