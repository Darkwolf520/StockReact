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

export default function GhostIcon({
  icon,
  fallback,
  color,
  size = "md",
  className,
}: GhostIconProps) {
  const resolvedColor = color ?? "#000000";
  const s = sizeClasses[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "bg-white/30 border border-white/45",
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
