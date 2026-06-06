import clsx from "clsx";
import Link from "next/link";
import React, { ComponentType, SVGProps } from "react";

type SideMenuElementProps = {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
  reverseIcon?: boolean;
};

export default function SideMenuElement({
  name,
  icon: Icon,
  isActive = false,
  href,
  onClick,
  reverseIcon = false,
}: SideMenuElementProps) {
  const baseClasses = clsx(
    "group cursor-pointer flex flex-col items-center justify-center w-15",
    !isActive && "rounded-lg text-white hover:bg-[rgba(255,255,255,0.1)]",
  );

  const iconWrapperClasses = clsx(
    "size-10 flex items-center justify-center rounded-lg",
    isActive ? "bg-white" : "text-white",
  );

  const iconClasses = clsx(
    "size-8 transition-transform duration-200",
    reverseIcon && "rotate-180",
  );

  const labelClasses = clsx("hidden sm:block", isActive && "text-white");

  const content = (
    <>
      <div className={iconWrapperClasses}>
        <Icon className={iconClasses} />
      </div>

      <div className={labelClasses}>{name}</div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
