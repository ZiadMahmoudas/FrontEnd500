import { apiFetch } from "./client";
import type { Lesson } from "@/lib/types";

export async function getLessonsByCourse(courseId: string): Promise<Lesson[]> {
  const response = await apiFetch<{ success: true; lessons: Lesson[] }>(`/courses-id/${encodeURIComponent(courseId)}/lessons`);
  return response.lessons;
}

export async function getLessonById(id: string): Promise<Lesson | undefined> {
  try {
    const response = await apiFetch<{ success: true; lesson: Lesson }>(`/lessons/${encodeURIComponent(id)}`);
    return response.lesson;
  } catch {
    return undefined;
  }
}
