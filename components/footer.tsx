import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export function Footer() {
  return (
    <div className="flex h-20 items-center  justify-center bg-secondary">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          © 2024 Reinventory. All rights reserved.
        </div>
        <div className="flex items-center gap-8 text-xs">
          <Link
            href={"/privacy-policy"}
            className={cn(buttonVariants({ size: "sm", variant: "link" }))}
          >
            Privacy Policy
          </Link>
          <Link
            href={"/terms-of-service"}
            className={cn(buttonVariants({ size: "sm", variant: "link" }))}
          >
            Terms of Service
          </Link>
          <Link
            href={"/about"}
            className={cn(buttonVariants({ size: "sm", variant: "link" }))}
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
