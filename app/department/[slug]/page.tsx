import { notFound } from "next/navigation";

import { departments } from "../data/department";
import { queryOne } from "@/lib/db";

import DepartmentHero from "../components/DepartmentHero";
import DepartmentFacilities from "../components/DepartmentFacilities";
import DepartmentFaculty from "../components/DepartmentFaculty";
import DepartmentGallery from "../components/DepartmentGallery";
import DepartmentAchievements from "../components/DepartmentAchievements";
import DepartmentCTA from "../components/DepartmentCTA";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = true;

export function generateStaticParams() {
  return departments.map(({ slug }) => ({ slug }));
}

export default async function DepartmentDetails({ params }: Props) {

  const { slug } = await params;

  const fallback = departments.find(
    (item) => item.slug === slug
  );
  const row = await queryOne<{ id: number; name: string; slug: string; description: string | null; hero_image: string | null; color: string | null; extra_json: string | null }>("SELECT id, name, slug, description, hero_image, color, extra_json FROM departments WHERE slug = ? AND status = 'ACTIVE'", [slug]);
  let extra: Record<string, unknown> = {};
  try { extra = row?.extra_json ? JSON.parse(row.extra_json) as Record<string, unknown> : {}; } catch { extra = {}; }
  const department = row ? { ...(fallback ?? departments[0]), id: row.id, slug: row.slug, title: row.name, description: row.description ?? "", banner: row.hero_image ?? fallback?.banner ?? departments[0].banner, color: row.color ?? fallback?.color ?? "#B60F17", facilities: Array.isArray(extra.facilities) ? extra.facilities as string[] : fallback?.facilities ?? [], gallery: Array.isArray(extra.gallery) ? extra.gallery as string[] : fallback?.gallery ?? [], faculty: Array.isArray(extra.faculty) ? extra.faculty : fallback?.faculty ?? [], stats: Array.isArray(extra.stats) ? extra.stats : fallback?.stats ?? [], achievements: Array.isArray(extra.achievements) ? extra.achievements as string[] : fallback?.achievements ?? [] } : fallback;

  if (!department) {
    notFound();
  }

  return (
    <main>

      
      {/* gffdhijijck */}

      <DepartmentHero department={department} />

<DepartmentFacilities
  facilities={department.facilities}
/>

<DepartmentFaculty
  faculty={department.faculty}
/>

<DepartmentGallery
  gallery={department.gallery}
/>

<DepartmentAchievements
  stats={department.stats}
  achievements={department.achievements}
/>

<DepartmentCTA
  department={department}
/>

    </main>
  );
}
