import Logo from "@/components/Logo";
import NotificationLogo from "@/icons/notification.svg";

export default function Menu() {
  return (
    <div className="h-[65px] flex items-center justify-between px-4 w-full">
      <Logo size="size-8" href="/" />
      <div className="relative cursor-pointer">
        {/*<div className="size-2 bg-red-500 absolute right-1 top-0.5 rounded-full"></div>*/}
        <NotificationLogo className="size-8 text-gray-500" />
      </div>
    </div>
  );
}
