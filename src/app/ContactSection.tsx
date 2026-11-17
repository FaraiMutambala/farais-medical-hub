
"use client";

import {
  FaEnvelope,
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaGithub,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { IconType } from "react-icons";

const contacts: {
  name: string;
  detail: string;
  href: string;
  icon: IconType;
  color: string;
}[] = [
  {
    name: "Email",
    detail: "faraihp1@gmail.com",
    href: "mailto:faraihp1@gmail.com",
    icon: FaEnvelope,
    color: "text-red-500",
  },
  {
    name: "WhatsApp",
    detail: "0974921084",
    href: "https://wa.me/260974921084",
    icon: FaWhatsapp,
    color: "text-green-500",
  },
  {
    name: "LinkedIn",
    detail: "Farai Mutambala",
    href: "https://www.linkedin.com/search/results/people/?keywords=Farai%20Mutambala",
    icon: FaLinkedin,
    color: "text-blue-600",
  },
  {
    name: "Facebook",
    detail: "faraiMutambala",
    href: "https://www.facebook.com/faraiMutambala",
    icon: FaFacebook,
    color: "text-blue-500",
  },
  {
    name: "X",
    detail: "@FMutambala98935",
    href: "https://x.com/FMutambala98935",
    icon: FaXTwitter,
    color: "text-white",
  },
  {
    name: "GitHub",
    detail: "FaraiMutambala",
    href: "https://github.com/FaraiMutambala",
    icon: FaGithub,
    color: "text-white",
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-slate-950 px-6 py-20 text-white sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-sky-400">
            Get in Touch
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Let's Connect
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            I welcome opportunities to connect, collaborate, exchange ideas,
            and explore projects at the intersection of medicine, research,
            education, and technology.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => {
            const Icon = contact.icon;

            return (
              <a
                key={contact.name}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  contact.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:bg-white/[0.08]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 transition duration-300 group-hover:bg-sky-500/20">
                  <Icon
                    size={27}
                    className={`${contact.color} transition duration-300 group-hover:scale-110`}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-white">
                    {contact.name}
                  </h3>

                  <p className="mt-1 break-words text-sm text-slate-400 transition group-hover:text-sky-300">
                    {contact.detail}
                  </p>
                </div>

                <span className="ml-auto text-xl text-slate-500 transition group-hover:translate-x-1 group-hover:text-sky-400">
                  →
                </span>
              </a>
            );
          })}
        </div>

        <div className="mt-14 rounded-3xl border border-sky-400/20 bg-gradient-to-r from-sky-950/80 to-slate-900 p-8 text-center sm:p-12">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Have an idea or a project in mind?
          </h3>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
            Whether it's a research collaboration, medical education initiative,
            technology project, or simply an opportunity to exchange ideas,
            I'd be glad to hear from you.
          </p>

          <a
            href="mailto:faraihp1@gmail.com"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-sky-500 px-7 py-4 font-bold text-white transition hover:bg-sky-400"
          >
            <FaEnvelope size={19} />
            Send Me an Email
          </a>
        </div>
      </div>
    </section>
  );
}
