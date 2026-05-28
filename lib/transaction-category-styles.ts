type TransactionCategoryStyle = {
  icon: string;
  color: string;
};

const styles: Record<string, TransactionCategoryStyle> = {
  salary: { icon: "banknote", color: "#00910a" },
  transfer: { icon: "arrow-up-right", color: "#000000" },
  other: { icon: "bookmark", color: "#04c4ab" },
  investment: { icon: "trending-up", color: "#bd0d00" },
  purchase: { icon: "shopping-bag", color: "#c48b04" },
};

export function getTransactionCategoryStyle(
  name: string,
): TransactionCategoryStyle {
  const key = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return styles[key] ?? { icon: "", color: "#000000" };
}
