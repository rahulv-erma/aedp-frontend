import { Skeleton } from "@nextui-org/react";

export default function TherapistsSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4">
      <Skeleton className="h-[63px] rounded-lg" />
      <Skeleton className="h-[63px] rounded-lg" />
      <Skeleton className="h-[63px] rounded-lg" />
      <Skeleton className="h-[63px] rounded-lg" />
    </div>
  );
}
