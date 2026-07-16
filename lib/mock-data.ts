import type {
  Course,
  Lesson,
  Instructor,
  Student,
  Payment,
  QRCode,
  Testimonial,
  FAQItem,
} from "./types";

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const instructors: Instructor[] = [
  {
    id: "ins-1",
    name: "أ. محمد الجندي",
    title: "مدرس علوم الحاسب وتكنولوجيا المعلومات",
    bio: "خبرة أكثر من 10 سنوات في تدريس البرمجة لطلاب الثانوية العامة، متخصص في بايثون والذكاء الاصطناعي وهياكل البيانات.",
    avatar: img("photo-1560250097-0b93528c311a", 300),
    studentsCount: 4200,
    coursesCount: 12,
  },
];

export const courses: Course[] = [
  {
    id: "1",
    slug: "python-basics-3rd-secondary",
    title: "أساسيات البرمجة بلغة بايثون",
    shortDescription: "دورة شاملة لتأسيس الطالب في البرمجة من الصفر حتى الاحتراف.",
    description:
      "في هذه الدورة سيتعلم الطالب أساسيات لغة بايثون خطوة بخطوة، بدءًا من المتغيرات وأنواع البيانات، مرورًا بالجمل الشرطية والحلقات التكرارية، وصولًا إلى بناء مشاريع عملية بسيطة تناسب منهج الثانوية العامة.",
    image: img("photo-1526379095098-d400fd0bf935"),
    grade: "الثالث الثانوي",
    price: 250,
    isNew: true,
    viewsCount: 15400,
    lessonsCount: 18,
    studentsCount: 1280,
    rating: 4.9,
    instructorId: "ins-1",
    tags: ["بايثون", "منهج 2026"],
    units: [
      { title: "الوحدة الأولى: مقدمة في البرمجة", lessonIds: ["1", "2", "3"] },
      { title: "الوحدة الثانية: التحكم في سير البرنامج", lessonIds: ["4", "5", "6"] },
      { title: "الوحدة الثالثة: هياكل البيانات", lessonIds: ["7", "8"] },
    ],
  },
  {
    id: "2",
    slug: "data-structures-secondary",
    title: "هياكل البيانات وتراكيبها",
    shortDescription: "فهم عميق للمصفوفات والقوائم والأشجار بأسلوب مبسط.",
    description:
      "دورة متقدمة تشرح هياكل البيانات الأساسية المطلوبة في منهج الثانوية العامة مع أمثلة تطبيقية وتمارين محلولة خطوة بخطوة.",
    image: img("photo-1555949963-aa79dcee981c"),
    grade: "الثالث الثانوي",
    price: 300,
    isNew: false,
    viewsCount: 9800,
    lessonsCount: 14,
    studentsCount: 860,
    rating: 4.8,
    instructorId: "ins-1",
    tags: ["هياكل بيانات"],
    units: [
      { title: "الوحدة الأولى: المصفوفات", lessonIds: ["9", "10"] },
      { title: "الوحدة الثانية: القوائم المترابطة", lessonIds: ["11", "12"] },
    ],
  },
  {
    id: "3",
    slug: "web-development-intro",
    title: "مقدمة في تطوير الويب HTML & CSS",
    shortDescription: "ابنِ أول موقع إلكتروني لك بخطوات عملية وممتعة.",
    description:
      "تعلم بناء صفحات الويب باستخدام HTML وCSS من الصفر، مع مشروع عملي متكامل في نهاية الدورة يقدر يتعرض في ملف أعمال الطالب.",
    image: img("photo-1547658719-da2b51169166"),
    grade: "الثاني الثانوي",
    price: 0,
    isNew: true,
    viewsCount: 21300,
    lessonsCount: 10,
    studentsCount: 2100,
    rating: 4.7,
    instructorId: "ins-1",
    tags: ["ويب", "مجاني"],
    units: [{ title: "الوحدة الأولى: أساسيات HTML", lessonIds: ["13", "14"] }],
  },
  {
    id: "4",
    slug: "cs-first-secondary-foundations",
    title: "أساسيات علوم الحاسب - الصف الأول الثانوي",
    shortDescription: "المنهج كامل بشرح مبسط ومنظم مع مراجعات دورية.",
    description:
      "دورة متكاملة تغطي منهج علوم الحاسب للصف الأول الثانوي بالكامل مع مراجعات نهاية كل وحدة واختبارات تفاعلية.",
    image: img("photo-1516321318423-f06f85e504b3"),
    grade: "الأول الثانوي",
    price: 180,
    isNew: false,
    viewsCount: 12100,
    lessonsCount: 22,
    studentsCount: 1750,
    rating: 4.6,
    instructorId: "ins-1",
    tags: ["منهج مدرسي"],
    units: [{ title: "الوحدة الأولى: مفاهيم أساسية", lessonIds: ["15", "16"] }],
  },
  {
    id: "5",
    slug: "algorithms-thinking",
    title: "التفكير الخوارزمي وحل المشكلات",
    shortDescription: "طور مهاراتك في تحليل المشكلات وبناء الخوارزميات.",
    description:
      "دورة تركز على تنمية مهارة التفكير المنطقي وبناء الخوارزميات باستخدام المخططات الانسيابية والشيفرة الزائفة.",
    image: img("photo-1517694712202-14dd9538aa97"),
    grade: "الثاني الثانوي",
    price: 220,
    isNew: false,
    viewsCount: 7600,
    lessonsCount: 12,
    studentsCount: 540,
    rating: 4.9,
    instructorId: "ins-1",
    tags: ["خوارزميات"],
    units: [{ title: "الوحدة الأولى: المخططات الانسيابية", lessonIds: ["17", "18"] }],
  },
  {
    id: "6",
    slug: "databases-intro",
    title: "مقدمة في قواعد البيانات",
    shortDescription: "تعرف على تصميم قواعد البيانات ولغة الاستعلام SQL.",
    description:
      "دورة تمهيدية تشرح مفهوم قواعد البيانات العلائقية وكيفية كتابة استعلامات SQL بسيطة وفق منهج الثانوية العامة.",
    image: img("photo-1544197150-b99a580bb7a8"),
    grade: "الثالث الثانوي",
    price: 200,
    isNew: true,
    viewsCount: 5300,
    lessonsCount: 9,
    studentsCount: 310,
    rating: 4.5,
    instructorId: "ins-1",
    tags: ["قواعد بيانات"],
    units: [{ title: "الوحدة الأولى: مفاهيم أساسية", lessonIds: ["19", "20"] }],
  },
];

