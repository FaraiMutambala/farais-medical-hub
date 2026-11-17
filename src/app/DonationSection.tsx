
import { Heart, BookOpen, GraduationCap, ArrowRight } from "lucide-react";

export default function DonationSection() {
  return (
    <section
      id="support"
      className="relative overflow-hidden bg-blue-950 px-6 py-20 md:py-24"
    >
      {/* Decorative background elements */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        {/* Main message */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-semibold text-sky-300">
            <Heart size={16} />
            SUPPORT MEDICAL EDUCATION
          </span>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white md:text-5xl">
            Help Us Keep
            <span className="block text-sky-400">
              Learning Accessible.
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-blue-100/80">
            Farai's Medical Hub is built on the belief that knowledge
            should be accessible to everyone. Your voluntary contribution
            can help us maintain the platform, expand the medical library
            and continue developing useful educational resources.
          </p>

          <a
            href="#support-details"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-sky-500 px-7 py-4 font-bold text-white shadow-lg transition hover:bg-sky-400"
          >
            Learn How to Support
            <ArrowRight size={18} />
          </a>
        </div>

        {/* Contribution information */}
        <div
          id="support-details"
          className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm md:p-10"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300">
            <Heart size={30} />
          </div>

          <h3 className="mt-7 text-2xl font-bold text-white">
            Every Contribution Matters
          </h3>

          <p className="mt-4 leading-7 text-blue-100/70">
            Your generosity can make a difference in keeping this
            educational platform available and improving the resources
            it provides.
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-300">
                <BookOpen size={22} />
              </div>

              <div>
                <h4 className="font-semibold text-white">
                  Grow the Medical Library
                </h4>
                <p className="mt-1 text-sm leading-6 text-blue-100/60">
                  Support the addition of more educational materials
                  and learning resources.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-300">
                <GraduationCap size={22} />
              </div>

              <div>
                <h4 className="font-semibold text-white">
                  Support Free Education
                </h4>
                <p className="mt-1 text-sm leading-6 text-blue-100/60">
                  Help us keep published educational resources
                  freely accessible to everyone.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-9 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-5">
            <p className="text-center text-sm font-semibold leading-7 text-sky-100">
              All contributions are voluntary. No payment is required
              to access any published educational resource.
            </p>
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-blue-100/50">
            Thank you for supporting medical education and knowledge sharing.
          </p>
        </div>
      </div>
    </section>
  );
}
