export type Grade = "الأول الثانوي" | "الثاني الثانوي" | "الثالث الثانوي";
export type UserRole = "guest" | "student" | "admin" | "instructor";
export type CourseStatus = "draft" | "published" | "archived" | "coming_soon";

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  studentsCount: number;
  coursesCount: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  unitId?: string | null;
  unitTitle?: string;
  title: string;
  description: string;
  durationMinutes: number;
  order: number;
  isFree: boolean;
  hasPdf: boolean;
  hasVideo: boolean;
  videoSource?: "none" | "upload" | "youtube" | "vimeo" | "embed" | "external";
  pdfSource?: "none" | "upload" | "url";
  videoThumbnail: string;
  courseTitle?: string;
  courseSlug?: string;
  coursePrice?: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  grade: Grade;
  price: number;
  paypalPrice?: number;
  status?: CourseStatus;
  isNew: boolean;
  viewsCount: number;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  reviewsCount?: number;
  instructorId?: string;
  tags: string[];
  units?: { title: string; lessonIds: string[] }[];
}

export type SubscriptionStatus = "active" | "pending" | "expired" | "none";
export type PaymentMethod = "vodafone_cash" | "instapay" | "paypal" | "whatsapp" | "manual" | "free";
export type PaymentStatus = "pending" | "approved" | "rejected" | "failed" | "cancelled" | "refunded";

export interface Subscription {
  id: string;
  studentId: string;
  courseId: string;
  status: SubscriptionStatus;
  activatedAt?: string;
  method?: PaymentMethod;
}

export interface Payment {
  id: string;
  orderCode?: string;
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  studentGrade?: string;
  courseTitle: string;
  amount: number;
  coursePriceEgp?: number;
  currency?: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  proofPath?: string;
  proofImage?: string;
  payerName?: string;
  payerPhone?: string;
  transferTo?: string;
  accountName?: string;
  transferredAt?: string;
  providerOrderId?: string;
  providerCaptureId?: string;
  source?: string;
  createdAt: string;
  paidAt?: string;
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  email?: string;
  grade: Grade;
  governorate: string;
  avatar: string;
  joinedAt: string;
  coursesSubscribed: number;
  status: "active" | "disabled";
}

export interface QRCode {
  id: string;
  targetType: "course" | "lesson" | "pdf";
  targetTitle: string;
  targetId: string;
  link: string;
  imageUrl: string;
  scans: number;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}


export interface CourseReview {
  id: number;
  course_id?: number | null;
  course_title?: string | null;
  name: string;
  phone?: string | null;
  grade?: string | null;
  avatar?: string | null;
  rating: number;
  comment: string;
  image?: string | null;
  status?: "pending" | "published" | "rejected";
  admin_reply?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ReviewSummary {
  total: number;
  average: number;
  distribution: Record<number, number>;
}
