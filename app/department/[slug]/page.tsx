import { notFound } from "next/navigation";

import { departments } from "../data/department";

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

export const dynamicParams = false;

export function generateStaticParams() {
  return departments.map(({ slug }) => ({ slug }));
}

export default async function DepartmentDetails({ params }: Props) {

  const { slug } = await params;

  const department = departments.find(
    (item) => item.slug === slug
  );

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
