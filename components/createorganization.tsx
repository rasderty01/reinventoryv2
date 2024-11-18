"use client";

import { CreateOrganization } from "@clerk/nextjs";

export default function CreateClerkOrganization() {
  return (
    <CreateOrganization
      afterCreateOrganizationUrl={"/dashboard"}
      hideSlug
      routing="hash"
    />
  );
}
