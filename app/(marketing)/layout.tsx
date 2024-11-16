import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
