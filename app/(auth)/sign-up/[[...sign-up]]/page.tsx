import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      path="/sign-up"
      afterSignOutUrl={"/"}
      fallbackRedirectUrl={"/onboarding"}
      signInUrl="/sign-in"
      signInFallbackRedirectUrl={"/onboarding"}
    />
  );
}