export const lessons: Lesson[] = [
  { id: "1", courseId: "1", unitTitle: "الوحدة الأولى: مقدمة في البرمجة", title: "ما هي البرمجة؟", description: "نظرة عامة على مفهوم البرمجة ولغاتها وأهميتها في حياتنا اليومية.", durationMinutes: 12, order: 1, isFree: true, hasPdf: true, hasVideo: true, videoThumbnail: img("photo-1587620962725-abab7fe55159", 700) },
  { id: "2", courseId: "1", unitTitle: "الوحدة الأولى: مقدمة في البرمجة", title: "تثبيت بيئة العمل", description: "خطوات تثبيت بايثون وبيئة التطوير على جهازك.", durationMinutes: 15, order: 2, isFree: true, hasPdf: true, hasVideo: true, videoThumbnail: img("photo-1607705703571-c5a8695f18f6", 700) },
  { id: "3", courseId: "1", unitTitle: "الوحدة الأولى: مقدمة في البرمجة", title: "المتغيرات وأنواع البيانات", description: "التعرف على المتغيرات وأنواع البيانات الأساسية في بايثون.", durationMinutes: 18, order: 3, isFree: false, hasPdf: true, hasVideo: true, videoThumbnail: img("photo-1555066931-4365d14bab8c", 700) },
  { id: "4", courseId: "1", unitTitle: "الوحدة الثانية: التحكم في سير البرنامج", title: "الجمل الشرطية if / else", description: "كيفية اتخاذ القرارات داخل البرنامج باستخدام الجمل الشرطية.", durationMinutes: 20, order: 4, isFree: false, hasPdf: true, hasVideo: true, videoThumbnail: img("photo-1516116216624-53e697fedbea", 700) },
  { id: "5", courseId: "1", unitTitle: "الوحدة الثانية: التحكم في سير البرنامج", title: "حلقة for التكرارية", description: "استخدام حلقة for لتنفيذ الأوامر بشكل متكرر.", durationMinutes: 17, order: 5, isFree: false, hasPdf: true, hasVideo: true, videoThumbnail: img("photo-1461749280684-dccba630e2f6", 700) },
  { id: "6", courseId: "1", unitTitle: "الوحدة الثانية: التحكم في سير البرنامج", title: "حلقة while التكرارية", description: "الفرق بين for و while ومتى تستخدم كل منهما.", durationMinutes: 16, order: 6, isFree: false, hasPdf: false, hasVideo: true, videoThumbnail: img("photo-1518432031352-d6fc5c10da5a", 700) },
  { id: "7", courseId: "1", unitTitle: "الوحدة الثالثة: هياكل البيانات", title: "القوائم Lists", description: "التعامل مع القوائم وطرق التعديل عليها.", durationMinutes: 19, order: 7, isFree: false, hasPdf: true, hasVideo: true, videoThumbnail: img("photo-1504639725590-34d0984388bd", 700) },
  { id: "8", courseId: "1", unitTitle: "الوحدة الثالثة: هياكل البيانات", title: "القواميس Dictionaries", description: "تخزين البيانات على هيئة أزواج مفتاح وقيمة.", durationMinutes: 14, order: 8, isFree: false, hasPdf: true, hasVideo: true, videoThumbnail: img("photo-1509966756634-9c23dd6e6815", 700) },
];

