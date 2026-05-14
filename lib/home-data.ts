import type {
  BottomNavItem,
  DailyCheckInCardData,
  HeroContent,
  HomeHeaderData,
  IntentionItem,
  JourneyCardData,
  QuoteBannerData,
  RitualCardData,
} from "@/types/home";

// Design tokens:
// colors: navy, purple, pink, cream, lavender, soft yellow
// radii: 20, 24, 28, 32
// shadows: soft-card, elevated-card
// spacing: page 20-24, section 28, card gap 16

export const homeHeader: HomeHeaderData = {
  greeting: "Good morning,",
  name: "Orion",
  moodChip: {
    label: "You've got this",
  },
  streakCount: 12,
  streakLabel: "Day streak",
  avatarSrc: "/assets/cosmic/avatar-orion.png",
};

export const heroContent: HeroContent = {
  title: "How can I",
  highlightedTitle: "support you today?",
};

export const intentions: IntentionItem[] = [
  {
    id: "clarity",
    label: "Clarity",
    icon: "sparkle",
    gradientClassName:
      "bg-[linear-gradient(160deg,#f6f1ff_0%,#fcf9ff_58%,#fff8fd_100%)]",
    iconClassName: "text-[#8d63ff]",
  },
  {
    id: "peace",
    label: "Peace",
    icon: "moon",
    gradientClassName:
      "bg-[linear-gradient(160deg,#fff7fb_0%,#fff9fd_52%,#fff3f8_100%)]",
    iconClassName: "text-[#ff6fa9]",
  },
  {
    id: "confidence",
    label: "Confidence",
    icon: "sun",
    gradientClassName:
      "bg-[linear-gradient(160deg,#fffaf1_0%,#fffdf7_52%,#fff4dc_100%)]",
    iconClassName: "text-[#ffb13d]",
  },
  {
    id: "closure",
    label: "Closure",
    icon: "heart",
    gradientClassName:
      "bg-[linear-gradient(160deg,#fff7fb_0%,#fff9fd_52%,#fff2f8_100%)]",
    iconClassName: "text-[#ff70a8]",
  },
];

export const ritualCard: RitualCardData = {
  eyebrow: "TODAY'S RITUAL ✨",
  title: "Pull a card",
  italicTitle: "for clarity",
  description:
    "Get gentle guidance for whatever you're moving through.",
  buttonLabel: "Pull a Card",
  communityText: "24K+ people drew clarity today",
  cardStackSrc: "/assets/cosmic/card-stack.png",
  avatars: [
    {
      id: "ava-1",
      src: "/assets/cosmic/avatar-orion.png",
      alt: "Community member avatar one",
    },
    {
      id: "ava-2",
      src: "/assets/cosmic/avatar-orion.png",
      alt: "Community member avatar two",
    },
    {
      id: "ava-3",
      src: "/assets/cosmic/avatar-orion.png",
      alt: "Community member avatar three",
    },
  ],
};

export const dailyCheckIn: DailyCheckInCardData = {
  title: "Daily check-in",
  description: "How are you feeling today?",
  buttonLabel: "Check in",
  imageSrc: "/assets/cosmic/cloud-mascot.png",
};

export const journeyCard: JourneyCardData = {
  title: "Your journey",
  days: 7,
  description: "of showing up for yourself",
  imageSrc: "/assets/cosmic/star-cloud.png",
};

export const quoteBanner: QuoteBannerData = {
  text: "The answers you're looking for are already",
  highlightedText: "within you.",
  imageSrc: "/assets/cosmic/quote-heart.png",
};

export const bottomNavItems: BottomNavItem[] = [
  { id: "home", label: "Home", icon: "home", href: "/", active: true },
  { id: "draw", label: "Draw", icon: "draw", href: "/draw" },
  { id: "profile", label: "Profile", icon: "profile", href: "/profile" },
];
