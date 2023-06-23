"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import { useParams } from "next/navigation";

export const FilterModeSelector = () => {
  const { slug, filter = "new" } = useParams();
  

  return (
    <div className="flex gap-2">
      <Link
        className={buttonVariants({ variant: "subtle" })}
        href={`/c/${slug}/new`}
      >
        new
        {filter === "new" && <span>(you are here)</span>}
      </Link>
      <Link
        className={buttonVariants({ variant: "subtle" })}
        href={`/c/${slug}/old`}
      >
        old
        {filter === "old" && <span>(you are here)</span>}
      </Link>
    </div>
  );
};
