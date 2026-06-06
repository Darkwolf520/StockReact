"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { authClient } from "@/clients/AuthClient";
import SideMenuElement from "@/components/Menu/SideMenuElement";
import BankLogo from "@/icons/bank.svg";
import CategoryLogo from "@/icons/category.svg";
import HomeLogo from "@/icons/home.svg";
import LogOut from "@/icons/log-out.svg";
import UserLogo from "@/icons/users.svg";
import { useAppSelector } from "@/lib/store/store";

type SideMenuProps = {
  isAdmin: boolean;
};

export default function SideMenu({ isAdmin }: SideMenuProps) {
  const router = useRouter();
  const theme = useAppSelector((state) => state.userPreferences.theme);

  const handleLogout = async () => {
    await authClient.logout();
    router.replace("/login");
  };

  const menuItems = [
    { name: "Home", href: "/", icon: HomeLogo },
    { name: "Vendors", href: "/vendors", icon: BankLogo, adminOnly: true },
    {
      name: "Labels",
      href: "/asset-categories",
      icon: CategoryLogo,
      adminOnly: true,
    },
    { name: "Users", href: "/users", icon: UserLogo, adminOnly: true },
  ].filter((item) => !item.adminOnly || isAdmin);

  const logoutItem = {
    name: "Logout",
    icon: LogOut,
    action: handleLogout,
    reverseIcon: true,
  };

  const pathname = usePathname();

  return (
    <div
      className="fixed sm:static bottom-5 h-[50px] sm:h-full sm:w-[80px] flex
            sm:flex-col sm:gap-4 items-center sm:justify-between sm:py-2 z-10 rounded-2xl sm:rounded-none w-fit
            px-4 bg-white/70 sm:bg-transparent shadow-[0_4px_20px_4px_rgba(0,0,0,0.2)] sm:shadow-none
            border-1 border-white/30 sm:border-none
            "
      style={
        {
          "--theme-bg-first": theme.background.first,
          "--theme-bg-second": theme.background.second,
          "--theme-bg-third": theme.background.third,
        } as React.CSSProperties
      }
    >
      <div className="flex sm:flex-col gap-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <SideMenuElement
              key={item.href ?? item.name}
              name={item.name}
              icon={item.icon}
              href={item.href}
              isActive={isActive}
            />
          );
        })}
      </div>
      <SideMenuElement
        name={logoutItem.name}
        icon={logoutItem.icon}
        reverseIcon={true}
        onClick={handleLogout}
      />
    </div>
  );
}
