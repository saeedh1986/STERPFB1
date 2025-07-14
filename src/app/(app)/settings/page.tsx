
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Moon, Sun, Monitor, FilePenLine, PlusCircle, AlertTriangle, Trash2, TextQuote, Building, Save } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { chartOfAccountsData as initialChartOfAccountsData, getColumns, type GenericItem } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataFormDialog } from '@/components/DataFormDialog';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useCompanyProfile, type CompanyProfile } from '@/context/CompanyProfileContext';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';


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

const themeColors = [
  { name: 'Amber', value: 'theme-amber', class: 'bg-amber-500' },
  { name: 'Blue', value: 'theme-blue', class: 'bg-blue-500' },
  { name: 'Green', value: 'theme-green', class: 'bg-green-500' },
];

const fontSizes = [
    { name: 'Default', value: 'text-base' },
    { name: 'Medium', value: 'text-lg' },
    { name: 'Large', value: 'text-xl' },
];

// Helper to convert file to data URI
const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme, themes } = useTheme();
  const { fontSize, setFontSize } = useAccessibility();
  const { profile, setProfile } = useCompanyProfile();
  const { toast } = useToast();

  const [accounts, setAccounts] = useState<GenericItem[]>(initialChartOfAccountsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<GenericItem | null>(null);
  
  const [currentColorTheme, setCurrentColorTheme] = useState('theme-amber');

  const profileForm = useForm<CompanyProfile>({
      defaultValues: profile,
  });

  useEffect(() => {
    if(profile) {
        profileForm.reset(profile);
    }
  }, [profile, profileForm]);

  useEffect(() => {
    const currentThemeClass = themes.find(t => t.startsWith('theme-') && document.documentElement.classList.contains(t));
    setCurrentColorTheme(currentThemeClass || 'theme-amber');
  }, [themes, theme]);


  const handleThemeChange = (newTheme: string) => {
    const currentMode = resolvedTheme; // 'light' or 'dark'
    themeColors.forEach(t => document.documentElement.classList.remove(t.value));
    setTheme(newTheme);
    setCurrentColorTheme(newTheme);
    if (currentMode && !document.documentElement.classList.contains(currentMode)) {
      document.documentElement.classList.add(currentMode);
    }
  };


  const columns = getColumns('chart-of-accounts');
  const pageTitle = 'Chart of Accounts';

  const handleCreate = () => {
    setSelectedAccount(null);
    setIsDialogOpen(true);
  };

  const handleUpdate = (account: GenericItem) => {
    setSelectedAccount(account);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (values: GenericItem) => {
    if (selectedAccount) {
      setAccounts(prev => prev.map(acc => acc.id === selectedAccount.id ? { ...acc, ...values } : acc));
      toast({ title: "Account Updated", description: "The account has been successfully updated." });
    } else {
      const newAccount = { ...values, id: `coa-${Date.now()}` };
      setAccounts(prev => [newAccount, ...prev]);
      toast({ title: "Account Created", description: "A new account has been successfully added." });
    }
    setIsDialogOpen(false);
  };
  
  const handleResetData = () => {
    localStorage.clear();
    toast({
      title: "Application Reset",
      description: "All data has been cleared. The application will now reload.",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleProfileSubmit: SubmitHandler<CompanyProfile> = (data) => {
    setProfile(data);
    toast({ title: "Profile Updated", description: "Your company profile has been saved." });
  };
  
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        try {
            const dataUri = await fileToDataURI(file);
            profileForm.setValue('logo', dataUri);
        } catch (error) {
            toast({ variant: "destructive", title: "Logo Upload Failed", description: "Could not read the selected file." });
        }
    }
  };


  return (
    <>
      <PageHeader title="Settings" />
      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Building /> Company Profile</CardTitle>
                    <CardDescription>Update your company's information and logo.</CardDescription>
                </CardHeader>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
                        <CardContent className="space-y-4">
                            <FormField
                                control={profileForm.control} name="logo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Logo</FormLabel>
                                        <div className="flex items-center gap-4">
                                            {field.value && <img src={field.value} alt="Logo Preview" className="h-16 w-16 rounded-md object-contain border p-1" />}
                                            <Input type="file" accept="image/*" onChange={handleLogoUpload} className="max-w-xs"/>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField control={profileForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="erpName" render={({ field }) => (<FormItem><FormLabel>ERP System Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Company Description / Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="whatsapp" render={({ field }) => (<FormItem><FormLabel>WhatsApp</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit"><Save className="mr-2" /> Save Profile</Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                    Customize the look and feel of the application. Changes are saved automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="theme">Mode</Label>
                        <RadioGroup
                            id="theme"
                            value={theme}
                            onValueChange={(value) => setTheme(value)}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2"
                        >
                            <Label htmlFor="light" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground" aria-label="Set light theme">
                            <RadioGroupItem value="light" id="light" className="sr-only" />
                            <Sun className="h-5 w-5" />
                            <span>Light</span>
                            </Label>
                            <Label htmlFor="dark" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground" aria-label="Set dark theme">
                            <RadioGroupItem value="dark" id="dark" className="sr-only" />
                            <Moon className="h-5 w-5" />
                            <span>Dark</span>
                            </Label>
                            <Label htmlFor="system" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground" aria-label="Set system theme">
                            <RadioGroupItem value="system" id="system" className="sr-only" />
                            <Monitor className="h-5 w-5" />
                            <span>System</span>
                            </Label>
                        </RadioGroup>
                    </div>

                    <Separator />

                    <div>
                        <Label htmlFor="theme-color">Theme Color</Label>
                        <RadioGroup
                            id="theme-color"
                            value={currentColorTheme}
                            onValueChange={handleThemeChange}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2"
                        >
                            {themeColors.map((color) => (
                               <Label 
                                 key={color.value}
                                 htmlFor={color.value} 
                                 className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:ring-2 has-[input:checked]:ring-primary"
                                 aria-label={`Set ${color.name} theme color`}
                               >
                                    <RadioGroupItem value={color.value} id={color.value} className="sr-only" />
                                    <div className={`h-6 w-6 rounded-full ${color.class}`}></div>
                                    <span>{color.name}</span>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>

                </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TextQuote />
                    Accessibility
                </CardTitle>
                <CardDescription>
                  Adjust font sizes for better readability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="font-size">Font Size</Label>
                <RadioGroup
                    id="font-size"
                    value={fontSize}
                    onValueChange={setFontSize}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2"
                >
                    {fontSizes.map((size) => (
                       <Label 
                         key={size.value}
                         htmlFor={size.value} 
                         className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center justify-center has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground"
                         aria-label={`Set font size to ${size.name}`}
                       >
                            <RadioGroupItem value={size.value} id={size.value} className="sr-only" />
                            <span>{size.name}</span>
                        </Label>
                    ))}
                </RadioGroup>
              </CardContent>
            </Card>

             <Card className="shadow-lg border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  These actions are destructive and cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  Resetting the application will clear all stored data, including inventory, sales, expenses, and settings.
                </p>
                <p className="text-sm font-medium">
                  The application will be restored to its original demonstration state.
                </p>
              </CardContent>
              <CardFooter>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Reset Application Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all application data from your browser's local storage and reload the page.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetData} className="bg-destructive hover:bg-destructive/90">
                            Yes, Reset Data
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>

        </div>

        <Card className="shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <div>
                    <CardTitle>Chart of Accounts</CardTitle>
                    <CardDescription>Manage your general ledger accounts.</CardDescription>
                </div>
                <Button variant="outline" onClick={handleCreate}><PlusCircle className="mr-2 h-4 w-4" /> Add Account</Button>
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
                        {accounts.map((account) => (
                            <TableRow key={account.id}>
                                <TableCell className="font-mono">{account.code}</TableCell>
                                <TableCell className="font-medium">{account.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`border-transparent ${getBadgeVariantForAccountType(account.type as string)}`}>
                                        {account.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     <Button variant="ghost" size="icon" onClick={() => handleUpdate(account)} aria-label={`Edit account ${account.name}`}>
                                        <FilePenLine className="h-4 w-4" />
                                        <span className="sr-only">Edit Account for {account.name}</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>

      <DataFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleFormSubmit}
        defaultValues={selectedAccount}
        columns={columns.filter(c => c.accessorKey !== 'id')}
        title={selectedAccount ? `Edit ${pageTitle}` : `Create New ${pageTitle}`}
      />
    </>
  );
}
