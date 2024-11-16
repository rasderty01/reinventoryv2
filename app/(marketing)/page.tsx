import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { BarChart2, BoxIcon, LucideIcon, ShoppingCart } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Icon className="w-12 h-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-foreground py-20 text-white">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Reinventory</h1>
            <p className="text-xl mb-8">
              Streamline Your Inventory and Sales Management
            </p>
            <Button asChild size="lg">
              <SignUpButton mode="modal"> Get Started </SignUpButton>
            </Button>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={BoxIcon}
                title="Digital Inventory Management"
                description="Easily register items, upload barcodes, and set price tags digitally."
              />
              <FeatureCard
                icon={ShoppingCart}
                title="Automated Sales Tracking"
                description="Real-time logging of sales transactions with up-to-date insights."
              />
              <FeatureCard
                icon={BarChart2}
                title="Sales Forecasting"
                description="Automated weekly and monthly sales estimates based on historical data."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
