import Image from "next/image";
import Link from "next/link";

import { BottomNav } from "@/components/navigation/BottomNav";
import { bottomNavItems, homeHeader } from "@/lib/home-data";

export default function ProfilePage() {
  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fff8fc_0%,#f8ecff_54%,#f2e8ff_100%)] text-[#17203f]">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-[-7rem] top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,191,223,0.22)_0%,rgba(255,191,223,0)_70%)] blur-3xl" />
          <div className="absolute right-[-6rem] top-52 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(190,170,255,0.24)_0%,rgba(190,170,255,0)_72%)] blur-3xl" />
        </div>

        <section className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pb-32 pt-[calc(env(safe-area-inset-top)+24px)] sm:px-6">
          <div className="animate-draw-rise rounded-[36px] border border-white/70 bg-white/72 p-6 text-center shadow-[0_24px_70px_rgba(37,31,79,0.12)] backdrop-blur-xl">
            <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-[0_18px_42px_rgba(40,32,89,0.16)]">
              <Image
                src={homeHeader.avatarSrc}
                alt="Orion profile avatar"
                fill
                sizes="112px"
                className="object-cover"
                priority
              />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.22em] text-[#9368f4]">
              Your cosmic rhythm
            </p>
            <h1 className="mt-2 text-[3rem] font-extrabold leading-none tracking-[-0.08em]">
              Orion ✨
            </h1>
            <p className="mx-auto mt-4 max-w-[18rem] text-base leading-7 text-[#5f6885]">
              Keep showing up softly. Your streak, saved cards, and reflections
              will live here as the app grows.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-[28px] border border-white/70 bg-white/78 p-5 shadow-[0_16px_36px_rgba(29,24,66,0.08)] backdrop-blur-xl">
              <span className="text-[2rem]" aria-hidden="true">
                🔥
              </span>
              <p className="mt-3 text-[2.8rem] font-extrabold leading-none tracking-[-0.08em]">
                12
              </p>
              <p className="mt-2 text-sm font-semibold text-[#68718c]">
                day streak
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/78 p-5 shadow-[0_16px_36px_rgba(29,24,66,0.08)] backdrop-blur-xl">
              <span className="text-[2rem] text-[#8b63ff]" aria-hidden="true">
                ✦
              </span>
              <p className="mt-3 text-[2.8rem] font-extrabold leading-none tracking-[-0.08em]">
                7
              </p>
              <p className="mt-2 text-sm font-semibold text-[#68718c]">
                mindful days
              </p>
            </div>
          </div>

          <Link
            href="/draw"
            className="mt-5 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#724eff,#984dff)] text-base font-extrabold text-white shadow-[0_18px_34px_rgba(92,55,218,0.28)] transition active:scale-95"
          >
            <span>✦</span>
            Draw today&apos;s card
          </Link>
        </section>
      </main>

      <BottomNav items={bottomNavItems} />
    </>
  );
}
