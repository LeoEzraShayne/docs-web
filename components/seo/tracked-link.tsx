"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackSeoEvent, type SeoEventName } from "@/lib/analytics";

const variants = {
  primary:
    "border-amber-400/70 bg-amber-400 text-slate-950 hover:bg-amber-300",
  secondary:
    "border-slate-700 bg-slate-900 text-slate-100 hover:border-amber-400/50 hover:text-amber-100",
  ghost:
    "border-transparent bg-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-950/50 hover:text-white",
  text:
    "border-transparent bg-transparent px-0 py-0 text-amber-200 hover:text-amber-100",
} as const;

export function TrackedLink({
  href,
  children,
  eventName,
  ctaPosition,
  assetName,
  variant = "primary",
  download,
  className: extraClassName = "",
}: {
  href: string;
  children: React.ReactNode;
  eventName: SeoEventName;
  ctaPosition: string;
  assetName?: string;
  variant?: keyof typeof variants;
  download?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const className = `inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition ${variants[variant]} ${extraClassName}`;
  const onClick = () =>
    trackSeoEvent(eventName, {
      pagePath: pathname,
      ctaPosition,
      assetName,
    });

  if (download) {
    return (
      <a href={href} download={download} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
