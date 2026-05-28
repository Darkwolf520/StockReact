import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva("border rounded-4xl backdrop-blur-lg", {
  variants: {
    variant: {
      default:
        "p-5 bg-white/30 border-white/45 shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.1)]",
      strong:
        "p-6 bg-white/35 border-white/60 shadow-[0_16px_48px_rgba(0,0,0,0.22),inset_0_1.5px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(255,255,255,0.15)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

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
    <div className={cn(cardVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}
