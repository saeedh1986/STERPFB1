
"use client";

import { useTheme } from "next-themes";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Moon, Sun, Monitor, FilePenLine, PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { chartOfAccountsData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const getBadgeVariantForAccountType = (type: string) => {
    switch (type) {
        case 'Asset': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        case 'Liability': return 'bg-red-100 text-red-800 hover:bg-red-200';
        case 'Equity': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
        case 'Revenue': return 'bg-green-100 text-green-800 hover:bg-green-200';
        case 'Expense': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
        default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader title="Settings" />
      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
            <Card className="shadow-lg">
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
        </div>

        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle>Chart of Accounts</CardTitle>
                    <CardDescription>Manage your general ledger accounts.</CardDescription>
                </div>
                <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Account</Button>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Account Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {chartOfAccountsData.map((account) => (
                            <TableRow key={account.id}>
                                <TableCell className="font-mono">{account.code}</TableCell>
                                <TableCell className="font-medium">{account.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`border-transparent ${getBadgeVariantForAccountType(account.type as string)}`}>
                                        {account.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     <Button variant="ghost" size="icon">
                                        <FilePenLine className="h-4 w-4" />
                                        <span className="sr-only">Edit Account</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </>
  );
}
