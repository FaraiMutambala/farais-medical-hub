
"use client";

import { useState } from "react";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Medical Library", href: "/library" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <a
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-xl font-bold text-white">
            F
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-blue-950">
              FARAI&apos;S
            </p>
            <p className="text-xs font-semibold tracking-widest text-sky-600">
              MEDICAL HUB
            </p>
          </div>
        </a>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
          {navigationLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-700 transition hover:text-sky-600"
            >
              {link.label}
            </a>
          ))}

          <a
            href="/#support"
            className="rounded-lg bg-sky-500 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-sky-600"
          >
            ♥ Donate
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-blue-950 transition hover:bg-slate-100 md:hidden"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-6 py-5 shadow-lg md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navigationLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/#support"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-lg bg-sky-500 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-sky-600"
            >
              ♥ Donate
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
