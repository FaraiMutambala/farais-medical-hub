
import Image from "next/image";

const interests = [
  "Medical Education",
  "Clinical Medicine",
  "Scientific Research",
  "Healthcare Innovation",
  "Technology",
];

export default function AboutSection() {
  return (
    <section id="about" className="overflow-hidden bg-blue-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mb-14 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Get to know me
          </p>
          <h2 className="mt-4 text-3xl font-bold text-blue-950 md:text-5xl">
            The Person Behind the Platform
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
            A journey driven by curiosity, a passion for medicine
            and the desire to make a meaningful difference.
          </p>
        </div>

        <div className="grid items-center gap-16 md:grid-cols-2">

          {/* Personal photograph */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl border-2 border-sky-400" />

            <div className="relative overflow-hidden rounded-3xl bg-blue-950 shadow-2xl">
              <Image
                src="/images/farai-journey.jpg"
                alt="Farai in formal attire"
                width={900}
                height={1200}
                className="h-[420px] w-full object-cover object-[35%_center] sm:h-[520px]"
                priority
              />
            </div>

            <div className="absolute -bottom-6 -right-3 rounded-2xl bg-blue-950 px-5 py-4 text-white shadow-xl sm:-right-6 sm:px-7">
              <p className="text-sm font-semibold text-sky-300">
                Farai Mutambala
              </p>
              <p className="mt-1 text-sm font-bold sm:text-base">
                Medicine. Research. Innovation.
              </p>
            </div>
          </div>

          {/* Personal introduction */}
          <div className="pt-6 md:pt-0">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
              A little about me
            </p>

            <h3 className="mt-4 text-3xl font-bold leading-tight text-blue-950 md:text-4xl">
              Exploring the intersection of medicine and technology.
            </h3>

            <p className="mt-6 leading-8 text-slate-600">
              Hello, I&apos;m Farai Mutambala, an MBChB medical student
              at Copperbelt University with a growing interest in
              medical education, scientific research and healthcare
              innovation.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              My journey in medicine has strengthened my appreciation
              for scientific thinking, continuous learning and the
              importance of evidence-based healthcare. I am particularly
              interested in exploring research questions that address
              real-world health challenges.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Beyond the traditional boundaries of medicine, I enjoy
              exploring technology, digital development and creative
              problem-solving. I believe that combining medical knowledge
              with technology creates opportunities to improve how we
              learn, communicate and approach healthcare challenges.
            </p>

            {/* Areas of interest */}
            <div className="mt-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-blue-950">
                Areas of interest
              </h4>

              <div className="mt-4 flex flex-wrap gap-3">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-blue-900 shadow-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <a
              href="#contact"
              className="mt-9 inline-flex items-center rounded-lg bg-blue-900 px-7 py-4 font-semibold text-white transition hover:bg-sky-700"
            >
              Connect With Me →
            </a>
          </div>
        </div>

        {/* Vision */}
        <div className="mt-24 rounded-3xl bg-blue-950 px-7 py-12 text-center shadow-xl sm:px-12 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
            My Vision
          </p>

          <h3 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl">
            Learn. Discover. Research. Innovate.
          </h3>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-blue-100/80">
            To continually develop knowledge, explore meaningful
            research questions and embrace innovation while contributing
            to a future where medicine, technology and creativity work
            together to make a positive impact.
          </p>

          <div className="mx-auto mt-8 h-1 w-20 rounded-full bg-sky-400" />
        </div>
      </div>
    </section>
  );
}
