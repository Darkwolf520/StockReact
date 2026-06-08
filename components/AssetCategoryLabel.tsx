import GhostIcon from "@/components/GhostIcon";
import { Category } from "@/types/domain";

export default function AssetCategoryLabel({
  category,
}: {
  category: Category;
}) {
  const icon = category.style?.icon;

  if (icon) {
    return (
      <GhostIcon
        icon={icon}
        fallback={category.name[0]?.toUpperCase()}
        color={category.style?.color}
        size="md"
      />
    );
  }

  return (
    <div className="py-1 px-2 rounded-2xl h-8 w-fit bg-white/20 border border-white/30 text-white text-sm backdrop-blur-sm">
      {category.name}
    </div>
  );
}
