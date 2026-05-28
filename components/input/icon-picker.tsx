"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Bike,
  Bitcoin,
  Bookmark,
  Briefcase,
  Building2,
  Bus,
  Car,
  CircleDollarSign,
  Coffee,
  CreditCard,
  Dumbbell,
  Flame,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  Laptop,
  type LucideIcon,
  Monitor,
  Music,
  Phone,
  PiggyBank,
  Pizza,
  Plane,
  Plug,
  Repeat,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Stethoscope,
  TrendingUp,
  Trophy,
  Tv,
  Utensils,
  Wallet,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const ICON_MAP: Record<string, LucideIcon> = {
  "arrow-down-left": ArrowDownLeft,
  "arrow-up-right": ArrowUpRight,
  banknote: Banknote,
  bike: Bike,
  bitcoin: Bitcoin,
  bookmark: Bookmark,
  briefcase: Briefcase,
  building: Building2,
  bus: Bus,
  car: Car,
  "circle-dollar": CircleDollarSign,
  coffee: Coffee,
  "credit-card": CreditCard,
  dumbbell: Dumbbell,
  flame: Flame,
  gamepad: Gamepad2,
  gift: Gift,
  "graduation-cap": GraduationCap,
  heart: Heart,
  home: Home,
  landmark: Landmark,
  laptop: Laptop,
  monitor: Monitor,
  music: Music,
  phone: Phone,
  "piggy-bank": PiggyBank,
  pizza: Pizza,
  plane: Plane,
  plug: Plug,
  repeat: Repeat,
  shield: Shield,
  "shopping-bag": ShoppingBag,
  "shopping-cart": ShoppingCart,
  smartphone: Smartphone,
  sparkles: Sparkles,
  star: Star,
  stethoscope: Stethoscope,
  "trending-up": TrendingUp,
  trophy: Trophy,
  tv: Tv,
  utensils: Utensils,
  wallet: Wallet,
  wifi: Wifi,
  wrench: Wrench,
  zap: Zap,
};

const ALL_ICONS = Object.entries(ICON_MAP);

export function IconByName({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={className} style={style} />;
}

type FormIconPickerItemProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  accentColor?: string;
};

export function FormIconPickerItem<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  control,
  name,
  label,
  accentColor,
}: FormIconPickerItemProps<TFieldValues, TName>) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = search
    ? ALL_ICONS.filter(([key]) => key.includes(search.toLowerCase()))
    : ALL_ICONS;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedIcon = field.value as string;

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                      !selectedIcon && "text-muted-foreground",
                    )}
                  >
                    {selectedIcon ? (
                      <>
                        <IconByName
                          name={selectedIcon}
                          className="size-4"
                          style={
                            accentColor ? { color: accentColor } : undefined
                          }
                        />
                        <span>{selectedIcon}</span>
                      </>
                    ) : (
                      "Select an icon..."
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-72 p-0"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <div className="p-2">
                    <Input
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search icons..."
                      className="h-8"
                    />
                  </div>
                  <div className="grid max-h-48 grid-cols-6 gap-1 overflow-y-auto p-2 pt-0">
                    {filtered.map(([key, Icon]) => (
                      <button
                        key={key}
                        type="button"
                        title={key}
                        onClick={() => {
                          field.onChange(key);
                          setOpen(false);
                          setSearch("");
                        }}
                        className={cn(
                          "flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:bg-accent",
                          selectedIcon === key &&
                            "bg-primary text-primary-foreground hover:bg-primary/90",
                        )}
                      >
                        <Icon className="size-4" />
                      </button>
                    ))}
                    {filtered.length === 0 && (
                      <div className="col-span-6 py-3 text-center text-xs text-muted-foreground">
                        No icons found
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
