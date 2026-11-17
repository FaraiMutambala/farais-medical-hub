
"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    title: "The Journey Behind the Hub",
    description:
      "A journey shaped by learning, ambition and a passion for medicine.",
    image: "/images/farai-journey.jpg",
    position: "35% center",
  },
  {
    title: "Learning Together in Medicine",
    description:
      "Celebrating the people, experiences and shared learning that shape medical education.",
    image: "/images/medical-team.jpg",
    position: "center",
  },
  {
    title: "Excellence in Medical Education",
    description:
      "Explore learning materials designed to support your journey through medical school.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80",
    position: "center",
  },
  {
    title: "Learn. Research. Innovate.",
    description:
      "Building knowledge, developing ideas and contributing to the future of healthcare.",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600&q=80",
    position: "center",
  },
  {
    title: "Knowledge Beyond the Classroom",
    description:
      "Access study resources, clinical learning materials and academic support in one place.",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=80",
    position: "center",
  },
];

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((previous) => (previous + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentSlide(
      (previous) => (previous - 1 + slides.length) % slides.length
    );
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[420px] overflow-hidden bg-slate-950 sm:h-[520px] lg:h-[600px]">
      {/* Background image */}
      <div
        key={slide.image}
        className="absolute inset-0 scale-105 animate-[fadeIn_700ms_ease-in-out] bg-cover transition-all duration-700"
        style={{
          backgroundImage: `url("${slide.image}")`,
          backgroundPosition: slide.position,
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/25" />

      {/* Slide content */}
      <div className="relative z-10 flex h-full items-center px-12 sm:px-16 md:px-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300 sm:mb-4 sm:text-sm sm:tracking-[0.25em]">
              Farai&apos;s Medical Hub
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              {slide.title}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:mt-6 sm:text-lg sm:leading-relaxed">
              {slide.description}
            </p>

            <a
              href="/library"
              className="mt-6 inline-block rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 sm:mt-8 sm:px-7 sm:py-4 sm:text-base"
            >
              Explore Medical Library →
            </a>
          </div>
        </div>
      </div>

      {/* Previous slide */}
      <button
        type="button"
        onClick={previousSlide}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-lg text-white backdrop-blur transition hover:bg-white/40 sm:left-5 sm:h-12 sm:w-12 sm:text-xl"
      >
        &#8592;
      </button>

      {/* Next slide */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-lg text-white backdrop-blur transition hover:bg-white/40 sm:right-5 sm:h-12 sm:w-12 sm:text-xl"
      >
        &#8594;
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-7 sm:gap-3">
        {slides.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index ? "true" : undefined}
            className={`flex h-8 items-center justify-center rounded-full transition-all ${
              currentSlide === index ? "w-10" : "w-8"
            }`}
          >
            <span
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === index
                  ? "w-7 bg-sky-400"
                  : "w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