export const testimonials: Testimonial[] = [
  { id: "t-1", name: "يوسف أحمد", grade: "الصف الثالث الثانوي", avatar: img("photo-1500648767791-00dcc994a43e", 200), content: "الشرح واضح جدًا وبسيط، فهمت البرمجة بطريقة مختلفة تمامًا عن المدرسة. الأستاذ بيبسط المعلومة جدًا.", rating: 5 },
  { id: "t-2", name: "مريم خالد", grade: "الصف الثاني الثانوي", avatar: img("photo-1544005313-94ddf0286df2", 200), content: "المنصة سهلة الاستخدام والفيديوهات منظمة حسب الوحدات، وده وفر عليا وقت كبير في المراجعة.", rating: 5 },
  { id: "t-3", name: "عمر سامي", grade: "الصف الأول الثانوي", avatar: img("photo-1519085360753-af0119f7cbe7", 200), content: "الدعم على واتساب سريع جدًا، وأي استفسار بيترد عليه بسرعة. تجربة ممتازة.", rating: 4 },
];

export const faqs: FAQItem[] = [
  { id: "f-1", question: "كيف أشترك في كورس مدفوع؟", answer: "يمكنك الاشتراك عن طريق الدفع بفودافون كاش أو PayPal، أو التواصل معنا مباشرة عبر واتساب لتفعيل الاشتراك يدويًا." },
  { id: "f-2", question: "هل يمكنني مشاهدة الفيديوهات على الموبايل؟", answer: "نعم، المنصة متجاوبة بالكامل وتعمل بسلاسة على جميع الأجهزة سواء موبايل أو تابلت أو كمبيوتر." },
  { id: "f-3", question: "كم مدة تفعيل الاشتراك بعد الدفع؟", answer: "يتم تفعيل الاشتراك خلال دقائق من تأكيد عملية الدفع من قبل الإدارة، وفي حالة فودافون كاش قد يستغرق الأمر حتى ساعة." },
  { id: "f-4", question: "هل يمكن تحميل ملازم PDF؟", answer: "نعم، بعد الاشتراك في الكورس يمكنك تحميل جميع الملازم المرفقة مع كل درس." },
  { id: "f-5", question: "ماذا لو واجهت مشكلة في المشاهدة؟", answer: "يمكنك التواصل مع فريق الدعم الفني عبر واتساب وسيتم مساعدتك فورًا." },
];

export const students: Student[] = [
  { id: "s-1", name: "يوسف أحمد سيد", phone: "01012345678", email: "yousef@example.com", grade: "الثالث الثانوي", governorate: "القاهرة", avatar: img("photo-1500648767791-00dcc994a43e", 200), joinedAt: "2026-02-14", coursesSubscribed: 3, status: "active" },
  { id: "s-2", name: "مريم خالد عبد الله", phone: "01123456789", grade: "الثاني الثانوي", governorate: "الجيزة", avatar: img("photo-1544005313-94ddf0286df2", 200), joinedAt: "2026-03-02", coursesSubscribed: 1, status: "active" },
  { id: "s-3", name: "عمر سامي محمود", phone: "01234567890", email: "omar@example.com", grade: "الأول الثانوي", governorate: "الإسكندرية", avatar: img("photo-1519085360753-af0119f7cbe7", 200), joinedAt: "2026-04-20", coursesSubscribed: 2, status: "active" },
  { id: "s-4", name: "نور محمد فتحي", phone: "01555667788", grade: "الثالث الثانوي", governorate: "المنصورة", avatar: img("photo-1531123897727-8f129e1688ce", 200), joinedAt: "2026-05-11", coursesSubscribed: 0, status: "disabled" },
  { id: "s-5", name: "كريم عادل حسن", phone: "01098765432", grade: "الثاني الثانوي", governorate: "أسيوط", avatar: img("photo-1492562080023-ab3db95bfbce", 200), joinedAt: "2026-06-01", coursesSubscribed: 4, status: "active" },
];

