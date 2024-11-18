"use client";

import {
  ClerkLoading,
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { BarChart2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  return (
    <div className="bg-primary-foreground border-b py-4 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href={"/"}
          className="flex items-center gap-2 text-2xl font-medium tracking-tight"
        >
          <BarChart2 className="size-8" />
          Reinventory
        </Link>
        <div className="flex gap-2">
          <ClerkLoading>
            <div className="flex h-12 items-center gap-4">
              <Skeleton className="h-10 w-48 " />
              <Skeleton className="size-9 rounded-full" />
            </div>
          </ClerkLoading>
          <SignedIn>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/inventory">Inventory</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/sales">Sales</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/reports">Reports</Link>
              </Button>
              <div className="flex items-center pt-2">
                <OrganizationSwitcher hidePersonal />
              </div>
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode="modal"
              fallbackRedirectUrl="/onboarding"
              signUpFallbackRedirectUrl="/onboarding"
            >
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
