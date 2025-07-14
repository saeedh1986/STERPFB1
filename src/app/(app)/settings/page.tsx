
"use client";

import { useTheme } from "next-themes";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Moon, Sun, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader title="Settings" />
      <main className="flex-1 p-4 md:p-6">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application. Changes are saved automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="theme">Theme</Label>
              <RadioGroup
                id="theme"
                value={theme}
                onValueChange={setTheme}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <Label htmlFor="light" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground">
                  <RadioGroupItem value="light" id="light" className="sr-only" />
                  <Sun className="h-5 w-5" />
                  <span>Light</span>
                </Label>
                <Label htmlFor="dark" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground">
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                  <Moon className="h-5 w-5" />
                  <span>Dark</span>
                </Label>
                <Label htmlFor="system" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground">
                  <RadioGroupItem value="system" id="system" className="sr-only" />
                  <Monitor className="h-5 w-5" />
                  <span>System</span>
                </Label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
