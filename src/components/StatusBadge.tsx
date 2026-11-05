import { STATUS_LABEL } from "@/lib/item-format";
import type { ItemStatus } from "@/types/item";

const STATUS_STYLE: Record<ItemStatus, string> = {
  available: "bg-green-100 text-green-800",
  reserved: "bg-yellow-100 text-yellow-800",
  sold: "bg-gray-200 text-gray-700",
};

type StatusBadgeProps = {
  status: ItemStatus;
  className?: string;
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[status]} ${className}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
