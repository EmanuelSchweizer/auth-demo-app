import { Checkbox } from "@heroui/react";
import type { CSSProperties } from "react";
import type { ShoppingItem } from "@/types";
import { useUpdateShoppingItem } from "@/hooks/useUpdateShoppingItem";

interface Props {
  item: ShoppingItem;
}

export const BoughtCheckBox = ({ item }: Props) => {
  const { update, loading } = useUpdateShoppingItem();
  const checkboxStyle = {
    "--accent": "rgb(91 33 182 / 0.8)",
    "--accent-foreground": "#ffffff",
  } as CSSProperties;

  return (
    <div title={item.bought ? "Mark as not bought" : "Mark as bought"}>
      <Checkbox
        isSelected={item.bought}
        onChange={() => update({ ...item, bought: !item.bought })}
        isDisabled={loading}
        style={checkboxStyle}
        aria-label={item.bought ? "Mark as not bought" : "Mark as bought"}
      >
        <Checkbox.Control className="border-violet-500 ring-gray-200 hover:ring-violet-500/50 ring-1">
          <Checkbox.Indicator className="text-white " />
        </Checkbox.Control>
      </Checkbox>
    </div>
  );
};
