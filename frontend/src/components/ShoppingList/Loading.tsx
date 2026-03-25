import { Skeleton } from "@heroui/react";

export const Loading = () => {
  return (
    <div className="space-y-2 p-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-6 mb-2" />
      ))}
    </div>
  );
};
