
import HeroSlideshow from "./HeroSlideshow";
import HomeSearch from "./HomeSearch";
import AboutSection from "./AboutSection";
import ResearchSection from "./ResearchSection";
import PortfolioSection from "./PortfolioSection";
import DonationSection from "./DonationSection";
import ContactSection from "./ContactSection";

import {
  House,
  BookOpen,
  Lightbulb,
  UserRound,
  Mail,
  Settings,
} from "lucide-react";

import {
  FaEnvelope,
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaGithub,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

const academicYears = [
  {
    year: "Fourth Year",
    description: "Core clinical rotations and foundational clinical knowledge.",
    subjects: ["Internal Medicine", "Surgery", "Paediatrics", "Obstetrics & Gynaecology"],
    number: "04",
    image: "/category-images/fourth-year.jpg",
  },
  {
    year: "Fifth Year",
    description: "Advanced clinical learning and specialised disciplines.",
    subjects: ["Medicine Subspecialties", "Surgical Subspecialties", "Past Papers"],
    number: "05",
    image: "/category-images/fifth-year.jpg",
  },
  {
    year: "Sixth Year",
    description: "Advanced clinical practice and preparation for internship.",
    subjects: ["Internal Medicine", "Surgery", "Paediatrics", "Obstetrics & Gynaecology"],
    number: "06",
    image: "/category-images/sixth-year.jpg",
  },
];

const quickLinks = [
  { name: "Home", href: "/", icon: House },
  { name: "Medical Library", href: "/library", icon: BookOpen },
  { name: "Research & Innovation", href: "/#research", icon: Lightbulb },
  { name: "About", href: "/#about", icon: UserRound },
  { name: "Contact", href: "/#contact", icon: Mail },
];

const socialLinks = [
  {
    name: "Email Me",
    href: "mailto:faraihp1@gmail.com",
    icon: FaEnvelope,
    color: "hover:text-red-400",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/260974921084",
    icon: FaWhatsapp,
    color: "hover:text-green-400",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/search/results/people/?keywords=Farai%20Mutambala",
    icon: FaLinkedin,
    color: "hover:text-blue-400",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/faraiMutambala",
    icon: FaFacebook,
    color: "hover:text-blue-400",
  },
  {
    name: "Follow me on X",
    href: "https://x.com/FMutambala98935",
    icon: FaXTwitter,
    color: "hover:text-white",
  },
  {
    name: "GitHub",
    href: "https://github.com/FaraiMutambala",
    icon: FaGithub,
    color: "hover:text-white",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <HeroSlideshow />
      <HomeSearch />

      {/* Hero section */}
      <section className="relative overflow-hidden bg-blue-950">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
          <div>
            <span className="mb-6 inline-block rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-300">
              LEARN · DISCOVER · RESEARCH · INNOVATE
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              Your journey in
              <span className="block text-sky-400">Medicine starts here.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-blue-100/80">
              Welcome to Farai&apos;s Medical Hub — a learning and knowledge
              platform bringing together medical resources, academic
              research, innovation and professional development.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="/library"
                className="rounded-lg bg-sky-500 px-7 py-4 font-semibold text-white transition hover:bg-sky-400"
              >
                Explore Medical Library →
              </a>
              <a
                href="/#about"
                className="rounded-lg border border-white/30 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Discover My Journey
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex h-72 w-72 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 md:h-96 md:w-96">
              <div className="flex h-56 w-56 items-center justify-center rounded-full border border-sky-300/30 bg-blue-900 md:h-72 md:w-72">
                <span className="text-8xl text-sky-300">✚</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
          Knowledge without boundaries
        </p>
        <h2 className="mt-4 text-3xl font-bold text-blue-950 md:text-4xl">
          One platform. Multiple possibilities.
        </h2>
        <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-600">
          A central destination for medical learning materials, research
          projects, academic resources and new ideas. Built to support
          learning, collaboration and innovation.
        </p>
      </section>

      {/* Medical library */}
      <section id="library" className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
                Academic resources
              </p>
              <h2 className="mt-3 text-3xl font-bold text-blue-950 md:text-4xl">
                Medical Library
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Explore learning resources organised according to your
                academic year and clinical disciplines.
              </p>
            </div>
            <span className="text-sm font-semibold text-sky-700">
              Browse academic years →
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {academicYears.map((item) => (
              <article
                key={item.year}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Academic year image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={`${item.year} medical students`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-950/10 to-transparent" />

                  <div className="absolute bottom-5 left-6">
                    <span className="text-5xl font-bold text-white/90">
                      {item.number}
                    </span>
                  </div>

                  <span className="absolute right-5 top-5 rounded-lg bg-white/95 px-3 py-2 text-xs font-bold tracking-wide text-blue-950">
                    ACADEMIC YEAR
                  </span>
                </div>

                {/* Academic year information */}
                <div className="p-7">
                  <h3 className="text-2xl font-bold text-blue-950 transition group-hover:text-sky-700">
                    {item.year}
                  </h3>

                  <p className="mt-3 min-h-[56px] text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>

                  <div className="my-6 h-px bg-slate-100" />

                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Available disciplines
                  </p>

                  <ul className="space-y-3">
                    {item.subjects.map((subject) => (
                      <li
                        key={subject}
                        className="flex items-center gap-3 text-sm text-slate-700"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600">
                          ✓
                        </span>
                        {subject}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`/library/${item.year.toLowerCase().replaceAll(" ", "-")}`}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-600"
                  >
                    Explore Resources
                    <span>→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Medical Resources */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
              Explore and learn
            </p>
            <h2 className="mt-3 text-3xl font-bold text-blue-950 md:text-4xl">
              Featured Medical Resources
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-600">
              Discover learning materials and clinical resources to support
              your medical education and professional development.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            <a
              href="/library/fourth-year/internal-medicine/lecture-notes"
              className="group rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl">
                📚
              </div>
              <h3 className="mt-6 text-xl font-bold text-blue-950">
                Medical Lecture Notes
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Explore organised study notes across medical disciplines.
              </p>
              <span className="mt-6 inline-block font-semibold text-sky-700 group-hover:text-blue-950">
                Explore notes →
              </span>
            </a>

            <a
              href="/library/fifth-year/renal-medicine/lecture-notes"
              className="group rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-50 text-3xl">
                🧠
              </div>
              <h3 className="mt-6 text-xl font-bold text-blue-950">
                Medical Subspecialties
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Build deeper knowledge in specialised areas of medicine.
              </p>
              <span className="mt-6 inline-block font-semibold text-sky-700 group-hover:text-blue-950">
                Explore subspecialties →
              </span>
            </a>

            <a
              href="/library/sixth-year/paediatrics/clinical-guidelines"
              className="group rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-3xl">
                🩺
              </div>
              <h3 className="mt-6 text-xl font-bold text-blue-950">
                Clinical Guidelines
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Access clinical learning and guideline collections.
              </p>
              <span className="mt-6 inline-block font-semibold text-sky-700 group-hover:text-blue-950">
                Explore guidelines →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Research */}
      <ResearchSection />

      {/* Portfolio */}
      <PortfolioSection />

      {/* Voluntary donations */}
      <DonationSection />

      {/* About */}
      <AboutSection />

      {/* Contact */}
      <ContactSection />

      {/* Footer */}
      <footer id="contact-footer" className="bg-blue-950 px-6 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">

          {/* Brand introduction */}
          <div>
            <h2 className="text-2xl font-bold tracking-wide">
              FARAI&apos;S MEDICAL HUB
            </h2>

            <p className="mt-4 max-w-sm leading-7 text-blue-100/70">
              A platform dedicated to medical education, research,
              technology, innovation and lifelong learning.
            </p>

            <div className="mt-6 h-1 w-16 rounded-full bg-sky-400" />
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-bold">Quick Links</h3>

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-3 text-sm text-blue-100/70 transition hover:translate-x-1 hover:text-sky-300"
                    >
                      <Icon
                        size={17}
                        className="text-sky-400 transition group-hover:scale-110"
                      />
                      {link.name}
                    </a>
                  </li>
                );
              })}

              <li>
                <a
                  href="/admin/login"
                  className="group flex items-center gap-3 text-sm font-semibold text-sky-300 transition hover:translate-x-1 hover:text-white"
                >
                  <Settings size={17} />
                  Admin Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact and social links */}
          <div>
            <h3 className="text-lg font-bold">Get in Touch</h3>

            <p className="mt-5 text-sm leading-7 text-blue-100/70">
              Interested in collaboration, academic discussions,
              research or technology projects? I&apos;d be glad to connect.
            </p>

            <div className="mt-6 space-y-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      social.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`group flex items-center gap-3 text-sm text-sky-300 transition hover:translate-x-1 ${social.color}`}
                  >
                    <Icon
                      size={19}
                      className="transition group-hover:scale-110"
                    />
                    {social.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-7">
          <div className="flex flex-col justify-between gap-4 text-sm text-blue-100/60 md:flex-row">
            <p>
              © 2026 Farai&apos;s Medical Hub. All rights reserved.
            </p>
            <p>Learn. Discover. Research. Innovate.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
