
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { logisticsOptimization, type LogisticsOptimizationInput, type LogisticsOptimizationOutput } from '@/ai/flows/logistics-optimization';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

const FormSchema = z.object({
  historicalDataFile: z.custom<FileList>().refine(files => files && files.length > 0, 'Historical data file is required.'),
  timeOfYear: z.string().min(1, 'Time of year is required.'),
  currentTrafficConditions: z.string().min(1, 'Current traffic conditions are required.'),
  optimizationGoals: z.string().min(1, 'Optimization goals are required.'),
});

type FormValues = z.infer<typeof FormSchema>;

// Helper to convert file to data URI
const fileToDataURI = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export function LogisticsOptimizationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LogisticsOptimizationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      timeOfYear: '',
      currentTrafficConditions: '',
      optimizationGoals: '',
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);

    try {
      const historicalDataFile = data.historicalDataFile[0];
      const historicalDataURI = await fileToDataURI(historicalDataFile);
      
      const input: LogisticsOptimizationInput = {
        historicalData: historicalDataURI,
        timeOfYear: data.timeOfYear,
        currentTrafficConditions: data.currentTrafficConditions,
        optimizationGoals: data.optimizationGoals,
      };

      const output = await logisticsOptimization(input);
      setResult(output);
      toast({
        title: "Optimization Complete",
        description: "Logistics suggestions have been generated.",
      });
    } catch (error) {
      console.error("Logistics Optimization Error:", error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Logistics Optimization Inputs</CardTitle>
              <CardDescription>Provide the necessary information to generate optimal logistics routes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="historicalDataFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Logistics Data (.xlsm, .xlsx, .csv)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".xlsm, .xlsx, .csv"
                        onChange={(e) => field.onChange(e.target.files)} 
                      />
                    </FormControl>
                    <FormDescription>Upload the Excel or CSV file containing historical logistics data.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeOfYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time of Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Q4, Winter, Peak Season" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentTrafficConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Traffic Conditions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Heavy congestion on M1, Roadworks on A52" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optimizationGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Optimization Goals</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Minimize cost, Minimize delivery time, Maximize reliability" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Insights
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {result && (
        <Card className="shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="font-headline">Optimization Results</CardTitle>
            <CardDescription>Based on the provided data, here are the suggested logistics optimizations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Suggested Routes:</h3>
              {result.suggestedRoutes.length > 0 ? (
                <ul className="list-disc list-inside pl-4">
                  {result.suggestedRoutes.map((route, index) => <li key={index}>{route}</li>)}
                </ul>
              ) : <p className="text-muted-foreground">No routes suggested.</p>}
            </div>
            <div>
              <h3 className="font-semibold text-lg">Estimated Costs:</h3>
              {result.estimatedCosts.length > 0 ? (
                <ul className="list-disc list-inside pl-4">
                  {result.estimatedCosts.map((cost, index) => <li key={index}>Route {index + 1}: د.إ {cost.toFixed(2)}</li>)}
                </ul>
              ) : <p className="text-muted-foreground">No cost estimations available.</p>}
            </div>
            <div>
              <h3 className="font-semibold text-lg">Estimated Times:</h3>
              {result.estimatedTimes.length > 0 ? (
                <ul className="list-disc list-inside pl-4">
                  {result.estimatedTimes.map((time, index) => <li key={index}>Route {index + 1}: {time}</li>)}
                </ul>
              ) : <p className="text-muted-foreground">No time estimations available.</p>}
            </div>
            <div>
              <h3 className="font-semibold text-lg">Reliability Scores:</h3>
              {result.reliabilityScores.length > 0 ? (
              <ul className="list-disc list-inside pl-4">
                {result.reliabilityScores.map((score, index) => <li key={index}>Route {index + 1}: {score.toFixed(2)}/1.00</li>)}
              </ul>
              ) : <p className="text-muted-foreground">No reliability scores available.</p>}
            </div>
            {result.notes && (
              <div>
                <h3 className="font-semibold text-lg">Additional Notes:</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{result.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
