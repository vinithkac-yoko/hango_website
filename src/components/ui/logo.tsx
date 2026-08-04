import Image from "next/image";

const sources = {
  red: { full: "/brand/hango-logo-red.png", mark: "/brand/hango-mark-red.png" },
  white: { full: "/brand/hango-logo-white.png", mark: "/brand/hango-mark-white.png" },
} as const;

export default function Logo({
  variant = "red",
  as = "full",
  className,
}: {
  /** "red" for light backgrounds, "white" for dark/red backgrounds */
  variant?: "red" | "white";
  /** "full" is the icon + wordmark lockup, "mark" is the icon alone */
  as?: "full" | "mark";
  className?: string;
}) {
  const src = sources[variant][as];
  const dimensions = as === "mark" ? { width: 157, height: 217 } : { width: 371, height: 374 };

  return (
    <Image
      src={src}
      alt="Hango"
      width={dimensions.width}
      height={dimensions.height}
      priority
      className={className}
    />
  );
}
