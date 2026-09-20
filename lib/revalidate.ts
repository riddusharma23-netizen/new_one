import { revalidatePath } from "next/cache";

export function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/teachers");
  revalidatePath("/schedules");
  revalidatePath("/gallery");
  revalidatePath("/gallery1");
  revalidatePath("/department");
  revalidatePath("/blog");
  revalidatePath("/events");
  revalidatePath("/contact");
  revalidatePath("/student-corner/result");
}
