"use client";

import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../convex/_generated/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useOrganization } from "@clerk/clerk-react";
import { toast } from "sonner";
import { SettingsFormSkeleton } from "./loaders/settingsform-skeleton";

export default function SettingsForm() {
  const { organization } = useOrganization();
  const orgId = organization?.id;

  const settings = useQuery(api.settings.getSettings, { orgId: orgId ?? "" });
  const updateSettings = useMutation(api.settings.updateSettings);

  const [formData, setFormData] = useState({
    lowStockThreshold: 10,
    defaultTaxRate: 0,
    currency: "USD",
    timeZone: "UTC",
    enableLowStockAlerts: false,
    enableSalesNotifications: false,
    enableReportScheduling: false,
    reportScheduleFrequency: "weekly" as "weekly" | "daily" | "monthly",
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings?._id) {
      toast.error("Settings not loaded. Please try again.");
      return;
    }
    try {
      await updateSettings({
        settingsId: settings._id,
        ...formData,
      });
      toast.success("Settings updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings.");
    }
  };

  const isLoading = !orgId || settings === undefined;

  if (settings === null) return <div>Error: Settings not found</div>;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Organization Settings</CardTitle>
        <CardDescription>
          Manage your organization's settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SettingsFormSkeleton />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">General Settings</h3>
              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  name="lowStockThreshold"
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                <Input
                  id="defaultTaxRate"
                  name="defaultTaxRate"
                  type="number"
                  step="0.01"
                  value={formData.defaultTaxRate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="timeZone">Time Zone</Label>
                <Input
                  id="timeZone"
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Settings</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableLowStockAlerts"
                  checked={formData.enableLowStockAlerts}
                  onCheckedChange={handleSwitchChange("enableLowStockAlerts")}
                />
                <Label htmlFor="enableLowStockAlerts">
                  Enable Low Stock Alerts
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableSalesNotifications"
                  checked={formData.enableSalesNotifications}
                  onCheckedChange={handleSwitchChange(
                    "enableSalesNotifications"
                  )}
                />
                <Label htmlFor="enableSalesNotifications">
                  Enable Sales Notifications
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Report Settings</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableReportScheduling"
                  checked={formData.enableReportScheduling}
                  onCheckedChange={handleSwitchChange("enableReportScheduling")}
                />
                <Label htmlFor="enableReportScheduling">
                  Enable Report Scheduling
                </Label>
              </div>
              <div>
                <Label htmlFor="reportScheduleFrequency">
                  Report Schedule Frequency
                </Label>
                <Select
                  value={formData.reportScheduleFrequency}
                  onValueChange={handleSelectChange("reportScheduleFrequency")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit">Save Settings</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
