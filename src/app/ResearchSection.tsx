
export default function ResearchSection() {
  return (
    <section
      id="research"
      className="bg-slate-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-sky-400">
            Research & Academic Work
          </p>

          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Exploring questions that matter in healthcare.
          </h2>

          <p className="text-lg leading-8 text-slate-300">
            An overview of my academic research, scientific interests
            and contributions to medical knowledge.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl sm:p-10">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">
                  Undergraduate Research
                </span>

                <span className="text-sm text-slate-400">
                  Copperbelt University
                </span>
              </div>

              <h3 className="mb-6 text-2xl font-bold leading-snug sm:text-3xl">
                Consumption of Energy Drinks Among Long-Distance
                Drivers in Ndola and the Associated Factors
              </h3>

              <p className="mb-8 leading-8 text-slate-300">
                This research examines energy drink consumption among
                long-distance drivers in Ndola, Zambia, and explores
                factors associated with consumption, awareness of
                potential health effects and selected cardiovascular
                risk indicators.
              </p>

              <div className="mb-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-900 p-5">
                  <p className="mb-2 text-sm text-slate-400">Study location</p>
                  <p className="font-semibold">Ndola, Zambia</p>
                </div>

                <div className="rounded-2xl bg-slate-900 p-5">
                  <p className="mb-2 text-sm text-slate-400">Study design</p>
                  <p className="font-semibold">Cross-sectional study</p>
                </div>

                <div className="rounded-2xl bg-slate-900 p-5">
                  <p className="mb-2 text-sm text-slate-400">Study population</p>
                  <p className="font-semibold">Long-distance drivers</p>
                </div>

                <div className="rounded-2xl bg-slate-900 p-5">
                  <p className="mb-2 text-sm text-slate-400">Sample size</p>
                  <p className="font-semibold">385 participants</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-sky-300">
                  Research focus
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Energy drink consumption",
                    "Occupational health",
                    "Cardiovascular risk",
                    "Health awareness",
                    "Public health",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/20 to-indigo-500/10 p-8">
              <div className="mb-5 text-3xl">🔬</div>
              <h3 className="mb-3 text-xl font-bold">
                Evidence-based thinking
              </h3>
              <p className="leading-7 text-slate-300">
                Interested in applying scientific evidence and
                research methods to understand health challenges
                and improve healthcare outcomes.
              </p>
            </div>

            <div className="flex-1 rounded-3xl border border-white/10 bg-white/[0.05] p-8">
              <div className="mb-5 text-3xl">📚</div>
              <h3 className="mb-3 text-xl font-bold">
                Continuous learning
              </h3>
              <p className="leading-7 text-slate-300">
                Committed to lifelong learning, academic development
                and exploring the intersection of medicine,
                technology and innovation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
