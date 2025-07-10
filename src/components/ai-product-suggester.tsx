"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Lightbulb, PackageCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { suggestProductsForQuoteAction } from "@/app/sales/create-quote/actions";
import type { SuggestProductsForQuoteOutput } from "@/ai/flows/suggest-products-for-quote";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

const formSchema = z.object({
  customerPreferences: z.string().min(10, {
    message: "Please describe customer preferences in at least 10 characters.",
  }),
  pastInteractions: z.string().optional(),
});

export function AiProductSuggester() {
  const [suggestions, setSuggestions] = useState<SuggestProductsForQuoteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerPreferences: "",
      pastInteractions: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);

    const formData = new FormData();
    formData.append("customerPreferences", values.customerPreferences);
    if (values.pastInteractions) {
        formData.append("pastInteractions", values.pastInteractions);
    }
    
    const result = await suggestProductsForQuoteAction(formData);

    setIsLoading(false);

    if (result.success) {
      setSuggestions(result.data!);
    } else {
        toast({
            variant: "destructive",
            title: "Error suggesting products",
            description: result.error || "An unexpected error occurred.",
        });
    }
  }

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle>AI Product Suggester</CardTitle>
        </div>
        <CardDescription>
          Describe your customer's needs and get instant product recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Looking for a durable laptop for video editing, budget is around $1500.'"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pastInteractions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past Interactions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Previously bought a high-end mouse and keyboard.'"
                      {...field}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Thinking...' : 'Get Suggestions'}
              {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </Form>
      </CardContent>
      {(isLoading || suggestions) && (
        <CardFooter className="flex flex-col items-start gap-4 border-t px-6 py-4">
            <h3 className="font-semibold flex items-center gap-2 text-foreground">
                <Lightbulb className="h-5 w-5" />
                Suggestions
            </h3>
            {isLoading && <SuggestionsSkeleton />}
            {suggestions && (
            <div className="w-full space-y-4">
                <div className="p-4 bg-muted rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">{suggestions.reasoning}</p>
                </div>
                <div className="space-y-2">
                    {suggestions.suggestedProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-background rounded-md border hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <PackageCheck className="h-5 w-5 text-primary" />
                                <span className="font-medium">{product}</span>
                            </div>
                            <Button size="sm" variant="outline">Add</Button>
                        </div>
                    ))}
                </div>
            </div>
            )}
        </CardFooter>
      )}
    </Card>
  );
}

function SuggestionsSkeleton() {
    return (
        <div className="w-full space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}