export const payments: Payment[] = [
  { id: "p-1", studentName: "يوسف أحمد سيد", studentPhone: "01012345678", courseTitle: "أساسيات البرمجة بلغة بايثون", amount: 250, method: "vodafone_cash", status: "pending", transactionId: "VC-88213421", proofImage: img("photo-1554224155-6726b3ff858f", 500), createdAt: "2026-07-08" },
  { id: "p-2", studentName: "مريم خالد عبد الله", studentPhone: "01123456789", courseTitle: "هياكل البيانات وتراكيبها", amount: 300, method: "paypal", status: "approved", createdAt: "2026-07-06" },
  { id: "p-3", studentName: "عمر سامي محمود", studentPhone: "01234567890", courseTitle: "أساسيات علوم الحاسب - الصف الأول الثانوي", amount: 180, method: "whatsapp", status: "pending", createdAt: "2026-07-09" },
  { id: "p-4", studentName: "نور محمد فتحي", studentPhone: "01555667788", courseTitle: "التفكير الخوارزمي وحل المشكلات", amount: 220, method: "vodafone_cash", status: "rejected", transactionId: "VC-77102299", proofImage: img("photo-1580519542036-c47de6196ba5", 500), createdAt: "2026-07-04" },
  { id: "p-5", studentName: "كريم عادل حسن", studentPhone: "01098765432", courseTitle: "مقدمة في قواعد البيانات", amount: 200, method: "vodafone_cash", status: "pending", transactionId: "VC-99341122", proofImage: img("photo-1563986768609-322da13575f3", 500), createdAt: "2026-07-09" },
];

export const qrCodes: QRCode[] = [
  { id: "q-1", targetType: "course", targetTitle: "أساسيات البرمجة بلغة بايثون", targetId: "1", link: "https://codepath.example.com/qr/QR-C1X92", imageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://codepath.example.com/qr/QR-C1X92&color=0F172A&bgcolor=F8FAFC", scans: 214, createdAt: "2026-06-28" },
  { id: "q-2", targetType: "lesson", targetTitle: "الجمل الشرطية if / else", targetId: "4", link: "https://codepath.example.com/qr/QR-L4Y41", imageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://codepath.example.com/qr/QR-L4Y41&color=0F172A&bgcolor=F8FAFC", scans: 88, createdAt: "2026-07-01" },
  { id: "q-3", targetType: "pdf", targetTitle: "ملزمة الوحدة الأولى PDF", targetId: "1", link: "https://codepath.example.com/qr/QR-P1Z10", imageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://codepath.example.com/qr/QR-P1Z10&color=0F172A&bgcolor=F8FAFC", scans: 47, createdAt: "2026-07-05" },
];

export const platformStats = {
  studentsCount: 12500,
  lessonsCount: 320,
  pdfCount: 180,
  satisfactionRate: 97,
};

export const howItWorks = [
  { title: "سجل حسابك", description: "أنشئ حسابك في أقل من دقيقة برقم الهاتف." },
  { title: "اختار الكورس", description: "تصفح الكورسات واختر ما يناسب صفك الدراسي." },
  { title: "ادفع أو تواصل معنا", description: "ادفع أونلاين أو فعّل اشتراكك عبر واتساب." },
  { title: "ابدأ المشاهدة", description: "استمتع بالمحتوى وتابع تقدمك خطوة بخطوة." },
];

export const currentStudent = {
  id: "s-1",
  name: "يوسف أحمد",
  phone: "010•••••678",
  avatar: img("photo-1500648767791-00dcc994a43e", 200),
  grade: "الثالث الثانوي" as const,
};
