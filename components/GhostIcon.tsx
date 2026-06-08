import { IconByName } from "@/components/input/icon-picker";
import { cn } from "@/lib/utils";

type GhostIconProps = {
  icon?: string | null;
  fallback?: string;
  color?: string | null;
  size?: "sm" | "md";
  className?: string;
};

const sizeClasses = {
  sm: { wrapper: "size-7", icon: "size-3.5", text: "text-xs" },
  md: { wrapper: "size-9", icon: "size-5", text: "text-sm" },
};

function isNearWhite(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return r > 220 && g > 220 && b > 220;
}

export default function GhostIcon({
  icon,
  fallback,
  color,
  size = "md",
  className,
}: GhostIconProps) {
  const raw = color ?? "#000000";
  const resolvedColor = isNearWhite(raw) ? "#1a1a2e" : raw;
  const s = sizeClasses[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "bg-white/30 border border-white/45  shadow-[0_4px_14px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.7)]",
        s.wrapper,
        className,
      )}
    >
      {icon ? (
        <IconByName
          name={icon}
          className={s.icon}
          style={{ color: resolvedColor }}
        />
      ) : fallback ? (
        <span
          className={cn("font-semibold", s.text)}
          style={{ color: resolvedColor }}
        >
          {fallback}
        </span>
      ) : null}
    </span>
  );
}
