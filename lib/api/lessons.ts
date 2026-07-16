// Mock API service — replace with real PHP REST API calls later.
import { lessons } from "@/lib/mock-data";
import type { Lesson } from "@/lib/types";

export async function getLessonsByCourse(courseId: string): Promise<Lesson[]> {
  return Promise.resolve(lessons.filter((l) => l.courseId === courseId));
}

export async function getLessonById(id: string): Promise<Lesson | undefined> {
  return Promise.resolve(lessons.find((l) => l.id === id));
}
