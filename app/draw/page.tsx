import { BottomNav } from "@/components/navigation/BottomNav";
import { PullCardClient } from "@/components/draw/PullCardClient";
import { bottomNavItems } from "@/lib/home-data";

export default function DrawPage() {
  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fffdfa_0%,#fff7fb_34%,#f8f4ff_68%,#fffdf9_100%)] text-[var(--color-navy)]">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-[-7rem] top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,191,223,0.2)_0%,rgba(255,191,223,0)_70%)] blur-3xl" />
          <div className="absolute right-[-6rem] top-52 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(190,170,255,0.22)_0%,rgba(190,170,255,0)_72%)] blur-3xl" />
        </div>

        <PullCardClient />
      </main>

      <BottomNav items={bottomNavItems} />
    </>
  );
}
