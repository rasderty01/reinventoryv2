import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, BoxIcon, DollarSign, ShoppingCart } from "lucide-react";

// This would typically come from your database or API
const dashboardData = {
  totalInventory: 1234,
  recentSales: 42,
  revenue: 9876,
  lowStockItems: 5,
};

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory
            </CardTitle>
            <BoxIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.totalInventory}
            </div>
            <p className="text-xs text-muted-foreground">items in stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.recentSales}
            </div>
            <p className="text-xs text-muted-foreground">
              in the last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.revenue}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground">
              items need restocking
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full">
              {/* Replace this with an actual chart component */}
              <div className="flex h-full items-center justify-center bg-muted">
                Sales Chart Placeholder
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>You had 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* This would typically be a mapped array of recent activities */}
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New sale: Widget X
                  </p>
                  <p className="text-sm text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Inventory update: Gadget Y
                  </p>
                  <p className="text-sm text-muted-foreground">
                    15 minutes ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button className="h-20 text-lg">
          <BoxIcon className="mr-2 h-5 w-5" /> Manage Inventory
        </Button>
        <Button className="h-20 text-lg">
          <ShoppingCart className="mr-2 h-5 w-5" /> Record Sale
        </Button>
        <Button className="h-20 text-lg">
          <BarChart className="mr-2 h-5 w-5" /> View Reports
        </Button>
        <Button className="h-20 text-lg" variant="outline">
          Settings
        </Button>
      </div>
    </div>
  );
}
