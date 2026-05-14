import type { ReactNode } from "react";

export type IntentionIcon = "sparkle" | "moon" | "sun" | "heart";

export type NavIcon =
  | "home"
  | "draw"
  | "decks"
  | "journal"
  | "insights"
  | "profile";

export interface MoodChipData {
  label: string;
}

export interface HomeHeaderData {
  greeting: string;
  name: string;
  moodChip: MoodChipData;
  streakCount: number;
  streakLabel: string;
  avatarSrc: string;
}

export interface HeroContent {
  title: string;
  highlightedTitle: string;
}

export interface IntentionItem {
  id: string;
  label: string;
  icon: IntentionIcon;
  gradientClassName: string;
  iconClassName: string;
}

export interface RitualAvatar {
  id: string;
  src: string;
  alt: string;
}

export interface RitualCardData {
  eyebrow: string;
  title: string;
  italicTitle: string;
  description: string;
  buttonLabel: string;
  communityText: string;
  cardStackSrc: string;
  avatars: RitualAvatar[];
}

export interface DailyCheckInCardData {
  title: string;
  description: string;
  buttonLabel: string;
  imageSrc: string;
}

export interface JourneyCardData {
  title: string;
  days: number;
  description: string;
  imageSrc: string;
}

export interface QuoteBannerData {
  text: string;
  highlightedText: string;
  imageSrc: string;
}

export interface BottomNavItem {
  id: string;
  label: string;
  icon: NavIcon;
  href: string;
  active?: boolean;
  hasNotification?: boolean;
}

export interface AppCardProps {
  children: ReactNode;
  className?: string;
}
