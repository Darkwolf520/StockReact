import "@/app/globals.css";
import { cookies } from "next/headers";
import React from "react";

import Menu from "@/components/Menu/Menu";
import SideMenu from "@/components/Menu/SideMenu";
import ThemedBackground from "@/components/ThemedBackground";
import { ROLES } from "@/types/auth";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  const isAdmin = role === ROLES.ADMIN;

  return (
    <>
      <ThemedBackground />
      <div className="relative z-10">
        <Menu />
        <div className="flex flex-col-reverse sm:flex-row h-full sm:h-[calc(100vh-65px)] items-center">
          <SideMenu isAdmin={isAdmin} />
          <div className="w-full overflow-y-auto overflow-x-hidden h-full">
            <div className="w-full px-4 sm:py-2 pb-[50px] sm:mb-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
