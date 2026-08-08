"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { buttonClass } from "@/components/ui/Button";
import {
  PlusIcon,
  SettingsIcon,
  SuitcaseIcon,
} from "@/components/ui/Icons";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/inventory", label: "Inventar" },
  { href: "/packing", label: "Ich verreise" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Globale Navigation: auf dem Desktop horizontal in der Kopfzeile, auf dem
 * Smartphone zusätzlich als platzsparende Leiste am unteren Rand.
 */
export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link href="/" aria-label="myown – zum Dashboard" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- statisches SVG-Logo aus /public */}
            <img src="/logo-myown.svg" alt="myown" className="h-8 w-auto" />
          </Link>

          <nav
            aria-label="Hauptnavigation"
            className="absolute left-1/2 hidden -translate-x-1/2 md:block"
          >
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={
                      isActive(pathname, item.href) ? "page" : undefined
                    }
                    className={cn(
                      "rounded-full px-4 py-2 text-[21px] font-semibold transition-colors",
                      isActive(pathname, item.href)
                        ? "bg-surface-soft text-ink"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/settings"
              aria-label="Einstellungen"
              title="Einstellungen"
              aria-current={isActive(pathname, "/settings") ? "page" : undefined}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                isActive(pathname, "/settings")
                  ? "bg-surface-soft text-ink"
                  : "text-muted hover:bg-surface-soft hover:text-ink",
              )}
            >
              <SettingsIcon />
            </Link>
            <Link
              href="/items/new"
              className={buttonClass("primary", "md", "hidden sm:inline-flex")}
            >
              <PlusIcon className="h-5 w-5" />
              Hinzufügen
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav
        aria-label="Hauptnavigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-between px-3">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[12px] font-semibold",
                  isActive(pathname, item.href) ? "text-ink" : "text-muted",
                )}
              >
                <NavIcon href={item.href} />
                {item.label}
              </Link>
            </li>
          ))}
          <li className="flex flex-1 items-center justify-center">
            <Link
              href="/items/new"
              aria-label="Gegenstand hinzufügen"
              className="inline-flex h-13 w-13 items-center justify-center rounded-full bg-ink text-white shadow-sm"
            >
              <PlusIcon className="h-7 w-7" />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

function NavIcon({ href }: { href: string }) {
  const className = "h-5 w-5";
  if (href === "/packing") return <SuitcaseIcon className={className} />;
  if (href === "/inventory") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </svg>
  );
}
