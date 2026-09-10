import { LucideIcon } from "lucide-react";

export interface SectionHeadingType {
  badge: string;
  titleBlack: string;
  titleGradient: string;
  description: string;
}

export interface AdmissionSectionType {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
}

export interface DisciplineRuleType {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ButtonType {
  text: string;
  link: string;
}

export interface NoteType {
  title: string;
  description: string;
}