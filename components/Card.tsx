import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva("border border-[#E0E3E7] rounded-4xl p-6", {
  variants: {
    variant: {
      default: "bg-white/20",
      strong: "bg-white/30",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const BOX_SHADOWS: Record<string, string> = {
  default:
    "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(255,255,255,0.1)",
  strong:
    "0 16px 48px rgba(0,0,0,0.22), inset 0 1.5px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.15)",
};

type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    children: ReactNode;
  };

export default function Card({
  className,
  children,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant }), className)}
      style={{ boxShadow: BOX_SHADOWS[variant ?? "default"] }}
      {...props}
    >
      {children}
    </div>
  );
}
