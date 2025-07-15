
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Moon, Sun, Monitor, FilePenLine, PlusCircle, AlertTriangle, Trash2, TextQuote, Building, Save, Languages, Landmark } from "lucide-react";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { fileToDataURI } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';


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
  { nameKey: 'settings.appearance.amber', value: 'theme-amber', class: 'bg-amber-500' },
  { nameKey: 'settings.appearance.blue', value: 'theme-blue', class: 'bg-blue-500' },
  { nameKey: 'settings.appearance.green', value: 'theme-green', class: 'bg-green-500' },
];

const fontSizes = [
    { nameKey: 'settings.accessibility.default', value: 'text-base' },
    { nameKey: 'settings.accessibility.medium', value: 'text-lg' },
    { nameKey: 'settings.accessibility.large', value: 'text-xl' },
];


export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme, themes } = useTheme();
  const { fontSize, setFontSize } = useAccessibility();
  const { profile, setProfile } = useCompanyProfile();
  const { t, language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();
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
  const pageTitle = t('settings.chart_of_accounts.title');

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
      toast({ title: t('settings.toast.account_updated'), description: t('settings.toast.account_updated_desc') });
    } else {
      const newAccount = { ...values, id: `coa-${Date.now()}` };
      setAccounts(prev => [newAccount, ...prev]);
      toast({ title: t('settings.toast.account_created'), description: t('settings.toast.account_created_desc') });
    }
    setIsDialogOpen(false);
  };
  
  const handleResetData = () => {
    localStorage.clear();
    toast({
      title: t('settings.toast.app_reset'),
      description: t('settings.toast.app_reset_desc'),
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleProfileSubmit: SubmitHandler<CompanyProfile> = (data) => {
    setProfile(data);
    toast({ title: t('settings.toast.profile_updated'), description: t('settings.toast.profile_saved_desc') });
  };
  
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        try {
            const dataUri = await fileToDataURI(file);
            profileForm.setValue('logo', dataUri);
        } catch (error) {
            toast({ variant: "destructive", title: t('settings.toast.logo_upload_failed'), description: t('settings.toast.logo_upload_failed_desc') });
        }
    }
  };


  return (
    <>
      <PageHeader title={t('settings.title')} />
      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Building /> {t('settings.company_profile.title')}</CardTitle>
                    <CardDescription>{t('settings.company_profile.description')}</CardDescription>
                </CardHeader>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
                        <CardContent className="space-y-4">
                            <FormField
                                control={profileForm.control} name="logo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('settings.company_profile.logo')}</FormLabel>
                                        <div className="flex items-center gap-4">
                                            {field.value && <img src={field.value} alt="Logo Preview" className="h-16 w-16 rounded-md object-contain border p-1" />}
                                            <Input type="file" accept="image/*" onChange={handleLogoUpload} className="max-w-xs"/>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField control={profileForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>{t('settings.company_profile.company_name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="erpName" render={({ field }) => (<FormItem><FormLabel>{t('settings.company_profile.erp_name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>{t('settings.company_profile.description_address')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="website" render={({ field }) => (<FormItem><FormLabel>{t('settings.company_profile.website')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>{t('settings.company_profile.email')}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="whatsapp" render={({ field }) => (<FormItem><FormLabel>{t('settings.company_profile.whatsapp')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit"><Save className="mr-2" /> {t('settings.company_profile.save_profile')}</Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>{t('settings.appearance.title')}</CardTitle>
                    <CardDescription>
                    {t('settings.appearance.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="theme">{t('settings.appearance.mode')}</Label>
                        <RadioGroup
                            id="theme"
                            value={theme}
                            onValueChange={(value) => setTheme(value)}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2"
                        >
                            <Label htmlFor="light" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground" aria-label="Set light theme">
                            <RadioGroupItem value="light" id="light" className="sr-only" />
                            <Sun className="h-5 w-5" />
                            <span>{t('settings.appearance.light')}</span>
                            </Label>
                            <Label htmlFor="dark" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground" aria-label="Set dark theme">
                            <RadioGroupItem value="dark" id="dark" className="sr-only" />
                            <Moon className="h-5 w-5" />
                            <span>{t('settings.appearance.dark')}</span>
                            </Label>
                            <Label htmlFor="system" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground" aria-label="Set system theme">
                            <RadioGroupItem value="system" id="system" className="sr-only" />
                            <Monitor className="h-5 w-5" />
                            <span>{t('settings.appearance.system')}</span>
                            </Label>
                        </RadioGroup>
                    </div>

                    <Separator />

                    <div>
                        <Label htmlFor="theme-color">{t('settings.appearance.theme_color')}</Label>
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
                                 aria-label={`Set ${color.nameKey} theme color`}
                               >
                                    <RadioGroupItem value={color.value} id={color.value} className="sr-only" />
                                    <div className={`h-6 w-6 rounded-full ${color.class}`}></div>
                                    <span>{t(color.nameKey)}</span>
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
                    {t('settings.accessibility.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.accessibility.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="font-size">{t('settings.accessibility.font_size')}</Label>
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
                         aria-label={`Set font size to ${size.nameKey}`}
                       >
                            <RadioGroupItem value={size.value} id={size.value} className="sr-only" />
                            <span>{t(size.nameKey)}</span>
                        </Label>
                    ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Languages />{t('settings.language.title')}</CardTitle>
                    <CardDescription>{t('settings.language.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={language} onValueChange={(v) => setLanguage(v as 'en' | 'ar')} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Label htmlFor="lang-en" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground">
                            <RadioGroupItem value="en" id="lang-en" />
                            <span>{t('settings.language.english')}</span>
                        </Label>
                        <Label htmlFor="lang-ar" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground">
                             <RadioGroupItem value="ar" id="lang-ar" />
                            <span>{t('settings.language.arabic')}</span>
                        </Label>
                    </RadioGroup>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Landmark />{t('settings.accounting.title')}</CardTitle>
                    <CardDescription>{t('settings.accounting.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label>{t('settings.accounting.currency')}</Label>
                     <RadioGroup value={currency} onValueChange={(v) => setCurrency(v as 'AED' | 'USD')} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <Label htmlFor="curr-aed" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground">
                            <RadioGroupItem value="AED" id="curr-aed" />
                            <span>AED (United Arab Emirates Dirham)</span>
                        </Label>
                        <Label htmlFor="curr-usd" className="p-4 border rounded-md cursor-pointer hover:bg-accent flex items-center gap-4 has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground">
                             <RadioGroupItem value="USD" id="curr-usd" />
                            <span>USD (United States Dollar)</span>
                        </Label>
                    </RadioGroup>
                </CardContent>
            </Card>

             <Card className="shadow-lg border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle />
                  {t('settings.danger_zone.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.danger_zone.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  {t('settings.danger_zone.reset_text_1')}
                </p>
                <p className="text-sm font-medium">
                  {t('settings.danger_zone.reset_text_2')}
                </p>
              </CardContent>
              <CardFooter>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> {t('settings.danger_zone.reset_button')}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('settings.danger_zone.reset_dialog_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('settings.danger_zone.reset_dialog_description')}
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>{t('settings.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetData} className="bg-destructive hover:bg-destructive/90">
                            {t('settings.danger_zone.reset_dialog_confirm')}
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
                    <CardTitle>{t('settings.chart_of_accounts.title')}</CardTitle>
                    <CardDescription>{t('settings.chart_of_accounts.description')}</CardDescription>
                </div>
                <Button variant="outline" onClick={handleCreate}><PlusCircle className="mr-2 h-4 w-4" /> {t('settings.chart_of_accounts.add_account')}</Button>
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
