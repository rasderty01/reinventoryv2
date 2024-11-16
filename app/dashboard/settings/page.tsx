"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useUser();
  const updateSettings = useMutation(api.settings.update);

  const [projectName, setProjectName] = useState("");
  const [rootDirectory, setRootDirectory] = useState("/web");
  const [includeOutsideFiles, setIncludeOutsideFiles] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateSettings({
        userId: user?.id,
        projectName,
        rootDirectory,
        includeOutsideFiles,
        enableNotifications,
      });
      toast.success("Settings updated", {
        description: "Your settings have been successfully saved.",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "There was a problem updating your settings.",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project Settings</CardTitle>
            <CardDescription>
              Manage your project details and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rootDirectory">Root Directory</Label>
              <Input
                id="rootDirectory"
                value={rootDirectory}
                onChange={(e) => setRootDirectory(e.target.value)}
                placeholder="Enter root directory"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeOutsideFiles"
                checked={includeOutsideFiles}
                onCheckedChange={(checked) =>
                  setIncludeOutsideFiles(checked as boolean)
                }
              />
              <Label htmlFor="includeOutsideFiles">
                Include files from outside of the Root Directory
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Manage your notification preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableNotifications"
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
              <Label htmlFor="enableNotifications">Enable notifications</Label>
            </div>
          </CardContent>
        </Card>

        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
}
