"use client";

export function Logo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <img
      src="/icon.png?v=3"
      alt="Vinamah"
      className={`${className} rounded-md object-cover`}
      onError={(e) => {
        console.error("Failed to load icon:", e);
        (e.target as HTMLImageElement).src = "/icon.png";
      }}
    />
  );
}

