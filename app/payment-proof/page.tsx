import { Upload, Clock3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PaymentProofPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-bg py-14">
        <div className="container-app max-w-xl">
          <div className="card-surface p-8">
            <h1 className="font-heading text-2xl font-extrabold text-navy text-center">تأكيد عملية الدفع</h1>
            <p className="mt-2 text-center text-sm text-ink">
              أرسل بيانات التحويل ليتم مراجعتها وتفعيل اشتراكك في أسرع وقت
            </p>

            <form className="mt-8 flex flex-col gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-navy">اسم الطالب</label>
                <input
                  type="text"
                  placeholder="الاسم بالكامل"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-navy">رقم هاتف الطالب</label>
                <input
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-navy">اسم الكورس</label>
                <input
                  type="text"
                  placeholder="مثال: أساسيات البرمجة بلغة بايثون"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-navy">رقم العملية (Transaction ID)</label>
                <input
                  type="text"
                  placeholder="مثال: VC-12345678"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-navy">صورة إيصال الدفع</label>
                <div className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-10 text-center hover:border-brand/40">
                  <Upload className="h-6 w-6 text-ink" />
                  <p className="text-xs text-ink">اضغط لرفع صورة الإيصال (JPG, PNG)</p>
                </div>
              </div>

              <button className="rounded-xl bg-brand py-3.5 font-bold text-white shadow-card hover:brightness-110">
                إرسال للمراجعة
              </button>
            </form>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-warning/5 p-4">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <p className="text-xs leading-relaxed text-ink">
                طلبك الآن قيد المراجعة من فريقنا، وسيتم تفعيل الاشتراك خلال دقائق وحتى ساعة كحد أقصى بعد التأكد من العملية.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
